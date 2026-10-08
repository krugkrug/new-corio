#!/usr/bin/env python3
"""Cliente de la API de notas (home.sanchezbella.com/api/notas). v1.0.0

Solo librería estándar de Python. Lee la clave de HOME_NOTAS_API_KEY y nunca
la imprime. Uso:

  nota.py listar
  nota.py leer <slug>
  nota.py anexar <slug> [--titulo T]    < texto.md    (añade al final)
  nota.py guardar <slug> [--titulo T]   < texto.md    (sustituye la nota entera)

Código de salida: 0 bien · 2 conflicto (alguien editó entre medias) · 1 otro error.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

VERSION = "1.0.0"
URL = os.environ.get("NOTAS_URL", "https://home.sanchezbella.com/api/notas")
SLUG_RE = re.compile(r"^[a-z0-9]+(?:[-/][a-z0-9]+)*$")


def salir(msg, codigo=1):
    print(msg, file=sys.stderr)
    sys.exit(codigo)


def clave():
    k = os.environ.get("HOME_NOTAS_API_KEY", "")
    if not k:
        salir("Falta la variable de entorno HOME_NOTAS_API_KEY (la clave de la API de notas).")
    return k


def pedir(metodo, query=None, cuerpo=None):
    url = URL + ("?" + urllib.parse.urlencode(query) if query else "")
    datos = json.dumps(cuerpo).encode("utf-8") if cuerpo is not None else None
    req = urllib.request.Request(url, data=datos, method=metodo)
    req.add_header("Authorization", "Bearer " + clave())
    req.add_header("User-Agent", "alf-notas/" + VERSION)
    if datos is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8") or "{}")
        except ValueError:
            return e.code, {"error": "respuesta no JSON"}
    except urllib.error.URLError as e:
        salir("No llego a %s (%s). Si es una sesión cloud, puede que el dominio no esté "
              "permitido en la política de red del entorno." % (URL, e.reason))


def slug_valido(slug):
    if not SLUG_RE.match(slug or ""):
        salir("Slug no válido: usa minúsculas, números y guiones (y «/» para carpetas), p. ej. «caza/esplegares».")


def leer_nota(slug):
    codigo, r = pedir("GET", {"slug": slug, "fresh": "1"})
    if codigo == 401:
        salir("401: la clave no es válida o no está configurada en el servidor.")
    if codigo != 200:
        salir("Error %s leyendo: %s" % (codigo, r.get("error", r)))
    return r


def escribir(slug, markdown, meta, previo):
    cuerpo = {"markdown": markdown, "meta": meta, "sha": previo.get("sha", "")}
    # Nota antigua que solo vive en Blob: el servidor pide su fecha para crearla en el repo.
    if previo.get("sha", "") == "" and previo.get("markdown") is not None:
        cuerpo["ifMatch"] = previo.get("actualizado", "")
    return pedir("POST", {"slug": slug}, cuerpo)


def meta_para(slug, previo, titulo):
    meta = dict(previo.get("meta") or {})
    if titulo:
        meta["titulo"] = titulo
    elif not meta.get("titulo"):
        meta["titulo"] = slug.split("/")[-1].replace("-", " ").capitalize()
    return meta


def guardar(slug, titulo, anexar):
    texto = sys.stdin.read().strip("\n")
    if not texto.strip():
        salir("No hay texto: pásalo por la entrada estándar (< archivo.md o con un heredoc).")
    for intento in range(3 if anexar else 1):
        previo = leer_nota(slug)
        actual = previo.get("markdown")
        md = (actual.rstrip("\n") + "\n\n" + texto) if (anexar and actual) else texto
        codigo, r = escribir(slug, md, meta_para(slug, previo, titulo), previo)
        if codigo == 200:
            print(json.dumps({"ok": True, "slug": slug, "commit": r.get("commit"), "sha": r.get("sha")}))
            return
        if codigo == 409:
            continue  # al anexar se relee y se reintenta; al guardar se corta abajo
        salir("Error %s guardando: %s" % (codigo, r.get("error", r)))
    salir("Conflicto: alguien editó la nota entre medias. Vuelve a leerla y reintenta.", 2)


def main():
    a = sys.argv[1:]
    if not a or a[0] in ("-h", "--help"):
        print(__doc__)
        return
    if a[0] == "--version":
        print(VERSION)
        return
    cmd = a[0]
    if cmd == "listar":
        codigo, r = pedir("GET", {"fresh": "1"})
        if codigo != 200:
            salir("Error %s: %s" % (codigo, r.get("error", r)))
        for n in sorted(r.get("notas", []), key=lambda n: n["slug"]):
            print("%s\t%s\t%s" % (n["slug"], n.get("titulo", ""), n.get("actualizado", "")))
        return
    if len(a) < 2:
        salir("Falta el slug. Uso: nota.py %s <slug>" % cmd)
    slug = a[1]
    slug_valido(slug)
    titulo = a[a.index("--titulo") + 1] if "--titulo" in a and a.index("--titulo") + 1 < len(a) else None
    if cmd == "leer":
        r = leer_nota(slug)
        if r.get("markdown") is None:
            salir("La nota «%s» no existe todavía." % slug)
        print(r["markdown"])
    elif cmd in ("guardar", "anexar"):
        guardar(slug, titulo, cmd == "anexar")
    else:
        salir("Orden desconocida «%s». Usa listar, leer, anexar o guardar." % cmd)


if __name__ == "__main__":
    main()

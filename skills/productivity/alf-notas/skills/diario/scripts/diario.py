#!/usr/bin/env python3
"""Diario de un sitio (v1.0.0): añade una entrada y actualiza el «Recap» de una nota.

Solo librería estándar de Python. Reutiliza nota.py (la skill /nota) para hablar
con la API de notas, así que usa la misma clave: HOME_NOTAS_API_KEY.

Estructura que mantiene en la nota (lo demás no se toca):

  ## Recap            ← resumen vigente (lo que mostrará la lista enlazada)
  _Actualizado: AAAA-MM-DD_
  - …
  ## Diario           ← entradas, la más reciente primero
  ### AAAA-MM-DD · origen
  …

Uso:
  diario.py ver <slug>
  diario.py aplicar <slug> [--entrada E.md] [--recap R.md] [--fecha AAAA-MM-DD]
                           [--origen TEXTO] [--simular]
  diario.py aplicar --archivo NOTA.md [--entrada …] [--recap …]   (solo simula)

Código de salida: 0 bien · 2 conflicto (alguien editó entre medias) · 1 otro error.
"""
import difflib
import importlib.util
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

VERSION = "1.0.0"
RECAP = "## Recap"
DIARIO = "## Diario"
ACTUALIZADO_RE = re.compile(r"^_Actualizado:")
FECHA_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _cargar_nota():
    ruta = Path(__file__).resolve().parents[2] / "nota" / "scripts" / "nota.py"
    spec = importlib.util.spec_from_file_location("nota_cliente", ruta)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo


def hoy():
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo("Europe/Madrid")).date().isoformat()
    except Exception:
        return datetime.now().date().isoformat()


# ---------- lectura de la estructura (ignora lo que hay dentro de bloques de código)

def _h2(lineas):
    """Posiciones de los encabezados «## …» que no están dentro de un bloque ```."""
    dentro = False
    for i, linea in enumerate(lineas):
        if linea.lstrip().startswith("```"):
            dentro = not dentro
        elif not dentro and linea.startswith("## "):
            yield i


def _seccion(lineas, titulo):
    """(inicio, fin) de la sección H2 con ese título exacto, o None. fin = siguiente H2."""
    posiciones = list(_h2(lineas))
    for n, i in enumerate(posiciones):
        if lineas[i].strip() == titulo:
            fin = posiciones[n + 1] if n + 1 < len(posiciones) else len(lineas)
            return i, fin
    return None


def _sin_bloques(texto):
    """Líneas del texto que no están dentro de un bloque de código."""
    dentro = False
    for linea in texto.split("\n"):
        if linea.lstrip().startswith("```"):
            dentro = not dentro
        elif not dentro:
            yield linea


def _validar(texto, nombre, prohibidos):
    for linea in _sin_bloques(texto):
        for prefijo, alternativa in prohibidos:
            if linea.startswith(prefijo):
                raise ValueError(
                    "En %s hay una línea que empieza por «%s» (%s). %s"
                    % (nombre, prefijo.strip(), linea[:60], alternativa))


def _limpiar_recap(texto):
    lineas = texto.strip("\n").split("\n")
    while lineas and (not lineas[0].strip() or ACTUALIZADO_RE.match(lineas[0])):
        lineas.pop(0)
    return lineas


# ---------- transformación (función pura, es lo que prueban los tests)

def aplicar(md, entrada=None, recap=None, fecha=None, origen="Claude"):
    fecha = fecha or hoy()
    if not FECHA_RE.match(fecha):
        raise ValueError("La fecha debe ser AAAA-MM-DD, p. ej. 2026-10-08.")
    lineas = md.rstrip("\n").split("\n")

    if recap is not None:
        _validar(recap, "el recap", [("# ", "Usa viñetas o texto plano."), ("## ", "Usa viñetas o texto plano.")])
        cuerpo = _limpiar_recap(recap)
        if not cuerpo:
            raise ValueError("El recap está vacío.")
        bloque = [RECAP, "", "_Actualizado: %s_" % fecha, ""] + cuerpo + [""]
        sec = _seccion(lineas, RECAP)
        if sec:
            lineas = lineas[:sec[0]] + bloque + lineas[sec[1]:]
        else:
            primeras = list(_h2(lineas))
            if primeras:
                i = primeras[0]
                lineas = lineas[:i] + bloque + lineas[i:]
            else:
                lineas = lineas + [""] + bloque

    if entrada is not None:
        _validar(entrada, "la entrada", [
            ("# ", "Dentro de una entrada, los subtítulos empiezan en «####»."),
            ("## ", "Dentro de una entrada, los subtítulos empiezan en «####»."),
            ("### ", "Dentro de una entrada, los subtítulos empiezan en «####»."),
        ])
        cuerpo = entrada.strip("\n").split("\n")
        if not "".join(cuerpo).strip():
            raise ValueError("La entrada está vacía.")
        bloque = ["### %s · %s" % (fecha, origen), ""] + cuerpo + [""]
        sec = _seccion(lineas, DIARIO)
        if sec:
            i = sec[0] + 1
            while i < len(lineas) and not lineas[i].strip():
                i += 1
            lineas = lineas[:sec[0] + 1] + [""] + bloque + lineas[i:]
        else:
            lineas = lineas + ["", DIARIO, ""] + bloque

    return "\n".join(lineas).rstrip("\n") + "\n"


def resumen(md):
    """Lo que necesita ver Claude antes de redactar: el recap y las entradas, sin la nota entera."""
    lineas = md.rstrip("\n").split("\n")
    salida = ["Nota de %d líneas." % len(lineas), ""]
    sec = _seccion(lineas, RECAP)
    if sec:
        salida += ["--- Recap actual ---"] + lineas[sec[0]:sec[1]]
    else:
        salida += ["(Esta nota todavía no tiene sección «## Recap».)"]
    sec = _seccion(lineas, DIARIO)
    if sec:
        cuerpo = lineas[sec[0] + 1:sec[1]]
        cabeceras = [i for i, l in enumerate(cuerpo) if l.startswith("### ")]
        salida += ["", "--- Entradas del diario (la más reciente primero) ---"]
        salida += [cuerpo[i] for i in cabeceras] or ["(sin entradas)"]
        if cabeceras:
            fin = cabeceras[1] if len(cabeceras) > 1 else len(cuerpo)
            salida += ["", "--- Última entrada ---"] + cuerpo[cabeceras[0]:fin][:60]
    else:
        salida += ["", "(Esta nota todavía no tiene sección «## Diario».)"]
    return "\n".join(salida)


# ---------- línea de órdenes

def _salir(nota, msg, codigo=1):
    print(msg, file=sys.stderr)
    sys.exit(codigo)


def _opcion(args, nombre):
    if nombre in args:
        i = args.index(nombre)
        if i + 1 >= len(args):
            _salir(None, "Falta el valor de %s." % nombre)
        return args[i + 1]
    return None


def _leer_archivo(ruta):
    try:
        return Path(ruta).read_text(encoding="utf-8")
    except OSError as e:
        _salir(None, "No puedo leer %s (%s)." % (ruta, e))


def main():
    a = sys.argv[1:]
    if not a or a[0] in ("-h", "--help"):
        print(__doc__)
        return
    if a[0] == "--version":
        print(VERSION)
        return
    nota = _cargar_nota()
    cmd = a[0]
    archivo = _opcion(a, "--archivo")
    slug = a[1] if len(a) > 1 and not a[1].startswith("--") else None
    if cmd not in ("ver", "aplicar"):
        _salir(nota, "Orden desconocida «%s». Usa ver o aplicar." % cmd)
    if slug is None and archivo is None:
        _salir(nota, "Falta el slug de la nota. Uso: diario.py %s <slug>" % cmd)
    if slug:
        nota.slug_valido(slug)

    if cmd == "ver":
        previo = {"markdown": _leer_archivo(archivo)} if archivo else nota.leer_nota(slug)
        if previo.get("markdown") is None:
            _salir(nota, "La nota «%s» no existe todavía." % slug)
        print(resumen(previo["markdown"]))
        return

    entrada = _leer_archivo(_opcion(a, "--entrada")) if _opcion(a, "--entrada") else None
    recap = _leer_archivo(_opcion(a, "--recap")) if _opcion(a, "--recap") else None
    if entrada is None and recap is None:
        _salir(nota, "Pasa al menos --entrada o --recap.")
    fecha = _opcion(a, "--fecha")
    origen = _opcion(a, "--origen") or "repo %s" % os.path.basename(os.getcwd())
    simular = "--simular" in a or archivo is not None

    for intento in range(3):
        previo = {"markdown": _leer_archivo(archivo)} if archivo else nota.leer_nota(slug)
        actual = previo.get("markdown")
        if actual is None:
            _salir(nota, "La nota «%s» no existe todavía: créala antes con /nota guardar." % slug)
        try:
            nuevo = aplicar(actual, entrada, recap, fecha, origen)
        except ValueError as e:
            _salir(nota, "No se puede aplicar: %s" % e)
        if nuevo.rstrip("\n") == actual.rstrip("\n"):
            print("Sin cambios: la nota ya está así.")
            return
        if simular:
            diff = difflib.unified_diff(actual.splitlines(), nuevo.splitlines(), "antes", "después", lineterm="", n=1)
            print("\n".join(diff))
            return
        codigo, r = nota.escribir(slug, nuevo.rstrip("\n"), nota.meta_para(slug, previo, None), previo)
        if codigo == 200:
            print(json.dumps({"ok": True, "slug": slug, "commit": r.get("commit"), "sha": r.get("sha")}))
            return
        if codigo == 409:
            continue  # alguien editó entre medias: se relee y se vuelve a aplicar
        _salir(nota, "Error %s guardando: %s" % (codigo, r.get("error", r)))
    _salir(nota, "Conflicto: alguien editó la nota entre medias. Vuelve a leerla y reintenta.", 2)


if __name__ == "__main__":
    main()

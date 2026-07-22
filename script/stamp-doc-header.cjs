#!/usr/bin/env node
// Sella la fecha+hora del indicador de versión obligatorio (ver
// meta/WEBAPP_GUARDRAILS_DEVOPS.md §1.2) en la cabecera de los .md que lo llevan.
//
// Busca, en cualquier parte del archivo, algo como:
//   **Última actualización:** 2026-07-22 10:18 — corrige autorreferencia del liquidador
// y sustituye solo la fecha+hora (YYYY-MM-DD HH:MM) por las ACTUALES. Si el
// archivo no tiene esa línea, no lo toca — así el hook puede correr sobre
// cualquier .md staged sin arriesgarse a modificar los que no llevan este patrón.
//
// No toca la descripción tras el "—": esa es una decisión semántica del
// autor (qué cambió), no algo que deba inferir un script.
//
// Se invoca con los .md staged como argumentos:
//   node script/stamp-doc-header.cjs <archivo1> <archivo2> ...
// Plano en CommonJS (.cjs) a propósito: corre igual con `node` puro, con o
// sin package.json, en repos Node (vía lint-staged) o estáticos (vía
// .githooks/pre-commit) — sin depender de tsx ni de "type": "module".
"use strict";
const fs = require("fs");

const FECHA_RE =
  /(\*\*Última actualización:\*\*\s*)\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?=\s*(—|$))/;

// Siempre en hora de Madrid (CET/CEST según la época del año), no en la
// zona horaria local de la máquina/runner donde corra el hook.
function ahora() {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (tipo) => partes.find((p) => p.type === tipo).value;
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

for (const archivo of process.argv.slice(2)) {
  const contenido = fs.readFileSync(archivo, "utf8");
  if (!FECHA_RE.test(contenido)) continue;
  const actualizado = contenido.replace(FECHA_RE, `$1${ahora()}`);
  if (actualizado !== contenido) fs.writeFileSync(archivo, actualizado);
}

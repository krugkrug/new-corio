---
name: guardar-plan
description: Guarda el plan de la sesión actual de Claude (el plan de trabajo aprobado antes de desarrollar) como un Markdown en claudeblmds/, dentro de krugkrug/meta. Úsala cuando el usuario diga "guarda el plan", "guarda este plan" o "archiva el plan de la sesión". También ofrécela, en una línea, justo después de que Alfredo apruebe un plan (ExitPlanMode) en cualquier repo — sin guardar nada sin que lo confirme. No confundir con la skill `boceto`: esa es una maqueta HTML visual en el repo del producto; esta es una nota de texto sobre qué se decidió hacer y por qué, archivada siempre en krugkrug/meta.
---

# Guardar plan de sesión

Archivo histórico de planes aprobados: qué se decidió construir y por qué,
para poder consultarlo o retomarlo más tarde sin depender de la memoria de la
sesión. No sustituye la cola de tareas (`panel-tareas/`, skill `tasks`) — esto
es un nivel por debajo, antes de que algo se convierta en tarea ejecutable.

## Cuándo actúa

- **A petición explícita**: "guarda el plan", "guarda este plan", "archiva el
  plan de la sesión".
- **Ofrecida, no automática**: justo tras aprobar un plan (salida de modo
  plan) en cualquier repo, ofrece en una línea guardarlo — nunca lo guardes
  sin confirmación explícita, aunque el repo activo no sea `krugkrug/meta`.

## Qué guarda

El plan tal y como quedó aprobado (o el último borrador discutido si aún no se
ha aprobado formalmente) — sin resumir de más ni añadir pasos que no se
discutieron.

## Dónde y cómo

Siempre en `claudeblmds/` dentro de `krugkrug/meta` — si la sesión trabaja en
otro repo, el archivo va igual a `meta` (es el repositorio de referencia
personal de Alfredo), nunca al repo del código.

1. `git pull` de `krugkrug/meta` antes de escribir (puede haber otra sesión
   escribiendo ahí).
2. Nombre de archivo: `YYYY-MM-DD-<repo>-<slug-del-objetivo>.md` (fecha de
   hoy, `repo` = `owner/repo` en formato corto sin barra, ej. `meta` o
   `krugkrug-ratioc`, slug en kebab-case, máx. ~6 palabras).
3. Contenido:

```markdown
# <Objetivo del plan>

**Fecha:** YYYY-MM-DD · **Repo:** owner/repo · **Sesión:** <id de sesión si se conoce, o "—">

## Objetivo

<una o dos frases: qué decisión habilita este plan>

## Plan aprobado

<el plan, tal cual — pasos, alcance, lo que queda fuera>

## Estado

- [ ] Sin empezar / En curso / Hecho — actualiza a mano si retomas este plan.
```

4. `git add claudeblmds/<archivo>`, commit (`docs(claudeblmds): guarda plan de <objetivo corto>`)
   y push a la rama de trabajo — semáforo 🟢: es un archivo aditivo, reversible,
   así que hazlo y avisa después, sin esperar OK adicional más allá de la
   petición de guardar.
5. Confirma con el link de GitHub al archivo (no un Artifact — vive en el
   repo).

## Anti-patrones

- Guardar un plan que no se ha discutido de verdad todavía (inventar pasos).
- Escribir en el repo del código en vez de en `claudeblmds/` de `meta`.
- Sobrescribir un archivo existente del mismo día/objetivo en vez de crear uno
  nuevo o preguntar si es una actualización del mismo plan.
- Guardar automáticamente sin que Alfredo lo haya pedido o confirmado.

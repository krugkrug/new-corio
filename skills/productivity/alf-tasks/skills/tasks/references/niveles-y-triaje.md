# Niveles de profundidad y triaje

Antes de generar ideas, refinar o dar de alta una tarea, decide **qué nivel
hace falta** — no todo pasa por el pipeline completo. Lo cargan
`/divergencia`, `/convergencia`, `/refinar` y `/backlog`; nunca se copia
dentro de esos comandos, se cita.

## Los 4 niveles

| Nivel | Qué es | Cuándo | Comando |
|---|---|---|---|
| 0 — Ejecución directa | Ya sabes exactamente qué construir, no hay alternativas que valorar | "pon esto en rojo", "cambia el texto de X" | Ninguno — se hace en la conversación, sin pasar por la cola |
| 1 — Backlog directo | La solución ya está decidida, solo falta anotarla | "apunta que hay que hacer X" | `/backlog` |
| 2 — Refinar | La solución está decidida pero falta detalle para ejecutarla sin nadie delante | Falta criterio de éxito, alcance, o mezcla pasos distintos | `/refinar` → `/backlog` |
| 3 — Pipeline completo | Hay más de una forma razonable de resolverlo y la decisión importa | Idea abierta, sin solución decidida | `/divergencia` → `/convergencia` → `/refinar` → `/backlog` |

## Triaje: dos preguntas

1. **¿Hay más de una forma razonable de resolver esto?**
   - Sí → nivel 3. Empieza por `/divergencia`.
   - No → sigue a la 2.
2. **¿La descripción basta para ejecutarla sin que nadie tenga que
   interpretarla?** (mismo criterio que ya usa `taskrun.md` Paso 4 y
   `protocolo-cola.md` Paso 0.5: criterio de éxito claro, alcance dentro/
   fuera, sin mezclar pasos de complejidad distinta)
   - No → nivel 2. `/refinar`.
   - Sí → nivel 1 (`/backlog` directo), o nivel 0 si además pides
     ejecutarlo ya.

Si la respuesta no es obvia, dilo en una línea y pregunta — no asumas el
nivel más alto "por si acaso" (sobre-ingeniería) ni el más bajo por ir
rápido (construir sin objetivo claro, anti-patrón de `CLAUDE.md`).

## Cómo encajan los comandos entre sí

- `/divergencia` y `/convergencia` no tocan la cola — trabajan en la
  conversación. Su salida es una idea ya priorizada, no una tarea.
- `/refinar` toma una idea (de `/convergencia`, o traída directa en nivel 2)
  y la convierte en algo con criterio de éxito verificable — su salida es
  lo que `/backlog` necesita para escribir.
- `/backlog` solo escribe con `tarea.py`, `estado: "backlog"` — nunca
  promueve a `pendiente` (eso lo hace Alfredo a mano desde el panel, o el
  Paso 0.5 de `protocolo-cola.md` en la próxima pasada de `/tasks lanza` /
  `/taskrun` / `/orquesta`).
- `/orquesta` y `/orquesta-repo` no cambian: siguen siendo priorización
  (TOC) de lo que ya hay en el tablero. `/taskrun` sigue siendo ejecución de
  lo que ya está en `pendiente`.

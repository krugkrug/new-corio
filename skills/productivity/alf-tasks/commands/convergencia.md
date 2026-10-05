---
description: Prioriza las alternativas de /divergencia con poco esfuerzo — Claude agrupa y puntúa de forma provisional, Alfredo revisa en un formulario precargado y decide el destino de cada idea (ahora / otra ola / rechazar) en un segundo formulario; todo queda registrado con su razón.
---

# Convergencia — priorizar y decidir con poco esfuerzo

Segunda mitad del pipeline: de la lista fusionada de `/divergencia` a una
decisión registrada. El objetivo es que Alfredo **revise, no puntúe desde cero**:
Claude hace el trabajo pesado y Alfredo corrige solo lo que no le cuadre.

> **Cambio respecto a la versión NGT original (2026-10-02):** votar N ideas ×
> 3 criterios en ciego resultó "súper pesado" con 26 ideas. Se acepta
> conscientemente el sesgo de anclaje (Alfredo ve primero la puntuación de
> Claude) a cambio de ligereza. Lo compensan el marcado de lo que hay que revisar
> y la posibilidad de editar cualquier cosa.

Necesita la lista fusionada de `/divergencia` (de esta conversación, o
pégamela si viene de otra sesión).

## Pasos

1. **Agrupa.** Con más de unas 8 ideas, júntalas en bloques. Distingue las
   **piezas compatibles** (se pueden hacer todas) de las **alternativas que
   compiten** (hay que elegir una): solo estas últimas son decisiones reales.
2. **Revisa lo que ya existe** (código, repo, producto) antes de puntuar. Lo
   existente cambia el coste y el impacto; no puntúes ideas como si partieran de
   cero.
3. **Cribado de Claude.** Puntuación provisional de cada idea o grupo en tres
   criterios, de 1 a 5, con **una razón en un bullet**:
   - **Impacto:** 5 = deja justo en el objetivo.
   - **Coste:** **mayor número = más caro** (5 = caro y difícil de revertir;
     semáforo de `CLAUDE.md` como referencia).
   - **Confianza:** 5 = seguro de que funciona.

   Marca como **"revisar"** solo las pocas partes que dependen de tu criterio o
   donde dudo; el resto va como "OK".
4. **Formulario 1 — puntuación.** Inline (`show_widget`), precargado con mi
   puntuación y la razón de cada una. Debe permitir **dar OK a todo sin tocar
   nada** o editar cualquier celda. Las partes "revisar" van destacadas. La escala
   (con "coste: mayor = más caro") se ve en el propio formulario.
5. **Propuesta de destino.** Para cada idea o grupo: **desarrollar ahora**,
   **posponer** (otra ola o backlog) o **rechazar**, con su razón en bullets
   sintéticos, a partir de la puntuación final y las dependencias.
6. **Formulario 2 — destino.** Igual que el primero: precargado con mi
   propuesta, con el motivo editable y un OK global. Solo se discuten en
   conversación las bifurcaciones reales.
7. **Registro.** Todas las decisiones de divergencia y convergencia quedan en un
   cuaderno de requisitos `notas/<tema>-requisitos.md` (ejemplo:
   `notas/cuaderno-de-notas-requisitos.md`), con esta plantilla: objetivo y
   cuello de botella · hipótesis · lo que ya existe · decisiones tomadas ·
   requisitos priorizados por olas · pospuestos · descartados · pendientes de
   decidir · coste. Cada decisión con su razón. Abre un PR de docs con él.
8. Pregunto: "¿pasamos a `/refinar`?" con lo de la ola 1.

## Guardarraíles

- **Los formularios nunca obligan a rellenar todo ni rechazan filas
  parciales.** Una celda en blanco significa "acepto la tuya".
- **Cada decisión lleva su razón**, en bullets y muy sintética; una puntuación
  sola no basta.
- **La decisión de destino es de Alfredo.** Claude propone y, si cree que la
  mejor puntuada no es la mejor opción real, lo dice antes de cerrar.
- No conviertas la conversación en una discusión de todas las ideas — solo de las
  bifurcaciones reales y de las marcadas "revisar".
- Si la lista es corta (hasta unas 5 ideas) y la decisión es 🔴 irreversible,
  puedes volver a pedir la puntuación en ciego para evitar el anclaje.

## Uso

`/convergencia` — sobre la lista de la conversación actual, o pega la lista
de `/divergencia` si vienes de otra sesión.

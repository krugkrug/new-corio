---
description: Generación divergente de alternativas (Nominal Group Technique) — genera ideas propias antes de ver las tuyas, luego las junta sin evaluarlas. Primer paso del pipeline de nivel 3.
---

# Divergencia — generar alternativas antes de decidir

Aplica **Nominal Group Technique (NGT)**: la evidencia sobre bloqueo de
producción en el brainstorming abierto en grupo (Diehl & Stroebe) muestra
que generar en silencio, cada uno por su lado, y juntar después produce más
ideas —y más variadas— que discutir en abierto desde el principio. Evaluar
mientras se genera es lo que más reduce la divergencia: aquí no se valora
nada todavía, eso es `/convergencia`.

Además de las ideas propias, la divergencia incluye **benchmarking**: mirar
cómo lo han resuelto otros (competidores, productos análogos, herramientas ya
existentes, otros sectores). Es una fuente de ideas, no una evaluación — y
evita el anti-patrón de reinventar lo que ya existe.

Si no has pasado por el triaje, carga primero
`../skills/tasks/references/niveles-y-triaje.md` — este comando es nivel 3
(hay más de una forma razonable de resolver el problema). Si la solución ya
está decidida, no uses este comando: ve directo a `/refinar` o `/backlog`.

## Pasos

1. **Objetivo** (working backwards): si no está dicho ya en la conversación,
   pregunta qué decisión habilita esto — sin objetivo claro no hay con qué
   generar alternativas útiles, y es el anti-patrón que más cuesta deshacer
   después. Si el problema es difuso, haz antes una **entrevista corta de
   problemas**: preguntas agrupadas y cortas, con un resumen de lo entendido tras
   cada ronda (Alfredo suele responder por voz). Sin soluciones todavía.
   **Antes de generar ideas, haz inventario de lo que ya existe** (código,
   repo, producto actual): evita proponer como nuevo lo que ya está construido.
2. **Genero mi lista primero, sin verla contigo todavía**: entre 5 y 10
   ideas, cada una en una frase (qué es, no cómo se construye) — variedad
   antes que profundidad; incluye al menos una opción "barata/simple" y una
   "ambiciosa" para abrir el rango. No las evalúo ni las ordeno aquí.
3. **Benchmarking** (método abajo, "Cómo hacer un buen benchmark"): busco
   cómo resuelven este mismo problema u otro análogo — 3 a 6 referentes.
   De cada uno extraigo ideas concretas (qué hace, en una frase) y las
   añado a la lista marcadas como `benchmark`, con **fuente o enlace** y
   nivel de confianza (alta/media/baja) y con **imágenes** (ver punto 9 del
   benchmark). Si no encuentro referentes útiles, lo digo en vez de
   forzarlos. No comparo ni puntúo referentes entre sí:
   eso es `/convergencia`.
4. **Te las enseño y te pido las tuyas**, generadas independientemente
   (aunque las escribas después de ver las mías, dilo si alguna es reacción
   directa a una de las mías vs. una idea propia — importa para no duplicar
   en el siguiente paso).
5. **Junto todas las listas** en una sola, fusionando duplicados y marcando de
   quién salió cada una (tú / yo / benchmark / varias) — sin descartar nada todavía, ni
   por "parece mala idea". Eso es selección, no generación.
6. Cierro con la lista fusionada, los **ejemplos a seguir por aspecto** (punto 10
   del benchmark) y pregunto: "¿pasamos a `/convergencia`?" — este comando no
   prioriza.

## Cómo hacer un buen benchmark

Un benchmark malo es "miré tres cosas famosas y copié la primera". Uno bueno:

1. **Fija la pregunta antes de buscar.** Una frase: "qué quiero aprender de
   los demás" (¿cómo estructuran X? ¿qué precio/modelo usan? ¿qué flujo?),
   derivada del objetivo del paso 1. Sin pregunta, se recopila ruido.
2. **Elige referentes de tres tipos** (mínimo uno de cada, dentro de los 3-6):
   - *Directos*: mismo problema, mismo sector.
   - *Análogos*: mismo problema de fondo, **otro sector** (abre el rango).
   - *Fracasos o abandonados*: alguien que lo intentó y lo dejó, y por qué.
     Evita el sesgo de supervivencia: solo ver a los que funcionan
     sobrestima lo fácil que es.
   - *Con buena aceptación entre expertos*, si se pide una referencia de
     interfaz: el que más aparece en reseñas y comparativas de fuentes fiables,
     con fuente y fecha.
3. **Fuentes primarias antes que secundarias**: documentación, repos,
   páginas de precios, changelogs, contratos/condiciones, código, o uso
   directo del producto. Reseñas, blogs y marketing solo como pista, y
   marcados como tal. Anota la **fecha** de cada fuente (caduca rápido).
4. **Usa la misma ficha para todos**, para poder compararlos luego en
   `/convergencia` sin rehacer el trabajo:

   | Referente | Tipo | Qué hace (1 frase) | Cómo (mecanismo) | Modelo/coste | Límites conocidos | Fuente + fecha | Confianza |
   |---|---|---|---|---|---|---|---|

   Separa **lo que dicen** de **lo que he verificado**. Números con su
   base: unidad, periodo, bruto/neto, real/nominal.
5. **Extrae ideas, no conclusiones**: cada referente aporta 1-3 ideas
   concretas a la lista (marcadas `benchmark`). "Es mejor que lo nuestro" o
   "no nos encaja" es evaluación y se queda para `/convergencia`.
6. **Busca contra tu propio sesgo**: prueba al menos dos formulaciones de
   búsqueda distintas (y un idioma más si aplica), no te quedes con los
   primeros resultados, y revisa alternativas menos conocidas. Di qué
   búsquedas hiciste.
7. **Para cuando sature**: si un referente nuevo ya no aporta ideas nuevas,
   para. Más referentes no es mejor benchmark; tope de 6.
8. **Declara los huecos**: qué no encontré, qué no pude verificar (p. ej.
   tras un muro de pago o sin acceso al producto) y qué confianza tiene el
   conjunto. Mejor "no sé" explícito que un referente inventado.
9. **Imágenes siempre.** De cada referente, capturas de las funcionalidades que
   se proponen, de fuentes oficiales (documentación, páginas de producto). No
   hace falta que vayan en la tabla, pero Alfredo debe poder verlas: ábrelas en
   el panel del navegador, una pestaña por referente, y comprueba que muestran la
   funcionalidad concreta. Si no hay imagen, dilo. Referencia las imágenes en la
   tarea que se dé de alta.
10. **Ejemplos a seguir por aspecto de diseño**, no un referente global.
    Ejemplo: "interacciones: X", "uso de los datos: Y", "navegación: Z",
    "captura móvil: W". Cada aspecto señala qué copiar y de quién.

## Guardarraíles

- No evalúes, puntúes ni descartes ideas aquí — es la línea que separa
  `/divergencia` de `/convergencia`; mezclar ambas es como se pierden ideas
  poco obvias por juicio prematuro.
- No inventes el objetivo si no lo has preguntado — sin objetivo no hay
  criterio para saber si una idea es relevante.
- Todo referente del benchmarking lleva fuente y fecha; sin fuente, no entra (o
  entra marcado como confianza baja). Nada de "otros lo hacen así" sin
  decir quién.
- Ningún benchmark sin imágenes (punto 9), ni sin haber mirado antes lo que ya
  existe (paso 1).
- Si en el paso 2 no salen variantes genuinamente distintas (todas son la
  misma idea con matices), dilo en vez de rellenar hasta 5 por cumplir
  número — variedad es el objetivo de NGT, no cantidad forzada.

## Uso

`/divergencia <problema u objetivo>` — o sin argumento si ya está claro por
la conversación.

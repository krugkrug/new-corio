---
name: reflex
description: Reflexiona con Alfredo sobre un periodo ya medido: qué funcionó, qué no, por qué (causa raíz) y qué cambia; decide seguir, pivotar o abandonar por objetivo (bloque C de la Guía del ciclo, momento 7). Úsala cuando diga "/reflex", "reflexionemos", "qué aprendemos de esta semana/mes". Produce las filas accionables (aprendizaje, principio, issue o idea; tabla lista para «Aplicar lote…») y las decisiones; no escribe en producción.
---

# /reflex — qué hemos aprendido y qué cambia

Método: momento 7 de `CICLO_GUIA_MOMENTOS` en `script/ciclo.js`. Parte de los números de `/rev` (si no se hizo, propón hacerlo primero: **medir antes de opinar**; si insiste, sigue pero con confianza baja y dilo).

## 0. Arranque

1. Horizonte y periodo. Lee el estado actual — **Lectura de datos (producción viva, no copia local):** `GET https://alfplan.sanchezbella.com/api/data?esquema=2`, solo lectura, con `mcp__claude_ai_Vercel__web_fetch_vercel_url` (la app va tras el SSO de Vercel: `curl` recibe un 302; esa herramienta va autenticada como Alfredo). La respuesta es grande y la herramienta la guarda en un fichero: usa su ruta como `DATOS` (`DATOS=<ruta> node -e '…'`); es JSON envuelto en `{success, status, text}`. **Di la hora de lectura.** Si no se puede leer, para: no uses `local-data/` (va por detrás) ni sigas de memoria; pide que pegue los datos. Qué leer: objetivos del periodo con su resultado, `reflexiones_v2`, `aprendizajes`, `issues`, `ideasrf` y los principios ★ de `valores`.
2. Muestra la tabla de resultados y las desviaciones de más del 20 %.

## 1. Las cuatro preguntas, tema a tema

Por cada tema (empieza por donde hay más desviación):

1. **¿Qué funcionó?** 2. **¿Qué no?** 3. **¿Por qué?** — causa raíz, no síntoma. «No tuve tiempo» no vale: la causa es la decisión que consumió ese tiempo. Obligatoria en toda desviación > 20 %. Pregunta «¿y eso por qué?» hasta llegar a una decisión. 4. **¿Qué cambio concreto hago el próximo periodo?**

Decisión explícita por objetivo: **seguir · pivotar · abandonar**. Si falló dos periodos seguidos por la misma causa, no se vuelve a fijar: se cambia el enfoque o se mata. Cierre del ciclo por inercia = anti-patrón.

## 2. Salidas obligatorias

**Reutilizar antes que crear**: cruza lo que sale con lo que ya existe. Si un aprendizaje, issue o idea ya está registrado, **actualízalo o súbelo de nivel** (repetición, promoción a principio) en vez de duplicarlo; crea solo si no hay equivalente y borra solo con OK explícito.

Al menos **una fila accionable**: aprendizaje, principio, issue (con hipótesis si-entonces, que reaparecerá en el bloque A) o idea; o descartar de forma explícita. Reglas: un aprendizaje repetido tres veces o de coste alto si no se aplica puede promoverse a principio (máx. ~7 activos); documenta el aprendizaje, no solo el resultado.

**Meta-revisión**: una pregunta sobre el proceso — ¿sigue siendo el marco correcto o solo compruebo si el plan se cumple?

## 3. Cierre

Entrega: las cuatro respuestas por tema (breves), las filas accionables listas para teclear (con su tipo, área y tema) y la decisión por objetivo. Esto es lo que lee el momento 1 de `/fix` del periodo siguiente.

### Entrega en lote

Formato y reglas: `meta/EDICION_EN_LOTE.md` (repo alfplan). Las filas accionables van en **una tabla de lote**; la decisión seguir · pivotar · abandonar **no es una columna** y va en su propia tabla (no en el lote).

| `entidad` | Columnas útiles |
|---|---|
| `aprendizaje` | `título · área · tema · proyecto · notas · horizonte` |
| `issue` | `título · área · tema · causa · hipotesis · horizonte` (la hipótesis en forma si-entonces) |
| `idea` | `título · área · tema · notas · hipotesis` |
| `reflexion` | `título · tipo · área · tema · notas` — `tipo` ∈ Victoria · Fricción · Energía y tiempo · Emociones |
| `tip` | `título · horizonte · notas` |

Sin `periodo` ni `año` en estas entidades (el lote lo rechaza). Los principios ★ se marcan en la app; propónlos aparte, con su aprendizaje de origen.

## Reglas

- **Preguntas autocontenidas**, sin etiquetas internas; tablas y bullets, poco texto. Muestra primero lo que hay.
- Una pregunta (o un par) por turno; no ratifiques por complacencia: si la causa suena a excusa, dilo.
- No escribas en producción por defecto: entrega la tabla para pegarla en «Aplicar lote…». No uses `local-data/` (copia que va por detrás). Si pide escribir en la app: URL y permiso explícito, **el login lo hace él**, uno a uno, verifica tras recargar y no borres sin OK.

---
name: reflex
description: Reflexiona con Alfredo tema a tema, con una entrada de diario hablada por tema que se devuelve limpia y destilada (victorias, fricciones, energía y tiempo, emociones), y después lee las reflexiones de los últimos periodos para proponer aprendizajes, issues e ideas (bloque C de la Guía del ciclo, momento 7). Úsala cuando diga "/reflex", "reflexionemos", "qué aprendemos de esta semana/mes". Produce tablas listas para «Aplicar lote…» (reflexiones, y aprendizajes, issues o ideas) y un recordatorio de lo que queda por asignar en la app; no escribe en producción.
---

# /reflex — una entrada de diario por tema, y qué aprendemos de ellas

> **Dónde están las plantillas y los documentos de formato.** Viven en el repo `krugkrug/alfplan`, en su carpeta `meta/` (las rutas `meta/…` de esta skill son relativas a la raíz de ese repo, no a este). **Sesión local:** `C:\Users\alfre\Documents\GitHub\alfplan` (haz antes `git pull`, por si otra sesión subió cambios). **Sesión en la nube:** añade el repo con `add_repo` (`krugkrug/alfplan`) y clónalo; si no, no encontrarás las plantillas.

**Versión:** v2 · 8-oct-2026. Sustituye al flujo de «cuatro preguntas por tema + decisión por objetivo». Boceto aprobado: `meta/boceto-reflex-por-areas.html` (alfplan, PR #685); ábrelo si necesitas ver cómo debe quedar cada pantalla.

Método: momento 7 de `CICLO_GUIA_MOMENTOS` en `script/ciclo.js`. Si `/rev` no se hizo para el periodo, dilo una vez («medir antes de opinar») y sigue: no es obligatorio en este flujo.

## 0. Arranque

1. **Periodo.** Por defecto, la semana en curso; Alfredo puede pedir otro horizonte. Di cuál has tomado.
2. **Lectura de datos (producción viva, no copia local):** `GET https://alfplan.sanchezbella.com/api/data?esquema=2`, solo lectura, con `mcp__claude_ai_Vercel__web_fetch_vercel_url` (la app va tras el SSO de Vercel: `curl` recibe un 302; esa herramienta va autenticada como Alfredo). La respuesta es grande y la herramienta la guarda en un fichero: usa su ruta como `DATOS` (`DATOS=<ruta> node -e '…'`); es JSON envuelto en `{success, status, text}`. **Di la hora de lectura.** Si no se puede leer, para: no uses `local-data/` (va por detrás) ni sigas de memoria; pide que pegue los datos.
3. **Qué leer:** áreas y temas (en el orden de la app), `reflexiones_v2` recientes, `aprendizajes`, `issues`, `ideasrf` y los principios ★ de `valores`.
4. **Temas a recorrer.** Propón los temas con actividad en el periodo, agrupados por área, y deja que Alfredo quite o añada. Una pantalla (un turno) por tema.

## 1. Un tema, una entrada de diario

Por cada tema, en este orden:

1. **Guía.** Muestra las cuatro grandes con sus subpreguntas (solo guía: no hace falta contestarlas todas ni en orden):

   | Gran pregunta | Subpreguntas |
   |---|---|
   | Victorias | ¿Qué salió mejor de lo esperado? · ¿Qué repetiría? |
   | Fricciones | ¿Dónde me atasqué? · ¿Qué se repite? |
   | Energía y tiempo | ¿Qué me dio energía? · ¿Qué me la quitó? · ¿Dónde se fue el tiempo? |
   | Emociones | ¿Qué sentí? · ¿Ligado a qué? |

   Pide **una sola grabación continua, como un diario, de unos cinco minutos**. Alfredo la dicta (dictado del sistema: Win+H en Windows, micrófono del teclado en el móvil) y la pega en el chat.
2. **Entrada limpia y estructurada.** Con lo que dijo, devuelve:
   - **Una frase que destila** el tema.
   - **Sus palabras ordenadas** por gran pregunta y subpregunta, un punto por idea. Quita muletillas y repeticiones; **no cambies el sentido ni añadas nada**.
   - **Lo que no dijo queda en blanco**, con «No lo has dicho»; no lo inventes. Si quiere, lo añade con otra frase.
   - Si en una fricción la causa que da suena a síntoma («no tuve tiempo», «imprevistos»), haz **una sola** repregunta: la causa es la decisión que consumió ese tiempo.
3. **Propuesta de proceso y horizonte, por punto** (solo si aplica, con una línea del porqué): proceso A Fijación · B Planificación · C Revisión · F Foco; horizonte diario · semanal · mensual · trimestral · anual. **Por defecto no se asigna nada**: es solo una propuesta, y un punto que no encaja en ningún proceso queda «sin asignar · no aplica a nada».
4. Alfredo corrige (texto, descartar un punto, cambiar la propuesta). Cuando dé el visto bueno, saca el lote del tema (§2) y pasa al siguiente.

## 2. Lote del tema

Formato y reglas: `meta/EDICION_EN_LOTE.md` (repo alfplan). Una tabla, una fila por punto aceptado:

`entidad · id · título · tipo · área · tema · fecha · notas`

- `entidad` = `reflexion`; `id` vacío (alta).
- `título` = el punto, con sus palabras. `tipo` ∈ Victoria · Fricción · Energía y tiempo · Emociones (la gran pregunta a la que pertenece). `fecha` = hoy (AAAA-MM-DD). Sin `periodo` ni `año` (el lote los rechaza).
- `notas` de cada fila: la subpregunta que responde y, si hay propuesta, `[Asignar en la app] <proceso> / <horizonte>`.
- `notas` de la **primera fila del tema**, además: `ENTRADA <periodo>: <frase destilada> · DICTADO: <dictado completo>`. Así la entrada completa queda guardada sin campos nuevos.
- Dentro de una celda, `|` se escribe `/` y los saltos de línea se sustituyen por un espacio.
- **No lleva columnas `proceso` ni `horizonte`**: son campos de selección múltiple en la app y el lote de hoy no sabe escribirlos como lista (a verificar al construirlo).

## 3. Recordatorio de asignación

Al cerrar cada tema y otra vez al final, enseña la lista de reflexiones con propuesta: reflexión → proceso · horizonte. Y dilo tal cual:

> Tras aplicar el lote, ábrelas en Reflexiones y marca proceso y horizonte. Mientras no se asignen, la app las trata como «aplica a todo» en el Recap del ciclo. Las filas llevan «[Asignar en la app]» en las notas para encontrarlas.

## 4. Lo que dicen los últimos periodos

Cuando se hayan recorrido los temas:

1. **Ventana:** por defecto las últimas 6 semanas (alternativas: 4 semanas o 3 meses), incluidas las reflexiones de hoy.
2. **Agrupa por lo que dicen**, no por tipo, y propone aprendizajes, issues (con hipótesis si-entonces) o ideas. Por defecto, solo lo que aparece en **dos semanas o más** (o una sola vez con coste alto); Alfredo puede bajar el listón.
3. Cada propuesta lleva: tipo, título, cuántas frases suyas y de cuántas semanas, y **las pruebas**: sus propias frases con su semana y su tipo.
4. **Reutilizar antes que crear.** Cruza con `aprendizajes`, `issues` e `ideasrf`. Si ya existe un equivalente, **actualízalo o súbelo de nivel** (poniendo en las notas «Repetido en <semana>») en vez de duplicarlo; crea solo si no hay equivalente y borra solo con OK explícito. Un aprendizaje repetido tres veces o de coste alto si no se aplica puede promoverse a principio ★ (máx. ~7 activos); los principios se marcan en la app, así que propónlos aparte, con su aprendizaje de origen.
5. **Lote** de lo aceptado, con las columnas de cada entidad (una columna que no existe en la entidad es un fallo del lote):

| `entidad` | Columnas útiles |
|---|---|
| `aprendizaje` | `título · área · tema · proyecto · notas · horizonte` |
| `issue` | `título · área · tema · causa · hipotesis · notas · horizonte` (la hipótesis en forma si-entonces) |
| `idea` | `título · área · tema · notas · hipotesis` |

## 5. Cierre

Entrega: la frase destilada de cada tema, los lotes (por tema y el de aprendizajes, issues e ideas), el recordatorio de asignación y, si quedan, las decisiones pendientes. Termina con **una pregunta de meta-revisión**: ¿sigue siendo este el marco correcto, o solo comprobamos si el plan se cumple?

Fuera de esta versión: la decisión seguir · pivotar · abandonar por objetivo (sigue descrita en la Guía del ciclo), una llamada a Claude desde la propia página y ampliar el lote para escribir proceso y horizonte.

## Reglas

- **Preguntas autocontenidas**, sin etiquetas internas; tablas y bullets, poco texto. Muestra primero lo que hay.
- Un tema por turno; no ratifiques por complacencia: si algo suena a excusa, dilo.
- **No inventes** lo que Alfredo no dijo ni completes sus frases con lo que «seguro quiso decir».
- No escribas en producción por defecto: entrega las tablas para pegarlas en «⇪ Aplicar lote…». No uses `local-data/` (copia que va por detrás). Si pide escribir en la app: URL y permiso explícito, **el login lo hace él**, uno a uno, verifica tras recargar y no borres sin OK.

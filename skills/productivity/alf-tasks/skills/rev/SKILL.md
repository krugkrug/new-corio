---
name: rev
description: Mide con Alfredo los resultados de un periodo cerrado, objetivo a objetivo y tema a tema (bloque C de la Guía del ciclo, momento 6: el dato antes de la opinión). Úsala cuando diga "/rev", "revisemos la semana/el mes/el trimestre" o "cerremos el periodo". Produce los resultados a registrar en la app (tabla lista para «Aplicar lote…») y la lista de desviaciones; no escribe en producción. Para reflexionar después, /reflex.
---

# /rev — medir el periodo (el dato, antes de la opinión)

Método: momento 6 de `CICLO_GUIA_MOMENTOS` en `script/ciclo.js`. **Aquí solo se mide y se registra; no se decide ni se opina** (eso es `/reflex`). Si Alfredo empieza a justificar, apúntalo para la reflexión y vuelve al número.

## 0. Arranque

1. Horizonte, periodo y año (pregunta si falta).
2. Lee objetivos y tareas del periodo, con base, actual, estado y estimaciones. **Lectura de datos (producción viva, no copia local):** `GET https://alfplan.sanchezbella.com/api/data?esquema=2`, solo lectura, con `mcp__claude_ai_Vercel__web_fetch_vercel_url` (la app va tras el SSO de Vercel: `curl` recibe un 302; esa herramienta va autenticada como Alfredo). La respuesta es grande y la herramienta la guarda en un fichero: usa su ruta como `DATOS` (`DATOS=<ruta> node -e '…'`); es JSON envuelto en `{success, status, text}`. **Di la hora de lectura.** Si no se puede leer, para: no uses `local-data/` (va por detrás) ni sigas de memoria; pide que pegue los datos.

```bash
node -e 'const d=JSON.parse(JSON.parse(require("fs").readFileSync(process.env.DATOS,"utf8")).text);const A=Object.fromEntries(d.areas.map(a=>[a.id,a.area]));
const [h,p]=process.argv.slice(1);
console.log(d.objetivos.filter(o=>o.horizonte===h&&(!p||o.periodo===p)).map(o=>[A[o.area_id],o.tema,o.texto,o.inicio,o.actual,o.estado,o.periodo].join(" | ")).join("\n"))' trimestral Q4
```


## 1. Tema a tema

Por cada tema, en el orden de la app, tres lecturas:

1. **Objetivos**: valor final frente a la base y frente a la meta, en unidad y en %. Si no hay número, es **sí/no** con el «sí» definido en la fijación. En un objetivo «Máximo», se mide contra el tope. Honestidad: un 70 % es un 70 %, no un «casi». Pregunta el valor; no lo des por bueno sin fuente.
2. **Tareas**: hechas sobre planificadas; tiempo real frente a estimado.
3. **Lo no planificado**: qué entró y cuánto tiempo se llevó.

Registrar el resultado cierra el objetivo (estado done). Si no puede registrarse todavía, dilo. **Reutiliza lo que existe**: se actualiza el actual y el estado del objetivo o tarea que ya está, no se crea uno nuevo ni se borra para rehacerlo.

## 2. Cierre

Tabla: tema · objetivo · base → meta → resultado (unidad, %) · estado · desviación. Más: tareas hechas/planificadas, desviación de tiempo (estimado vs. real) y lo no planificado. Marca las **desviaciones de más del 20 %** — son las que exigen causa raíz en `/reflex`. Rangos y nivel de confianza; lo especulativo, marcado como tal.

## Reglas

- **Preguntas autocontenidas**: nombra el objetivo completo y su periodo, sin etiquetas internas; tablas y bullets, poco texto. Muestra primero lo que hay.
- Una pregunta (o un par) por turno.
- No escribas en producción por defecto: entrega los resultados para registrarlos (pegando la tabla en «Aplicar lote…»). No uses `local-data/` (copia que va por detrás). Si pide escribir en la app: URL y permiso explícito, **el login lo hace él**, uno a uno, verifica tras recargar y no borres sin OK.
- Siguiente paso: `/reflex` con esta tabla delante.

### Entrega en lote

Formato y reglas: `meta/EDICION_EN_LOTE.md` (repo alfplan). Para registrar los resultados de una vez, entrega **una tabla de lote** con ediciones (siempre con el `id` real, de la lectura de producción):

- Objetivo de valor: `entidad · id · resultado` (número, en la unidad del objetivo). Objetivo binario: `entidad · id · resultado_binario` (`cumplido` / `incumplido`).
- **No pongas `estado`**: registrar el resultado cierra el objetivo por sí solo (done), igual que en la app; un padre con subobjetivos o repetición no se cierra solo.
- Tareas hechas: `entidad=tarea · id · estado=done`.
- Un resultado que aún no puede registrarse no va en la tabla: dilo aparte. Celda vacía = no tocar.

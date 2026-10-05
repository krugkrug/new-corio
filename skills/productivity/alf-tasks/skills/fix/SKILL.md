---
name: fix
description: Fija objetivos con Alfredo, sesión guiada por horizonte y tema a tema (bloque A de la Guía del ciclo, momentos 1-4). Úsala cuando diga "/fix", "fijemos objetivos", "vamos a fijar el trimestre/mes/semana", o pida abrir un periodo. Produce una lista de objetivos lista para pegar en «Aplicar lote…» de la app (o teclear); no escribe en producción.
---

# /fix — fijar objetivos juntos, horizonte y tema a tema

Fuente única del método: `CICLO_GUIA_MOMENTOS` (momentos 1-4) en `script/ciclo.js` y la Guía en Configuración. **Léela antes de empezar y aplica sus criterios de «hecho» y sus trampas; no los copies aquí.**

## 0. Arranque (pregunta, no asumas)

1. **Horizonte y periodo** (anual · trimestral · mensual · semanal) y el año. Si no lo dice, pregúntalo.
2. **Objetivo final** de la sesión: qué decisión habilita (working backwards).
3. Lee el estado actual. **Lectura de datos (producción viva, no copia local):** `GET https://alfplan.sanchezbella.com/api/data?esquema=2`, solo lectura, con `mcp__claude_ai_Vercel__web_fetch_vercel_url` (la app va tras el SSO de Vercel: `curl` recibe un 302; esa herramienta va autenticada como Alfredo). La respuesta es grande y la herramienta la guarda en un fichero: usa su ruta como `DATOS` (`DATOS=<ruta> node -e '…'`); es JSON envuelto en `{success, status, text}`. **Di la hora de lectura.** Si no se puede leer, para: no uses `local-data/` (va por detrás) ni sigas de memoria; pide que pegue los datos. Ejemplo para los objetivos:

```bash
node -e 'const d=JSON.parse(JSON.parse(require("fs").readFileSync(process.env.DATOS,"utf8")).text);const A=Object.fromEntries(d.areas.map(a=>[a.id,a.area]));
const [h,p]=process.argv.slice(1);
console.log(d.objetivos.filter(o=>o.horizonte===h&&(!p||o.periodo===p)).map(o=>[A[o.area_id],o.tema,o.texto,o.inicio,o.actual,o.estado,o.periodo].join(" | ")).join("\n"))' trimestral Q4
```

Ajusta horizonte y periodo (`Q4`, `10`, `W41`…). Trae también los objetivos del horizonte superior, los aprendizajes/principios ★ y las reflexiones del periodo anterior.


## 1. Preparación rápida (momentos 1-3)

Una sola ronda, breve, antes de entrar en temas. Presenta en 5-8 líneas: lo que dejó el periodo anterior, el principio ★ candidato a filtro del periodo y los objetivos de arriba con su avance y su porción que toca a este periodo. Pide: **¿qué principio usamos de filtro? ¿algún objetivo de arriba se mantiene, corrige o mata?** El horizonte inmediatamente superior manda (regla del reparto).

## 2. Tema a tema (momento 4)

Recorre las áreas y, dentro de cada una, **un tema cada vez**, en el orden de la app. Por tema:

1. **Muestra primero lo que hay, en tabla** (texto · horizonte/periodo · padre · prioridad · estado · hijos) y lo que le toca del horizonte superior. No propongas nada antes de enseñarlo.
2. Pregunta qué resultado ya alcanzado querría ver al cerrar el periodo. Un objetivo primario, no cinco.
3. Redáctalo con él y pásalo por el filtro, sin saltarte nada: **resultado, no tarea · fin, no medio · de este periodo · ambicioso · S-M-A-R-T** (métrica + base + meta + unidad + periodo; «Máximo» si la meta es un tope; lo cualitativo, binario con el «sí» definido).
4. Fija **prioridad propia** (critical · P1 · P2 · P3, por defecto P2) y el padre (o justifica que no lo tenga).
5. Cierra el tema con «ok / siguiente». Un tema puede cerrarse en 30 segundos con «nada este periodo».

**Consolidar antes de detallar.** Si hay más objetivos que el techo, mira si son **fases secuenciales de un mismo proceso** (p. ej. buscar → LOI → due diligence → SPA): no son objetivos paralelos, son un solo objetivo con hitos. Colapsa primero (7 → 3) y detalla después.

**Plan hacia atrás.** Parte del objetivo de arriba, fija hitos con fecha y señala la **ruta crítica** (qué debe estar listo antes de qué). Pon una **regla de pivote con fecha** («si el 31-oct no hay X, el objetivo baja a Y y se corrige el anual»). Si el plazo no cabe, **avisa del riesgo antes de ejecutar** y de su consecuencia en el horizonte superior (regla del reparto).

**Techo por horizonte:** anual 3-5 · trimestral 2-3 · mensual 2-3 · semanal 1-3 · diario 0. Si el total del periodo lo supera, dilo y propón qué baja al backlog (TOC: ¿cuál es el cuello de botella? ese lleva el *critical*; debe haber al menos uno activo).

## 3. Reutilizar antes que borrar y crear

Antes de proponer filas nuevas, **cruza lo que ya existe con lo que se decide**: si un objetivo existente expresa el mismo resultado, se **modifica**; solo se crea si cambia el significado, y solo se borra con OK explícito.

| Situación | Acción |
|---|---|
| Mismo resultado, otro periodo u horizonte | Cambiar horizonte y periodo |
| Mismo resultado, texto impreciso | Renombrar |
| Cuelga del padre equivocado | Reparentar |
| Dos objetivos para lo mismo | Dejar uno, reparentar los hijos y pedir OK para borrar el otro |
| Sin equivalente | Crear |

Entrega una tabla **existente → destino → cambio** y cuenta el techo *después* de reutilizar. Motivo: se conservan hijos, historial y avance, ahorra pasos y el borrado es irreversible (🔴: nunca sin OK; el sistema de permisos puede bloquearlo).

## 4. Cierre

Tabla final, una fila por objetivo: área · tema · horizonte/periodo · texto · base → meta (unidad, ¿máximo?) · prioridad · padre. Comprueba los criterios de «hecho» del momento 4 y di qué falta. **No se pasa a /plani sin un objetivo verificado.**

### Entrega en lote

Formato y reglas: `meta/EDICION_EN_LOTE.md` (repo alfplan) (léelo; es la fuente única). Entrega **una tabla** lista para «⇪ Aplicar lote…» (Instrucciones), tras la tabla de lectura de arriba:

- Columnas: `entidad · id · título · padre · horizonte · periodo · año · área · tema · prioridad · tipo · base · target · unidad · máximo`, con `entidad` = `objetivo`.
- Alta = `id` vacío. Para **editar** uno existente, copia su `id` real de la lectura de producción; no lo «adivines» por título.
- Padres antes que hijos; el hijo apunta con `#n` (fila n de la tabla) o con el id si el padre ya existe.
- `base` y `target` como número; la unidad va en `unidad`. Periodos como `T4`, `oct`, `S41`; el anual lo deja vacío.
- Antes de la tabla, di cuántos objetivos quedan en cada horizonte/periodo frente al techo (el lote solo avisa con ⚠, no bloquea).

## Reglas

- Una pregunta (o un par) por turno; no vuelques el formulario entero.
- Si un objetivo es en realidad una tarea o un deseo, **dilo antes de seguir**, aunque contradiga lo que pidió.
- Números con base, unidad y periodo; rangos antes que falsa precisión (formato español `1.234,56`).
- **Preguntas autocontenidas**: nombra el objetivo completo y su fecha; nunca etiquetas internas (A, B, O1, N1…) que Alfredo no ha visto. Tablas y niveles de bullets, texto redactado mínimo.
- **Lista acumulada de cambios pendientes**, con estado por línea (decidido · pendiente · bloqueado). Un hueco sin resolver (`[N]`, una cifra) se registra como **pendiente**, no como hecho.
- La app de producción va tras el SSO de Vercel: **por defecto no escribas en ella**; entrega la tabla para que la pegue en «Aplicar lote…» (o la teclee). No uses `local-data/`: es una copia para previsualizar la interfaz y va por detrás. Si Alfredo pide escribir en producción: pide URL y permiso explícito, **el login lo hace él** (nunca introduces credenciales), edita uno a uno, verifica tras recargar y no borres sin OK. Al renombrar un tema, comprueba después que no queda el nombre antiguo (se reescriben cuatro colecciones). Para lotes grandes, «Aplicar lote…» en vez de clic a clic.
- Siguiente paso a proponer al final: `/plani`.

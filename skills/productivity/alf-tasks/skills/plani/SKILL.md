---
name: plani
description: Planifica con Alfredo las tareas de un periodo, objetivo a objetivo y tema a tema (bloque B de la Guía del ciclo, momento 5: generar opciones → decidir → planificar). Úsala cuando diga "/plani", "planifiquemos la semana/mes/trimestre" o tras /fix; con horizonte diario (p. ej. "/plani corio diario") abre el asistente guiado del día, que termina en eventos de calendario. Produce la lista de tareas lista para pegar en «Aplicar lote…» de la app (o teclear); no escribe en producción.
---

# /plani — fijar las tareas del periodo, tema a tema

> **Dónde están las plantillas y los documentos de formato.** Viven en el repo `krugkrug/alfplan`, en su carpeta `meta/` (las rutas `meta/…` de esta skill son relativas a la raíz de ese repo, no a este). **Sesión local:** `C:\Users\alfre\Documents\GitHub\alfplan` (haz antes `git pull`, por si otra sesión subió cambios). **Sesión en la nube:** añade el repo con `add_repo` (`krugkrug/alfplan`) y clónalo; si no, no encontrarás las plantillas.

Método: momento 5 de `CICLO_GUIA_MOMENTOS` en `script/ciclo.js` (y Guía en Configuración). **Léelo primero**; este skill solo dice cómo conducir la sesión.

## Cómo conducir la sesión (feedback de Alfredo, 2-oct-2026; **manda sobre el resto**)

Alfredo probó el proceso entero y lo encontró largo, complejo y poco visual. Lo que quiere:

1. **Simple: objetivo a objetivo, de uno en uno, en el chat.** Nada de formularios, tableros o pantallas con «mil elementos». Para cada objetivo: yo propongo tareas; él las acepta, rechaza, modifica o añade las suyas. Orden: por la **cadena crítica** (lo que vence antes y desbloquea lo demás), no por horizonte ni todo a la vez.
2. **Contexto antes de preguntar, en lenguaje llano.** Una cadena corta en frases («quieres X; para X hace falta Y; para Y, estos pasos en este orden; estamos aquí»), con el objetivo, sus hermanos y los ascendientes en línea recta (padre, abuelo…). Sin árboles técnicos ni jerga.
3. **Una sola pregunta por turno, de respuesta corta** (una letra o «ok»). Si propones algo, di qué existe hoy, qué propones y qué cambia; no reabras lo ya decidido.
4. **Cuando diga «cerrado», «déjalo» u «olvida X», paro en ese bloque.** No sigo proponiendo sobre él ni pido otro «ok». Lo anoto y avanzo.
5. **Si una respuesta es ambigua** («no» sin más), pregunta qué quiso decir en una frase, sin inventar.
6. **Datos directos cuando los pide** (p. ej. «las tareas y objetivos de la semana que viene»): tabla corta y ya, sin análisis añadido.
7. Los pasos 1 y 2 de abajo (ruta crítica, opciones) se hacen **por dentro**: a Alfredo solo se le muestra el resultado y la fecha de alarma, no el razonamiento.
8. **Cierre de cada bloque:** lista breve de lo decidido hasta ahora y una sola pregunta de siguiente paso (tabla de lote o siguiente bloque).

9. **Un área cada vez** (feedback de Alfredo, 2-oct-2026: «sino me vuelvo loco»). Nunca vuelques todas las áreas; si no nombra una, pregunta cuál.
10. **Panorama de objetivos primero**, antes de las tareas: el **árbol completo del área en formato visual** (`show_widget`: sangría por padre, etiqueta de periodo en cada nodo, fecha y prioridad a la derecha), con el recuento por horizonte y periodo. **Nunca tabla en markdown** para esto. Se revisa **de mayor a menor horizonte** (anual → trimestral → mensual → semanal → diario), con el árbol delante y el horizonte revisado resaltado.
11. **Marca de saturación: más de 3 objetivos por proyecto (tema) en un mismo horizonte** (regla blanda, se revisa siempre; ver `/fix` 0c); solo se marca eso.
12. **Cada decisión se contrasta** con lo que hay: duplicados, huecos (sin fecha, sin cifra, `[N]`, sin padre) y arrastres de semanas pasadas.
13. **Cifras recontadas** desde los datos antes de enseñarlas.
14. **Pregunta sin respuesta = pendiente**: si Alfredo cambia de tema o dice «ok» a secas, se anota en la lista acumulada y no se repite cada turno.

15. **Lo primero que se enseña, siempre: el árbol acotado al proyecto y al periodo que se planifica** (feedback de Alfredo, 2-oct-2026), en formato visual (`show_widget`). Contenido: la cadena de ascendientes (anual → trimestral → mensual) en gris; los objetivos del periodo resaltados; **debajo de cada objetivo, las tareas que ya existen** (fecha, prioridad y estado; marca las vencidas, las que caen después de la fecha límite del objetivo y los objetivos sin tarea); y aparte, las tareas del proyecto que no cuelgan de ningún objetivo. Si los datos no enlazan tarea con objetivo, ligarlas por el texto y decirlo. Solo después, la primera pregunta (horizonte, bloqueos o la decisión que toque). Si el periodo no está claro, propón uno por defecto y enseña el árbol con él.

## Modo diario guiado (`/plani <tema> diario`, p. ej. `corio diario`; feedback de Alfredo, 5-oct-2026)

Para el horizonte **diario** el chat no basta: se conduce con un **asistente guiado** (artifact) y el resultado son **eventos en el calendario**. Plantilla: `meta/plantilla-plani/` (README dentro).

> **Por defecto: la plantilla «pantalla única»** (feedback de Alfredo, 8-oct-2026; cuando él no pida otra cosa). Todo el día en una sola pantalla, no objetivo a objetivo. El asistente guiado de abajo (pasos 1-8) queda como alternativa si lo pide.

### Pantalla única (plantilla `meta/plantilla-plani/pantalla.html`)

Qué ve y hace Alfredo (ya validado con él; no lo rediseñes sin pedírselo):
- **Arriba, la tarea crítica del día** (comunicación u organización que desbloquea a terceros, antes que el trabajo a solas). Se elige con el check de la lista de la derecha (solo una); el calendario la coloca primero.
- **Calendario del día** (izquierda) con lo fijo de todos los calendarios y los bloques de tareas, comida, cena y ejercicio. Los bloques se **arrastran** (de 15 en 15 min; también con flechas) y llevan un **check**: desmarcado queda **atenuado en su sitio** y no sale en la petición de eventos.
- **Comida, cena y ejercicio** se eligen con un **desplegable dentro de su bloque** (platos: sin horas ni historias; ejercicio: correr o gym). La hora, arrastrando.
- **Abajo, las dos tablas semanales** (comidas y ejercicio, semana anterior y actual).
- **Petición de eventos** para copiar: cada línea con su calendario de destino.

Cómo se prepara (🟢 solo lectura; nada se crea sin su OK):
1. **Datos:** producción (§0.2: tareas diarias del día de los proyectos del tema, `comidas`, `entrenos`, `dietas`, `niveles`, `ajustes`, `recetas`) y **todos los calendarios** (`list_calendars` y `list_events` de Main, CORIO, GT, Schedule y `* Orchestrate`) del día. Di la hora de lectura.
2. **Rellena `dia.json`** copiando `meta/plantilla-plani/pantalla.dia.2026-10-08.json` (el README explica cada campo): `fijos` (todo evento existente, con `mitad`/`carril` si se solapa con la reunión larga), `tareas` con minutos, tipo y motivo, `critica` por defecto, `comidas` y `cenas` (6 de cada, ordenadas por la nota de equilibrio de la app; si `recetas` viene vacía, sus listas pegadas en la app) y `semanal` (modo y nivel heredados como en `script/motor-semana.js`).
3. **Genera y publica** con versión visible: `node meta/plantilla-plani/generar.cjs --pantalla --dia dia.json --salida plani-hoy.html`. Para republicar el mismo día, la misma ruta (misma URL).
4. **Avisa de los choques reales** (p. ej. un evento que impide que una tarea larga quepa seguida) y deja que decida él.
5. **Resultado: eventos en el calendario.** Cuando pegue la petición, 🟡 muéstrale la lista y, con su OK, créalos con `create_event` **con `calendarId`**: las tareas de **Corio → calendario CORIO** (`alfredo@corioliscap.com`); **el resto → `* Orchestrate`** (`sanchezbella.com_ckse0a7qqk63pkni108hs8uqfg@group.calendar.google.com`). Hora de Madrid, sin tocar eventos existentes. Verifica con `list_events` y di cuántos se crearon. No dupliques si ya existe uno igual.
6. Los objetivos del día nuevos van a alfplan por tabla de lote; **las tareas no se crean en alfplan**.


1. **Datos (solo lectura):** producción (§0.2) y los eventos de hoy de Google Calendar (`list_events`, zona del calendario). Di la hora de lectura de ambos.
2. **Prepara `dia.json`** (copia `meta/plantilla-plani/dia.corio-2026-10-05.json`): objetivos del día con su cadena y su padre semanal, tareas con estimación y tipo, y los **huecos libres** (el calendario menos lo fijo). Solo las tareas del tema pedido; lo ajeno, fuera.
3. **Genera y publica el artifact** con versión visible: `node meta/plantilla-plani/generar.cjs --dia dia.json --salida plani-hoy.html`. Para republicar el mismo día, usa la misma ruta (misma URL).
4. ***El asistente va objetivo a objetivo con el calendario del día a la vista:** los objetivos ya están decididos (solo lectura); píldoras de objetivo y tarea de la app, acciones propuestas («＋ Crear evento»), el objetivo en foco resaltado en el calendario y el resto atenuado; al final, resumen con la tabla de eventos y la petición lista para copiar.
5. **Arriba, siempre,** el recordatorio «Prioriza organización y comunicación» y 💪🩸🤠🃏. Prioriza antes las tareas de comunicación (pedir, avisar, enviar) y de organización que desbloquean a terceros.
6. **Los objetivos del día van a alfplan** (tabla de lote, cada uno colgado de su objetivo semanal). **Las tareas no se crean en alfplan**: viven en el asistente y en el calendario, salvo que él pida otra cosa.
7. **Resultado: eventos en el calendario.** Cuando Alfredo pegue la petición del paso 3 del asistente, 🟡 muéstrale la lista y, con su OK, créalos con `create_event` en el calendario *Main* (título `[Corio] …`, hora de Madrid, sin tocar eventos existentes). Verifica con `list_events` y di cuántos se crearon. No dupliques si ya existe un evento igual.
8. Respeta el tope: **compromiso ≤ 60 %** de las 7 h; el asistente lo marca. Una sola pregunta por turno en el chat.

## 0. Arranque

1. Horizonte, periodo y año (pregunta si falta). Requisito: hay objetivos fijados (bloque A). Si no los hay, para y propón `/fix`.
2. Lee el estado actual: los objetivos del periodo con sus tareas, las tareas heredadas/sueltas y las tareas vencidas.
   **Lectura de datos (producción viva, no copia local):** `GET https://alfplan.sanchezbella.com/api/data?esquema=2`, solo lectura, con `mcp__claude_ai_Vercel__web_fetch_vercel_url` (la app va tras el SSO de Vercel: `curl` recibe un 302; esa herramienta va autenticada como Alfredo). La respuesta es grande y la herramienta la guarda en un fichero: usa su ruta como `DATOS` (`DATOS=<ruta> node -e '…'`); es JSON envuelto en `{success, status, text}`. **Di la hora de lectura.** Si no se puede leer, para: no uses `local-data/` (va por detrás) ni sigas de memoria; pide que pegue los datos. Ejemplo para los objetivos:

```bash
node -e 'const d=JSON.parse(JSON.parse(require("fs").readFileSync(process.env.DATOS,"utf8")).text);const A=Object.fromEntries(d.areas.map(a=>[a.id,a.area]));
const [h,p]=process.argv.slice(1);
console.log(d.objetivos.filter(o=>o.horizonte===h&&(!p||o.periodo===p)).map(o=>[A[o.area_id],o.tema,o.texto,o.inicio,o.actual,o.estado,o.periodo].join(" | ")).join("\n"))' trimestral Q4
```

3. Pregunta solo los **bloqueos y compromisos fijos** del periodo («¿qué no puedes mover?»: reuniones, viajes, citas), **no** el total de horas: ese total a ciegas no es fiable. El total se confirma al cierre, ya con las tareas estimadas. Referencia aproximada de la app para ese cálculo: anual 1.800 h · trimestral 450 · mensual 150 · semanal 35 · diario 7, menos los bloqueos del periodo.

### Alcance: qué se planifica

- **Solo el horizonte en curso**, a fondo. No se baja a tareas de los horizontes de debajo, salvo el diario.
- **Diario**: **hoy a fondo**; **esta semana y la siguiente**, las **tareas principales**, **día a día** (todos los días).

## 1. Ruta crítica (antes de planificar)

Con todos los objetivos del periodo delante, y antes de bajar a tareas:

1. **Dependencias**: qué entregable tiene que estar antes de cuál (p. ej. proyecto → valoración → borrador de la LOI). Si dos objetivos compiten por el mismo recurso o el mismo día, dilo.
2. **Orden**: ordena los objetivos por esa cadena y marca el **cuello de botella** (TOC): lo que, si se retrasa, retrasa todo lo demás. Planifica primero lo suyo y **reserva su tiempo antes de llenar con el resto** (lo crítico primero).
3. **Fecha de alarma**: la fecha en la que, si algo de la cadena no está, se mueve el resto (como la regla de pivote de `/fix`).

La ruta crítica **vive en la conversación y en la tabla de cierre**, no en la app: no inventes columnas ni campos para guardarla.

## 2. Tema a tema, objetivo a objetivo

Por cada objetivo, en el orden de la app:

1. **Generar opciones**: al menos dos rutas y «no hacer nada» como referencia; busca asimetrías (poco riesgo abajo, mucho recorrido arriba). Primeros principios antes que copiar la solución estándar.
2. **Decidir**: ruin filter primero → TOC (¿es el cuello de botella?) → semáforo 🟢🟡🔴. Decide explícitamente **qué no se hace** (al backlog).
3. **Reutilizar antes que crear**: cruza lo decidido con las tareas que ya existen (heredadas, vencidas, sueltas). Si una tarea existente cubre el mismo entregable, **modifícala** (reprograma, renombra, mueve al objetivo correcto o a otro horizonte); crea solo si no hay equivalente y borra solo con OK explícito. Entrega una tabla **existente → destino → cambio**.
4. **Planificar**: tareas con **verbo + objeto + entregable verificable**, dueño y estimación (las tareas nuevas, con colchón ×1,5; se calibra con `/rev`).
   - **El horizonte lo fija la duración**, no la fecha límite ni la semana en que se hará. Criterio: **«¿lo haré en un día o me llevará más?»** (para trocear, **1 día ≈ 2 h de trabajo efectivo**; no es el tiempo total de ejecución).
     - **Diario**: cabe en un día · **semanal**: más de un día y hasta una semana · **mensual**: más de una semana y hasta un mes · **trimestral**: más de un mes y hasta un trimestre · **anual**: más de un trimestre.
     - **Si no cabe en su horizonte, es un subobjetivo**: no es una tarea, es un objetivo pequeño; pártelo en tareas que sí quepan (p. ej. «hacer la due diligence» = 6 semanas → subobjetivo «Due diligence terminada» con tareas de 2 h a 2 días).
   - **Una tarea de esta semana de un día o menos es diaria**, y se **asigna a un día concreto donde encaje** (tentativo; se reasigna después), **aunque ese día sea lejano**. Una tarea de 1 h que vence en tres semanas es diaria.
   - **Con fecha límite real**, asígnala a un día **anterior** al límite, con margen.
   - **Desplazamientos**: una tarea presencial incluye **ida y vuelta y un margen para no ir con prisa**; no encadenes dos desplazamientos sin hueco. Si no sabes el trayecto, pregúntalo.
   - **Lo que hay que hacer, separado de lo que se puede hacer**: cada día (y cada semana) tiene un **compromiso** —lo imprescindible, centrado en lo prioritario (*critical* y P1)— y una lista **«si hay tiempo»** (P2 y P3). Solo el compromiso cuenta contra la capacidad: no sobreestimes lo que cabe en un día.
   - **Límite de «doing»**: como mucho 3 tareas en curso por proyecto.
   - **Una siguiente acción** por objetivo, marcada como la primera (solo en la conversación).
   - **Agrupa las tareas del mismo tipo** (llamadas, mails, contabilidad) en un bloque.
   - **Dependencia de un tercero = dos tareas**: «pedir X» (con fecha) y «revisar X» (cuando llegue).
   - **Cobertura**: todo objetivo con al menos una tarea.
5. Las tareas que no cuelgan de ningún objetivo son mantenimiento: sepáralas y cuéntalas.

## 3. Cierre

Suma las estimaciones y calcula el **tiempo disponible** con lo que sabes (referencia de la app, menos los bloqueos que dio al arrancar). **Ahora sí pregunta**, con la cifra delante: «esto pide X h y calculo Y h libres, ¿lo confirmas?». Compara el **compromiso** (no la lista «si hay tiempo»): **≤ 60 %** (el 40 % absorbe lo que entre; por debajo del 35 % casi siempre es que falta planificar). Si se pasa, propón qué recortar y deja que decida él. Entrega la tabla en dos bloques —**compromiso** y **si hay tiempo**— con: orden (ruta crítica) · objetivo · tarea · horizonte/periodo (día asignado) · estimación · prioridad, más el % de mantenimiento, la fecha de alarma y la lista «no se hace». La **estimación y el orden viven solo en esta tabla** (no entran en la app ni en el lote). **Reasignación al cierre del día**: lo no hecho de hoy se reasigna, en el mismo gesto, al siguiente día que encaje; no se arrastra suelto. Siguiente paso: ejecutar desde Foco.

### Entrega en lote

Formato y reglas: `meta/EDICION_EN_LOTE.md` (repo alfplan). Además de la tabla de cierre (que lleva estimación y mantenimiento, que **no** son columnas), entrega **una tabla de lote** para «⇪ Aplicar lote…»:

- `entidad` = `tarea`. Columnas: `entidad · título · objetivo · proyecto · padre · horizonte · periodo · año · prioridad · owner`.
- `objetivo` = título exacto o id del objetivo al que sirve la tarea (`#n` si lo creas en el mismo lote); `proyecto` solo si procede. Una tarea nueva **exige horizonte y periodo** (`S41`, `oct`, `T4`, `2026-10-07` en diario).
- Subtareas: `padre` = `#n` de la tarea madre (que va antes en la tabla).
- Las tareas de mantenimiento van en la misma tabla, sin `objetivo`.
- El texto de cada tarea: verbo + objeto + entregable verificable. La estimación va en la tabla de cierre, no aquí.

## Reglas

- No saltes los pasos 1 y 2 (hazlos por dentro, ver «Cómo conducir la sesión»): la trampa de la guía es planificar la primera opción que funcionaba.
- **Preguntas autocontenidas**: nombra la tarea y el objetivo completos, sin etiquetas internas. Muestra primero lo que hay, en tabla. Lleva una lista acumulada de cambios (decidido · pendiente · bloqueado); un dato sin resolver es *pendiente*, no hecho.
- **Una** pregunta por turno. Dilo antes de ejecutar si ves un error, un riesgo o una opción mejor.
- No escribas en producción por defecto: entrega la tabla para pegarla en «Aplicar lote…»; no uses `local-data/` (copia que va por detrás). Si pide escribir en la app: URL y permiso explícito, **el login lo hace él**, edita uno a uno, verifica tras recargar y no borres sin OK.

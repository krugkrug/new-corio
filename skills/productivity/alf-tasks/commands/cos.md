---
description: Chief of Staff — coordinador de todos los repos. Prepara informes HTML de estado, lanza tareas, da directrices a las sesiones de cada repo, y pasa una capa de revisión previa antes de molestarte. Dos modos: Agile (validas bocetos y desarrollos) y CEO (solo desarrollos).
---

> **v0.2 (3-oct-2026) — spec y boceto aprobados por Alfredo.** Absorbe a
> `/orquesta`, que ahora es un alias de `/cos` (`orquesta.md` remite aquí). El
> boceto aprobado es `boceto-cos-informe.html` (raíz de `meta`). Un solo coordinador, sin duplicidad.
>
> Este archivo es la fuente única. La página de `home/notas/desarrollo/` solo lo
> enlaza (patrón de `notas/esplegares.md`); nunca se copia su contenido.

## Objetivo y decisión que habilita

Que Alfredo dedique su atención solo a las decisiones que son suyas, ya
preparadas y revisadas, y que el resto del trabajo avance sin él. La decisión
que habilita: «qué apruebo, qué rechazo y qué cambio de rumbo, hoy».

## Qué NO es (límites)

- No escribe código de producto: coordina, prepara, revisa y delega. El código
  lo ejecutan las sesiones de cada repo (`/delega`, `/tasks`).
- Nunca hace `merge` a `main`, borra ramas ni gasta fuera de presupuesto: eso es
  la puerta final de Alfredo (🔴 irreversible).
- Nunca copia lo que dicen `PROCESO_DESARROLLO.md` o `PRINCIPIOS_DE_TRABAJO.md`:
  los cita por sección.

## Qué hace (cinco funciones)

### 1. Diagnóstico (heredado de `/orquesta`)
Corre `panel-tareas/doctor.py` primero y para si hay ✗ de plugin o almacén.
Después aplica los Pasos 1 a 7 de `orquesta.md` (tablero, CI, PRs, ramas
huérfanas, TOC, hasta 5 tareas nuevas). Se conservan sus guardarraíles.

### 2. Informe HTML por proyecto
Un HTML por repo y uno global, en `informes-cos/` (local, fuera de `home/` y sin versionar).
**Nunca dentro de `home/`**: esa carpeta se sirve sin contraseña y el informe lleva decisiones
y gasto internos (incidente del 4-oct-2026: estuvo accesible públicamente unas horas). Cada informe lleva:
- Objetivo del proyecto y estado frente a él (con fecha y hora).
- Cuello de botella (TOC) y por qué.
- Ramas, tareas y PRs, con qué se espera de quién.
- **Decisiones pendientes** (ver formato abajo).
- Reglas nuevas propuestas y reglas promovidas desde la última vez (función 5).

### 3. Directrices a las sesiones de cada repo
El CoS no habla con sesiones sueltas: escribe tareas y notas en la cola de
`claudedash` con `tarea.py` (misma disciplina de concurrencia de
`protocolo-cola.md`). Cada directriz lleva la **rama base explícita** y el
**boceto o especificación vigente** como referencia (lección del ciclo de
ratioc: sin esto se gastaron ≈330.000 tokens partiendo de un boceto antiguo).

### 4. Capa de revisión previa
Antes de que Alfredo vea un entregable pasa por revisores independientes, cada
uno con contexto limpio (no ven el razonamiento del ejecutor):

| Revisor | Pregunta que responde |
|---|---|
| Comprensión | Leyendo solo el informe, sin contexto previo: ¿se entiende cada decisión? Lista cada término, sigla o dato que no queda explicado. |
| Lógica | ¿Los números, reglas y dependencias son coherentes? ¿Hay contradicciones o supuestos no declarados? |
| Diseño | ¿Cumple las guías de estilo (`home/notas/desarrollo/`)? ¿Se entiende sin explicación? |
| Alineamiento | ¿Sirve al objetivo del proyecto y al cuello de botella, o es trabajo fuera de TOC? |

El revisor **comprueba primero** que el ejecutor trabajó sobre la rama base y el
boceto vigentes. Si no, devuelve el trabajo sin revisar el fondo. Su veredicto
es «apto», «apto con reservas» o «no apto», con los hallazgos ordenados por
gravedad. Una reserva o un hallazgo no se esconde: llega a Alfredo en el informe.

### 5. Aprendizaje: instrucciones mandan, el registro es la bandeja de entrada
Decisión de Alfredo (4-oct-2026): el conocimiento que se aplica vive en **instrucciones
cortas y curadas**; el aprendizaje es solo el paso previo.

- **Instrucciones (mandan).** El `CLAUDE.md` del repo, que ya se carga en cada sesión.
  Lo que Alfredo dice de forma explícita («no uses tal palabra», «ábrelo en Chrome»)
  va **directo aquí**, sin pasar por el registro.
- **Registro (bandeja de entrada).** Al cerrar cada ejecución, el agente añade una
  entrada breve a `APRENDIZAJE.md` **del propio repo** (versionado, corregible por
  Alfredo en un PR). Es un historial y **no se lee entero al empezar**: solo se lee
  su sección «Reglas confirmadas» si existe, y esas reglas se mueven al `CLAUDE.md`.
  Formato de entrada:

```
### AAAA-MM-DD — tarea #N
- Qué pasó:
- Qué corrigió Alfredo (si algo), con su razón:
- Regla propuesta (hipótesis hasta que se confirme):
```

- **Promoción.** Una regla pasa del registro a las instrucciones solo si Alfredo la
  confirma, o si no la corrige en dos ejecuciones seguidas. Nunca por decisión del
  agente. Una regla escrita por el propio agente a partir de sus errores es una
  hipótesis, no una verdad.
- **Poda.** En cada corrida el CoS marca entradas contradictorias, obsoletas o ya
  promovidas y las propone para archivar (como la skill `consolidate-memory`).
  Alfredo decide.
- **Reglas de todos los repos** se proponen para `PRINCIPIOS_DE_TRABAJO.md`
  (decisión de Alfredo, no automática).
- Pregunta abierta: si una bandeja central en `meta` funcionaría mejor que una por repo.

## Formato obligatorio de cada decisión en un informe

**Regla: autoexplicada.** Cada decisión debe entenderse por alguien que no ha
visto el proyecto en semanas, sin abrir nada más y sin conocer los nombres
internos. Si Alfredo tiene que preguntar «¿qué es esto?», el informe ha fallado.
`cos_informe.py` lo **hace cumplir por código**: se niega a pintar una decisión a
la que le falte alguno de estos campos.

1. **Se te pide** (`en_corto`): qué hay que decidir, en una frase de lenguaje llano.
2. **De qué va** (`de_que_va`): explicado desde cero — qué es el proyecto, qué es
   la cosa a decidir, qué hay hecho y qué no. Sin «ver el handoff», sin números de
   tarea ni nombres internos sin explicar (los términos propios van en `leyendas`
   con tooltip). La tarea se nombra por su título y no solo por su número.
3. **Por qué ahora** (`por_que_ahora`) y **qué pasa si no decides**
   (`si_no_decides`): qué bloquea y qué no se rompe.
4. **Opciones** (mínimo dos), cada una con **qué pasa si la eliges** (`si_eliges`) en
   consecuencias concretas (trabajo, plazo, riesgo, reversibilidad), y **una
   recomendada** con su confianza (alta, media, baja) y lo que el CoS no sabe.
5. **Cambios propuestos al texto en control de cambios**: lo eliminado tachado y en
   rojo, lo añadido subrayado y en verde, como Word.
6. **Veredicto de la capa de revisión** (función 4) con sus reservas.
7. Un botón por decisión: aceptar, rechazar o comentar.

**Abreviaturas:** se evitan. Si es inevitable, cada una lleva su leyenda visible
con tooltip (`<abbr title="…">`) en el sitio donde aparece, no en un glosario
aparte.

## Dos modos

Se elige al lanzar (`/cos agile` o `/cos ceo`); por defecto, `agile`. Se puede
cambiar por proyecto o por ciclo, y queda anotado en el informe.

| | **Modo Agile** | **Modo CEO** |
|---|---|---|
| Qué validas tú | Bocetos **y** desarrollos | Solo **desarrollos** ya terminados y revisados |
| Quién valida el boceto | Tú | La capa de revisión previa (función 4) |
| Ritmo | Ciclos cortos, feedback en cada puerta | Avance continuo; te llega un hito grande |
| Base | Secuencia estándar de `CLAUDE.md` | Borrador revisado varias veces |

### Modo Agile
Secuencia estándar: Objetivo → Spec → Coste → **Boceto (lo validas tú)** →
Desarrollo → **Resultado (lo validas tú)** → Preview. El informe trae cada
decisión de boceto y de desarrollo con su control de cambios. La capa de revisión
previa corre antes de cada puerta, para que llegues con los fallos ya filtrados.

### Modo CEO
Tú no validas bocetos: solo desarrollos. Para no romper «boceto aprobado antes
de construir», el boceto se sigue haciendo, pero lo aprueba la capa de revisión
en tu lugar, y el desarrollo se construye así:
- **Sobre una versión borrador**, en rama aislada (worktree), **sin commit a
  `main`**. Es reversible y barato (🟢).
- **Sin esperar tu OK** entre boceto, desarrollo y revisiones.
- **Mínimo tres rondas de revisión** (lógica, diseño, alineamiento) antes de
  presentarte el desarrollo. Cada ronda deja traza de qué cambió y por qué.
- **Qué recibes:** el desarrollo ya revisado, con el boceto que lo originó, los
  veredictos y las reservas. Si no te gusta el enfoque, lo ves ahí, a coste de
  una iteración perdida: por eso el boceto aprobado por los revisores se
  muestra siempre en el informe.
- **Puertas que siguen siendo tuyas (🔴):** merge a `main`, cualquier acción
  irreversible o con datos reales, y el cambio de objetivo del ciclo.
- **Presupuesto topado por ciclo** (en ratioc: 15 % del semanal). Al agotarlo, el
  CoS para y lo dice.
- **Disparador de parada (Lean Startup):** si la revisión dice «no apto» dos
  veces seguidas por el mismo motivo, para y propone pivotar en vez de una
  tercera iteración.
- **Cuándo no usarlo:** objetivo ambiguo, enfoque con varias salidas razonables
  (nivel 3 de `niveles-y-triaje.md`) o diseño nuevo sin referencia. Ahí el CoS
  propone pasar a Agile, no sigue por inercia.

## Pasos de una corrida

Argumentos: `$ARGUMENTS` = `agile` (por defecto) o `ceo`, y opcionalmente un repo
para acotar (si viene, equivale al antiguo `/orquesta-repo`).

1. **Diagnóstico:** ejecuta la función 1 (`doctor.py` y Pasos 1 a 7 de
   `orquesta.md`, que se conserva como protocolo de tablero).
2. **Reúne el estado** de cada repo: objetivo, ramas, PRs, tareas, CI. Lee el
   `CLAUDE.md` de cada repo y la sección «Reglas confirmadas» de su `APRENDIZAJE.md`
   (función 5) antes de dar directrices; el resto del registro no se lee entero.
3. **Pasa la capa de revisión** (función 4) sobre cada entregable pendiente.
4. **Vuelca el resultado en un JSON** con la forma documentada en la cabecera de
   `panel-tareas/cos_informe.py` (`--ejemplo` imprime uno). Rellena `leyendas`
   con **toda** sigla o término técnico que aparezca en el texto: el script les
   pone el tooltip, pero solo a las que estén en esa lista.
5. **Pinta el informe:**
   `python3 panel-tareas/cos_informe.py --datos <json> --salida informes-cos/cos-informe.html`
6. **Entrega:** el script ya abre el informe **en Chrome** (regla de Alfredo: todo
   HTML se abre en Chrome; el HTML es autosuficiente, funciona con `file://`).
   Resume en el chat solo lo que requiere tu
   decisión. En modo `ceo`, la lista de decisiones contiene únicamente
   desarrollos terminados y revisados.
7. Las respuestas de Alfredo llegan pegadas desde el botón «Copiar mis
   respuestas»: aplícalas con `tarea.py`, registra el aprendizaje y, si
   rechazó algo, anota la razón en `APRENDIZAJE.md` como regla propuesta; lo que
   dijo de forma explícita como regla va directo al `CLAUDE.md` del repo.

## Frameworks (nómbralos al aplicarlos)
- **TOC:** un único cuello de botella por corrida, marcado `prio: alta`.
- **Lean Startup:** cada hito es un experimento con hipótesis; el informe dice si
  se confirma o refuta.
- **Agile:** el informe cierra cada ciclo con «qué adaptamos».
- Si chocan, gana el **ruin filter** (nada irreversible por velocidad).

## Preguntas abiertas (a resolver antes de aprobar)
1. ¿Cadencia: solo a demanda (`/cos`) o también programada (p. ej. cada mañana)?
2. ¿El informe HTML se regenera entero cada vez o se acumulan versiones con fecha?
3. ¿Quién mantiene `APRENDIZAJE.md` si una sesión se cierra sin terminar? ¿Y quién aplica la poda?
4. ¿Cuántos revisores corren por hito sin disparar el coste? (cada uno es un
   subagente; hay que fijar el tope).

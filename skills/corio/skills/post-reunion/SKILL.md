---
name: post-reunion
description: Qué hacer después de una reunión o llamada con un target del search fund (Coriolis Capital) — aplicar el filtro duro de la ficha antes de nada, contrastar las cifras del vendedor contra cuentas depositadas, y solo entonces preparar la solicitud de información y las filas para coriodash. Cubre la transición Reunión → Field trip del embudo (etapas 3→4), NO la etapa "Pre-due" (etapa 6, posterior a la oferta filtro). Úsala cuando el usuario diga que ha tenido una llamada o reunión con una empresa objetivo, pida "qué le pido ahora", "la lista de información", "el email de seguimiento", "request list", o pase notas o transcripción de una llamada con un propietario o intermediario — aunque no mencione la palabra "target".
---

# Post-reunión — del acta de la llamada a las filas de coriodash

**Versión:** v0.3 · **Fecha:** 25/09/2026 · **Responsable:** Alfredo Sánchez-Bella Solís (GP)
> v0.2: reescrita tras leer `FICHA_SEARCHFUND_TARGET.txt`, `SUBPROYECTO_HERRAMIENTA_DEALS.txt`
> y el Sheet de coriodash. Cambios: renombrada desde `pre-due` (nombre ocupado por la etapa 6
> del embudo), antepuesto el filtro duro + ruin filter a la solicitud, incorporada la regla
> Verdimill, y el output pasa de prosa a **filas de las entidades reales de coriodash**.
>
> v0.3: la regla Verdimill pasa a **regla de contraste** general (cualquier cifra del vendedor,
> incluida la actividad fuera de contabilidad, §3); el email absorbe las reglas del guion de
> coriodash y se añade la entrada desde el guion (§8, §9); las categorías de `qa` se alinean
> con las de la app (§9). Además incorpora el feedback de Alfredo de las sesiones del 24-25/09/2026:
> fuentes de contraste (§3), libro registro de facturas (§7) y reglas y modelo del email (§8).

---

## 1. Dónde encaja (y dónde no)

Embudo de Coriolis (`FICHA_SEARCHFUND_TARGET.md` §6):

> Screening → Análisis+scorecard → **Reunión** → **Field trip** → Oferta filtro → Pre-due (~1 mes)
> → LOI (~1 sem) → Due (~4 meses) → Compra (~2 meses)

Esta skill cubre **la transición Reunión → Field trip**. No es la etapa "Pre-due", que va después
de la oferta filtro. Si el usuario dice "pre-due" refiriéndose a esto, corrígelo una vez y sigue.

**Hace:** aplicar el filtro duro de la ficha a lo que se ha sabido en la reunión, formular las
red flags, y — solo si el target sobrevive — producir la solicitud de información y las filas
listas para coriodash.

**No hace:** análisis de cuentas (→ `revision-cuentas-anuales`), modelo ni valoración
(→ vista Modelo de coriodash), ni la request list completa de la DD.

---

## 2. Orden de trabajo (no negociable)

El error a evitar es entregar una lista de peticiones sobre un target que debería descartarse.
Pedir información cuesta una bala del proceso y tiempo del vendedor.

1. **Filtro duro** (§4). Si falla un eliminatorio, se dice y se para ahí.
2. **Ruin filter** (§5). Manda sobre la velocidad de avanzar — ficha §5.
3. **Regla de contraste, antes «Verdimill»** (§3). Contraste de cualquier cifra del vendedor
   antes de dar por buena ninguna.
4. Solo entonces: **solicitud de información** (§6–§8) y **filas de coriodash** (§9).

---

## 3. Regla de contraste (antes «regla Verdimill») — bloqueante

> Origen: target `manual-1JtuSMtsBp`, 22/07/2026. El dossier del intermediario declaraba un
> EBITDA de 158–293 k€; las cuentas depositadas daban 69–103 k€. **Entre 1,7x y 2,9x inflado.**
> El precio pedido pasaba de un múltiplo aparente de 3,2x a **7,8x real**. **La diferencia eran
> ingresos fuera de contabilidad** (dato de Alfredo, 25/09/2026): la rentabilidad declarada no
> figuraba en las cuentas y, por tanto, no se podía demostrar.

**Ninguna cifra dada de viva voz o en un dossier por el vendedor o su intermediario se usa hasta
contrastarla con una fuente independiente y verificable.** Vale para cualquier cifra, no solo
para el EBITDA:

| Cifra declarada | Se contrasta con (p. ej.) |
|---|---|
| Ingresos, EBITDA, márgenes | Cuentas depositadas de **todas** las sociedades del grupo (Informa/eInforma/SABI, Deale) y Modelo 200. Las ventas, frente al IVA: Modelo 390 (resumen anual) o los 303 trimestrales, que además muestran la estacionalidad y los saldos a compensar; si el vendedor los facilita tras el NDA |
| Caja y deuda | Balance depositado y extractos bancarios |
| Plantilla y gasto de personal | Modelo 190 (perceptores e importe íntegro) frente al gasto de personal del P&G; vida laboral / TC2 para el nº de personas. Un descuadre apunta a actividad no declarada o a contratistas mal clasificados |
| Clientes y concentración | Modelo 347 (clientes y proveedores por encima de 3.005,06 € con NIF y desglose trimestral; el importe lleva IVA) y el libro registro de facturas (§7, ítem 5). Deben cuadrar con las ventas de las cuentas |

Umbrales y plazos de cada modelo: contrástalos con la orden del ejercicio (confianza media). Ojo: una
empresa en SII no presenta el 390 y presenta solo parte del 347. Ninguno de los tres identifica
todo: el 390 y el 303 no identifican terceros; el 347 no cubre lo que queda por debajo del umbral.

**Procedimiento**

1. Reconstruye el EBITDA real de cada sociedad = resultado de explotación + amortización. Compara
   contra lo declarado, año a año, y anota la desviación como `nota` y, si es material, como
   `red_flag` de categoría **Riesgos operativos**.
2. Recalcula el múltiplo implícito del precio pedido sobre el EBITDA real (el contabilizado).
3. **Clasifica la desviación** (puede ser una mezcla):
   - **Normalización legítima** (gastos no recurrentes, retribución de la propiedad, operaciones
     vinculadas): se documenta y entra como línea de `ajustes` con su soporte.
   - **Perímetro** (escisión, patrimonial, otras sociedades del grupo): se corrige el perímetro
     y se vuelve a contrastar.
   - **Actividad fuera de contabilidad** (ingresos sin contabilizar, cobros en efectivo, gastos
     personales pasados por la empresa): por definición, no es verificable.

**Tratamiento de lo que está fuera de contabilidad**

- **No entra** en el EBITDA base, en el múltiplo ni en la valoración, ni como ajuste aditivo «por
  su palabra». Se valora sobre lo demostrable y se anota como declaración del vendedor, con
  confianza baja.
- **Es ruin filter (§5), no un detalle de precio:** hereda contingencia fiscal y legal (en una
  compra de participaciones la sociedad conserva sus deudas tributarias y sanciones), no se
  puede financiar (la banca presta sobre cuentas) y la rentabilidad no se puede demostrar.
  Confianza media: consulta a un asesor fiscal y legal antes de seguir.
- El entregable es **la condición que lo resolvería** (regularización previa por el vendedor y a
  su cargo, con precio sobre el EBITDA contabilizado) **o el descarte**, no la solicitud de
  información.

**Cómo se pregunta:** neutro, sin acusar y sin sugerir la respuesta: «¿Las cifras que nos
comentas coinciden con las cuentas depositadas? Si no, ¿qué explica la diferencia?». En el guion
de coriodash es un issue de nivel 1 cuando el inventario detecta una desviación.

Anti-patrón de la ficha §10, literal: *"aceptar EBITDA del vendedor sin normalizar"*.

**Señal de alarma reforzada:** si hay **escisión, sociedad patrimonial o varias sociedades del
grupo**, el reparto de beneficio entre ellas puede hacer que las cuentas de la operativa no
representen el negocio. Trátalo como el primer tema a resolver, no como un detalle.

---

## 4. Filtro duro (ficha §3) — eliminatorios

Rellena con lo que se sepa; marca ❓ lo que no y conviértelo en fila de `qa`.

| Criterio | Umbral | Encaje |
|---|---:|:-:|
| EBITDA ajustado | 500k–2M€ (<500k = *size trap*) | ✅/⚠️/❌/❓ |
| Ingresos | >2M€ | |
| Crecimiento ventas | >3–5% anual | |
| Margen EBITDA | >15% (líder >20–30%) | |
| Flujo de caja positivo | >3 años, bajo apalancamiento | |
| CapEx | <10% (asset-light) | |
| Ingresos B2B | >80% | |
| Retención de clientes | >70–85% | |
| Concentración de clientes | <10% por cliente | |
| Exposición al ciclo / riesgo regulatorio | Baja / bajo | |

**Sectores de foco personal:** mantenimiento industrial/HVAC, tratamiento de agua, sostenibilidad,
salud, educación. **Preferidos del fondo:** distribución de valor añadido, contract/specialty
manufacturing, software, e-commerce, servicios generales, tech-enabled, healthcare services.

**Operabilidad (ficha §4)** — el test que más targets debería matar y el que más se salta:

| Heurística | Positivo | Negativo |
|---|---|---|
| Complejidad operativa | Procesos simples | Técnicos/especializados |
| CapEx / maquinaria | Asset-light | Alto, maquinaria compleja |
| Tipo de empresa | Presta servicio **sin** equipo | Produce con equipo |
| Estructura | <20 empleados, plana | >50, silos |
| **Dependencia del dueño** | Delega | **Dueño lleva ventas u ops clave** |

Umbral 50 empleados: obligaciones extra (plan de igualdad, auditoría ~5–15k€/año, comité de
denuncias), ~2–10k€ el primer año.

---

## 5. Ruin filter

Antes de gastar una petición, busca el motivo de descarte irreversible: regulatorio · cliente
único · litigios · **dependencia del dueño** · CapEx oculto · *size trap* · perímetro imposible
(activos productivos fuera de la sociedad que se vende) · **ingresos fuera de
contabilidad** (§3).

Si aparece uno, el entregable es **el descarte o la condición que lo resolvería**, no la lista
de peticiones. Dilo en una frase y ofrece la pregunta única que despeja la duda.

---

## 6. Escalado de la petición

| Tanda | Umbral | Volumen |
|---|---|---|
| **0** — en la propia llamada o el email de gracias | ninguno | cifras que dijo, motivo y calendario de venta, expectativa de precio, socios y su alineación, papel post-venta, NDA ofrecido por ti |
| **1** — post-reunión, con NDA | interés mutuo declarado | 8–10 ítems (§7) |
| **2** — tras el field trip, pre-oferta | tesis y horquilla de precio formadas | mensualizado, aging, contratos, organigrama, litigios, vinculadas |
| **3** — post-LOI | — | fuera de alcance; con asesor legal y fiscal |

**Sube el umbral** cuando (a) hay intermediario con documentación ya preparada, (b) el vendedor
ha autorizado expresamente que pidas, o (c) hay un tema estructural que impide opinar del precio.
**Bájalo** si el vendedor es un fundador sin asesor y la relación es reciente.

---

## 7. Tanda 1 — contenido

Perímetro primero. En pymes familiares con escisiones o patrimoniales — la mayoría en el rango
500k–2M€ de EBITDA — esto va antes que cualquier cifra:

1. **Perímetro**: qué sociedades, qué %, tratamiento de la caja, de los inmuebles y de la marca.
2. **Cuentas anuales completas con memoria**, 3 ejercicios, de **todas** las sociedades del grupo.
3. **Puente EBITDA reportado → normalizado**: sueldos de propiedad, operaciones vinculadas,
   arrendamientos a partes vinculadas, gastos no recurrentes, CapEx que corre por PyG.
4. **PyG del ejercicio en curso** + comparativa del mismo periodo anterior.
5. **Libro registro de facturas emitidas y recibidas** de los 3 últimos ejercicios (Excel):
   anonimizado si hace falta, con un ID de cliente y de proveedor **constante entre años**, **sin
   anonimizar las partes vinculadas** (que aparezcan con su nombre o marcadas como «vinculada»)
   y con fecha, base, tipo de IVA (o si es exenta o con inversión del sujeto pasivo), cuenta o
   concepto y, si se puede, fecha de cobro o pago. Da de una vez las **ventas por cliente** (top
   10 con %; el umbral es <10% por cliente), el peso de los proveedores y el circulante, y
   permite contrastar los ingresos (§3). Si no lo facilitan, se piden las ventas por cliente (top
   10 con %) por separado.
6. **Ventas y margen bruto por línea**.
7. **Cartera de pedidos firmada** a fecha de hoy.
8. **Plantilla**: nº, coste, antigüedad, función, y quién es crítico.
9. **Deuda, avales, garantías y líneas de circulante**.
10. **Titularidad** de marca, dominios, software y activos intangibles.

---

## 8. Redacción del email

1. **Corto y priorizado.** Solo lo que mueve el EBITDA o el precio. En la práctica, de 4 a 8
   puntos (4 en un primer email de documentos; 8 tras una reunión larga). Más de 10 → anexo.
2. **Agradece y demuestra escucha** con algo concreto que dijo. Es lo que separa un search fund
   de un banco, y es la ventaja competitiva del proceso propietario.
3. **Justifica por bloques, no por línea.** El vendedor debe entender qué gana él.
4. **Formato flexible**: "en el formato que ya tengáis, no hace falta preparar nada nuevo".
5. **Plazo suave con motivo**, nunca un deadline seco.
6. **Confidencialidad** y quién más lo verá.
7. **Siguiente paso concreto con fecha** — idealmente el field trip.
8. **Idioma y tratamiento del destinatario.**
9. **Sin jerga de PE con un fundador** (nada de "data room", "run rate", "carve-out").
   Con un asesor de M&A, sí.
10. **No repitas lo ya hablado ni lo ya sabido.** Antes de redactar, tacha lo que se contestó en la
    reunión (notas o transcripción), lo que ya está cargado en Ajustes y lo que ya figura en
    emails previos. Alfredo quitó de un borrador la tesorería, el capital y la transición por «ya
    lo tenemos» y «ya discutida».
11. **Documentos por email; lo cualitativo, lo delicado y lo negociable, a la reunión.** Pide el
    documento, no la explicación. Nada de inferencias sobre personas ni cifras que delaten lo que
    ya hemos visto: pide las fechas o el desglose sin decir por qué.
12. **Prefiere el libro registro de facturas** (§7, ítem 5) a los agregados sueltos (facturación
    por cliente, peso de proveedores).
13. **Estilo de Alfredo:** tú, viñetas sin numerar ni encabezados por bloque, una frase inicial
    («Como quedamos, os traslado los puntos que quedaron pendientes…») y un cierre hacia el
    siguiente paso.

**Si la reunión se preparó con el guion de coriodash** (`docs/PRIMERA_REUNION.md`), el email sale
del **estado de sus issues**, no de memoria, con estas reglas:

- Entran solo los issues abiertos, parciales o bloqueados por documento. **Una pregunta por
  issue**: la que falta, no las ya respondidas.
- Se ordenan **por tema** (Clientes, Organización…), sin encabezados. Los objetivos y niveles del
  guion son internos y no se nombran.
- La documentación va al final, con nombre exacto, periodo y formato, y **filtrada por tanda
  (§6)**: lo que no toque todavía queda como `a_solicitar` en `documentos` y no se envía.
- **Nada interno:** ni el impacto en EBITDA, ni la valoración, ni hipótesis, ni el contexto del
  tema, ni nuestra tesis. Preguntas neutras, sin sí/no que sugieran la respuesta.
- El plazo y el siguiente paso los pone Alfredo: en el borrador quedan como `[fecha]`.
- **Solo borrador.** Nunca se envía sin OK expreso de Alfredo (🔴: sale fuera). Al enviarlo, los
  documentos pasan a `solicitado` y se anota la fecha.

**Si hay intermediario, se parte en dos emails:** la carga documental al asesor; al propietario,
agradecimiento y preguntas cualitativas. Nunca mandar la lista larga al fundador.
**Excepción:** si el intermediario asistió a la reunión y los propietarios son interlocutores
directos, un solo email a los propietarios con el intermediario en copia (así se hizo con un
target reciente; confianza baja, fue aprobación implícita). Si el error está en un dato que dio
el intermediario (p. ej., un error en su ficha), va en un **mensaje aparte, corto, al
intermediario**.

**Qué no pedir todavía:** nóminas individuales · escrituras y libros societarios · acceso al ERP
o a la contabilidad en bruto · listado íntegro de clientes con nombre · proyecciones a 5 años
elaboradas por él · cualquier cosa que le obligue a **construir** un documento nuevo.

**Modelo** (estilo de Alfredo; datos ficticios):

> **Asunto:** [Proyecto] — puntos pendientes
>
> Buenos días, [Nombre]:
>
> Muchas gracias de nuevo por la reunión del [día]. [Una frase con algo concreto que dijeron.]
>
> Como quedamos, os traslado los puntos que quedaron pendientes y que nos ayudarían a afinar el
> análisis:
>
> - [Punto pendiente de un issue abierto: la pregunta que falta, en una línea.]
> - [Otro punto pendiente.]
> - Listado de facturas emitidas y recibidas de 2023 a 2025 (anonimizado si hace falta)
> - Proyectos que ya tengáis vendidos para este año, con su importe y la fecha prevista de ejecución
> - [Un documento por línea: nombre exacto, periodo, formato.]
>
> Con esta información os podré confirmar los siguientes pasos y, si seguimos adelante, os
> propondría las condiciones principales de una carta de intenciones.
>
> Quedo a vuestra disposición para cualquier duda.
>
> Un saludo,
>
> Alfredo

---

## 9. Output — filas de coriodash

El entregable no es prosa: son filas de las entidades reales del Sheet. Usa los enums exactos.

**a) `targets`** — si el target no está de alta. `fuente = manual`, `estado` ∈
`sin_estado | evaluando | solicitado | conectado | descartado`, `fase` ∈
`contactado | oferta_enviada | due_diligence | cerrado`, `prioridad` 1–10 (10 = máxima).

**b) `notas`** — `id · target_id · fecha · autor · texto`. Una nota por bloque de hallazgo:
origen del lead, valoración y su base, condiciones, tendencia de cifras, contraste con cuentas
depositadas, próximos pasos.

**c) `qa`** — `id · target_id · categoria · pregunta · respuesta · fecha`.
Categorías: las de la app (`CATEGORIAS_QA` en `client/src/components/target/overview.tsx` de
coriodash): **Target intro · Clientes · Producto / servicio · Competidores · Organización y Ops ·
Balance · Operación · Proyecto** (y «Otras» si no encaja). `respuesta` vacía = pendiente. Todo ❓ del §4 se convierte en una fila aquí.

**d) `red_flags`** — `target_id · descripcion · severidad (1–5) · probabilidad (1–5) · id ·
categoria · mitigacion`. Categorías fijas: **Concentración de cliente · Dependencia del
propietario · Tecnología · Riesgos operativos · Contingencias fiscales y laborales**.
Siempre con mitigación propuesta; sin mitigación no es una red flag, es un descarte.

**e) `ajustes`** — `id · target_id · concepto · anio · valor · motivo`. Líneas **aditivas** de
normalización del EBITDA. Da de alta el concepto y el motivo aunque el valor esté por
determinar; el `EBITDA ajustado` = EBITDA de fuentes + total de estas líneas.

**f) `personas`** — `id · target_id · nombre · rol · antiguedad · dependencia · nota`.
Propietarios, directivos e interlocutores del proceso.

**g) `documentos`** — `id · target_id · nombre · estado · enlace · fecha · seccion · subseccion`.
**`estado` ∈ `a_solicitar | solicitado | recibido`.** Esta tabla ES el registro de seguimiento:
cada ítem de la Tanda 1 entra como `a_solicitar` y pasa a `solicitado` al enviar el email.
Secciones fijas: `Deale`, `Otros`.

**Entrada desde el guion de coriodash → filas.** Si hay guion (`docs/PRIMERA_REUNION.md`), cada
elemento pasa a una fila:

- Pregunta respondida → `qa` (`categoria` = la rúbrica del tema, `respuesta`, `fecha`). Issue
  abierto o parcial → la pregunta que falta, con `respuesta` vacía.
- **Una respuesta que es una condición** (p. ej. «firma el NDA y lo ves») **no es respuesta**: la
  pregunta sigue pendiente (`respuesta` vacía) y la condición va en una `nota`.
- Sondeo 🚩 → `red_flags` con su mitigación; sin mitigación, es una `nota`.
- Pregunta de tipo cifra o documento → `documentos` (`a_solicitar` hasta enviarse).
- Ajustes que proponga el vendedor → `ajustes` solo con soporte documental (§3); sin él, `nota`
  con confianza baja.
- El **impacto en EBITDA** y el **contexto** del guion son internos: no se escriben en `qa`.

**h) El o los emails**, listos para enviar.

Y por último: **resumen de la reunión + lo que no se preguntó y debería haberse preguntado.**
Esa lista alimenta la siguiente conversación y es la parte más útil del entregable.

---

## 10. Confidencialidad

🔴 **Los datos reales de un target no van nunca a un repo de git.** Ficha, cifras, valoración y
motivo de venta son confidenciales (`WEBAPP_GUARDRAILS_DEVOPS.md` §5). Viven en el Google Sheet
de coriodash y en Drive, nunca en `meta` ni en `coriodash`. Esta skill es plantilla vacía y sí
se versiona; su output, no. Si el usuario pide guardar el análisis en el repo, recuérdaselo.

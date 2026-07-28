---
name: post-reunion
description: Qué hacer después de una reunión o llamada con un target del search fund (Coriolis Capital) — aplicar el filtro duro de la ficha antes de nada, contrastar las cifras del vendedor contra cuentas depositadas, y solo entonces preparar la solicitud de información y las filas para coriodash. Cubre la transición Reunión → Field trip del embudo (etapas 3→4), NO la etapa "Pre-due" (etapa 6, posterior a la oferta filtro). Úsala cuando el usuario diga que ha tenido una llamada o reunión con una empresa objetivo, pida "qué le pido ahora", "la lista de información", "el email de seguimiento", "request list", o pase notas o transcripción de una llamada con un propietario o intermediario — aunque no mencione la palabra "target".
---

# Post-reunión — del acta de la llamada a las filas de coriodash

**Versión:** v0.2 · **Fecha:** 23/07/2026 · **Responsable:** Alfredo Sánchez-Bella Solís (GP)
> v0.2: reescrita tras leer `FICHA_SEARCHFUND_TARGET.txt`, `SUBPROYECTO_HERRAMIENTA_DEALS.txt`
> y el Sheet de coriodash. Cambios: renombrada desde `pre-due` (nombre ocupado por la etapa 6
> del embudo), antepuesto el filtro duro + ruin filter a la solicitud, incorporada la regla
> Verdimill, y el output pasa de prosa a **filas de las entidades reales de coriodash**.

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
3. **Regla Verdimill** (§3). Contraste de cifras antes de dar por buena ninguna.
4. Solo entonces: **solicitud de información** (§6–§8) y **filas de coriodash** (§9).

---

## 3. Regla Verdimill — bloqueante

> Origen: target `manual-1JtuSMtsBp`, 22/07/2026. El dossier del intermediario declaraba un
> EBITDA de 158–293 k€; las cuentas depositadas daban 69–103 k€. **Entre 1,7x y 2,9x inflado.**
> El precio pedido pasaba de un múltiplo aparente de 3,2x a **7,8x real**.

**Ninguna cifra dada de viva voz por el vendedor o por su intermediario se usa hasta contrastarla
con las cuentas depositadas.** Antes de redactar cualquier email:

- Descarga las cuentas depositadas de **todas** las sociedades del grupo (Informa/eInforma/SABI).
- Reconstruye el EBITDA real = resultado de explotación + amortización.
- Compara contra lo declarado, año a año, y anota la desviación como `nota` y, si es material,
  como `red_flag` de categoría **Riesgos operativos**.
- Recalcula el múltiplo implícito del precio pedido sobre el EBITDA real.

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
(activos productivos fuera de la sociedad que se vende).

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
5. **Ventas por cliente** (top 10 con %) — el umbral es <10% por cliente.
6. **Ventas y margen bruto por línea**.
7. **Cartera de pedidos firmada** a fecha de hoy.
8. **Plantilla**: nº, coste, antigüedad, función, y quién es crítico.
9. **Deuda, avales, garantías y líneas de circulante**.
10. **Titularidad** de marca, dominios, software y activos intangibles.

---

## 8. Redacción del email

1. **Corto.** Más de 10 puntos → anexo.
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

**Si hay intermediario, se parte en dos emails:** la carga documental al asesor; al propietario,
agradecimiento y preguntas cualitativas. Nunca mandar la lista larga al fundador.

**Qué no pedir todavía:** nóminas individuales · escrituras y libros societarios · acceso al ERP
o a la contabilidad en bruto · listado íntegro de clientes con nombre · proyecciones a 5 años
elaboradas por él · cualquier cosa que le obligue a **construir** un documento nuevo.

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
Categorías fijas: **Financiero · Operaciones · Organización / RRHH · Regulación · Comercial ·
Otros**. `respuesta` vacía = pendiente. Todo ❓ del §4 se convierte en una fila aquí.

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

**h) El o los emails**, listos para enviar.

Y por último: **resumen de la reunión + lo que no se preguntó y debería haberse preguntado.**
Esa lista alimenta la siguiente conversación y es la parte más útil del entregable.

---

## 10. Confidencialidad

🔴 **Los datos reales de un target no van nunca a un repo de git.** Ficha, cifras, valoración y
motivo de venta son confidenciales (`WEBAPP_GUARDRAILS_DEVOPS.md` §5). Viven en el Google Sheet
de coriodash y en Drive, nunca en `meta` ni en `coriodash`. Esta skill es plantilla vacía y sí
se versiona; su output, no. Si el usuario pide guardar el análisis en el repo, recuérdaselo.

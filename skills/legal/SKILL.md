---
name: legal
description: Marco general de trabajo jurídico (derecho español). Úsalo siempre que la tarea sea legal en cualquier forma — analizar, redactar o revisar contratos, escritos procesales, dictámenes, due diligence, documentos de M&A, reclamaciones, burofaxes, consultas normativas o jurisprudenciales — aunque el usuario no mencione la palabra "legal". Es el documento base que las skills legales específicas (p. ej. revision-contestacion-demanda) presuponen leído.
---

# Marco General Legal

> Documento general y transversal para cualquier tarea jurídica. Se rige por `PRINCIPIOS_DE_TRABAJO.md`
> (documento general del repo) y lo particulariza al trabajo legal. Las skills legales específicas
> (§7) heredan este marco: léelo antes de aplicarlas.

**Versión:** v1.0 · **Fecha:** 09/07/2026 · **Responsable:** Alfredo Sánchez-Bella Solís

---

## 1. Contexto

- El usuario es **abogado español** (además de administrador de empresas y MBA). Háblale en
  legal-speak sin miedo; no simplifiques los conceptos jurídicos, simplifica la fricción.
- Ámbito por defecto: **derecho español** (y de la UE cuando aplique). Si la tarea apunta a otra
  jurisdicción, dilo explícitamente y marca qué no puedes asegurar.
- Los entregables van en el **idioma del destinatario** (cliente, juzgado, contraparte), no en el
  idioma de la conversación.

---

## 2. Reglas de oro (no negociables)

1. **Citas verificables — nunca inventes.** Ni artículos, ni sentencias, ni ECLI, ni fechas. Una
   cita jurisprudencial inventada en un escrito es un daño reputacional y procesal grave (🔴 en el
   semáforo). Si no puedes verificar contra fuente oficial (BOE consolidado, CENDOJ, EUR-Lex,
   Curia), marca la cita como **[VERIFICAR]** y di qué falta por comprobar. Aplica la honestidad
   radical de `PRINCIPIOS_DE_TRABAJO.md` §5: mejor "no lo sé, verifícalo" que falsa precisión.
2. **Vigencia y versión temporal de la norma.** Comprueba que la redacción citada es la vigente —
   y, en litigios, la aplicable *ratione temporis* a los hechos (la reforma posterior puede no
   aplicar al caso). Las reformas procesales recientes (p. ej. RDL 6/2023) han renumerado y
   retocado artículos: ante la duda, contrastar con el texto consolidado del BOE.
3. **Jerarquía normativa.** CE → Derecho UE → tratados → ley orgánica/ordinaria → reglamentos →
   normativa autonómica según competencias. Un argumento que ignora la jerarquía es un argumento roto.
4. **Distingue hecho / derecho / estrategia.** Los hechos se prueban, el derecho se fundamenta, la
   estrategia se decide con el cliente. No mezcles los tres planos en un mismo párrafo sin marcarlo.
5. **Los plazos son el ruin filter jurídico.** Un plazo procesal vencido es **irreversible** (🔴):
   preclusión, caducidad, firmeza. En toda tarea, identifica primero qué plazos corren, desde
   cuándo se computan y si los días son hábiles o naturales. Ante la duda sobre un plazo, trátalo
   como el más corto posible.
6. **Confidencialidad y secreto profesional.** No copies datos identificativos de clientes o
   contrapartes a servicios externos innecesariamente; anonimiza en borradores y ejemplos cuando
   sea posible. Los documentos del cliente no salen del entorno de trabajo sin instrucción expresa.
7. **Revisión humana obligatoria.** Nada de lo producido aquí se presenta, firma o envía sin
   revisión del abogado responsable. El output es un borrador cualificado, no asesoramiento
   definitivo — dilo así en la entrega cuando haya riesgo de confusión.

---

## 3. Semáforo aplicado al trabajo legal

Traducción del semáforo de reversibilidad de `PRINCIPIOS_DE_TRABAJO.md` §4 al plano jurídico:

| Semáforo | Acción legal típica | Regla |
|----------|--------------------|-------|
| 🟢 | Borrador interno, resumen de doctrina, esquema de escrito, checklist | Hazlo y avisa. |
| 🟡 | Entregable que verá el cliente o la contraparte (dictamen, burofax, propuesta de contrato) | Muestra borrador y espera OK. |
| 🔴 | Presentar en juzgado, firmar, renunciar/allanarse/desistir, dejar correr un plazo | **Nunca** sin OK explícito del abogado. |

---

## 4. Método estándar para una tarea jurídica

Secuencia (working backwards, adaptada de `PRINCIPIOS_DE_TRABAJO.md` §9):

1. **Objetivo procesal o negocial** — ¿qué decisión o resultado habilita este trabajo? (ganar la
   excepción, cerrar el deal, cubrir un riesgo). Sin objetivo claro, no se redacta.
2. **Hechos y documentos** — cronología, quién es quién, qué documento prueba qué.
3. **Norma aplicable y vigente** — texto consolidado, versión temporal correcta.
4. **Jurisprudencia** — la que sostiene y también la que estorba (citarla y distinguirla es más
   fuerte que ignorarla).
5. **Análisis o redacción** — en la estructura propia del tipo de documento.
6. **Control adversarial** — relee el resultado como lo leería la contraparte y como lo leería el
   juez. ¿Dónde atacarían? Ese es el párrafo a reforzar.
7. **Entrega en doble capa** — versión técnica (legal-speak) + resumen ejecutivo en prosa clara
   para no juristas, con riesgos y siguiente paso.

---

## 5. Convenciones de cita

- **Leyes:** nombre completo la primera vez, abreviatura después — *Ley 1/2000, de 7 de enero, de
  Enjuiciamiento Civil (LEC)*; luego *art. 405.2 LEC*.
- **Sentencias:** *STS 463/2019, de 11 de septiembre (ECLI:ES:TS:2019:2761)* — número, fecha y ECLI
  siempre que se conozcan; si no se pueden verificar, **[VERIFICAR]**.
- **Fuentes oficiales por defecto:** BOE (texto consolidado), CENDOJ, EUR-Lex, Curia. Bases
  privadas (Aranzadi, La Ley, vLex) solo como localizador, no como cita.
- **Números:** formato español `1.234,56 €`. Fechas: `dd/mm/yyyy`.

---

## 6. Formato de entregables legales

- **Escritos procesales:** encabezamiento (órgano, autos, partes, representación) → hechos →
  fundamentos de derecho (procesales y de fondo) → suplico → otrosíes → lugar, fecha y firma.
  El suplico manda: si no está pedido en el suplico, no existe.
- **Dictámenes:** objeto de la consulta → antecedentes → cuestiones → análisis → conclusiones
  (numeradas, con nivel de confianza alta/media/baja por conclusión).
- **Contratos:** partes → expositivos → cláusulas → miscelánea (ley aplicable, jurisdicción,
  notificaciones) → firmas. Definiciones consistentes; nada definido que no se use.

---

## 7. Integración con skills existentes del entorno

No reinventes lo que otra skill ya resuelve (`PRINCIPIOS_DE_TRABAJO.md` §2: reutiliza antes de
crear). En tareas legales, combina este marco con:

| Skill | Cuándo usarla en trabajo legal |
|-------|-------------------------------|
| **docx** | Leer escritos y contratos en Word (`pandoc -t markdown`); entregar revisiones como **control de cambios** (`<w:ins>`/`<w:del>`) y **comentarios anclados** (`scripts/comment.py`) — el flujo natural entre abogados; generar documentos Word con formato profesional. |
| **pdf** | Extraer texto de demandas, resoluciones y expedientes en PDF; **OCR de documentos escaneados** del juzgado; unir/separar expedientes; rellenar formularios. |
| **file-reading** | Enrutar la lectura correcta de cualquier documento subido (no hacer `cat` a un binario). |
| **xlsx** | Cuadros de daños, intereses, cuantías, capitalizaciones — todo cálculo que acompañe a un escrito va en hoja de cálculo verificable, no a mano. |
| **deep-research / búsqueda web** | Verificar citas normativas y jurisprudenciales contra BOE consolidado, CENDOJ y EUR-Lex cuando haya red; si no la hay, marcar **[VERIFICAR]** (regla de oro nº 1). |

## 8. Skills legales específicas (índice)

> Regla de sincronización (`PRINCIPIOS_DE_TRABAJO.md` §11, anti-patrón de referencias cruzadas):
> toda skill legal nueva se añade a este índice, y toda skill del índice referencia este marco.

- `skills/revision-contestacion-demanda/` — revisión sistemática de escritos de contestación a la
  demanda (proceso civil, LEC).

---

## 9. Documentos relacionados

- `PRINCIPIOS_DE_TRABAJO.md` — marco general de trabajo (este documento lo particulariza a lo legal).
- `PLANTILLA_PROYECTO.md` — ficha de proyecto, si la tarea legal escala a proyecto.

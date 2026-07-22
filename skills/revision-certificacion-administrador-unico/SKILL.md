---
name: revision-certificacion-administrador-unico
description: Revisión de una certificación del administrador único de los acuerdos sociales de aprobación de las cuentas anuales, aplicación del resultado y aprobación de la gestión, previa a su depósito en el Registro Mercantil (derecho español). Úsala siempre que el usuario pida revisar, comprobar, dar el visto bueno o "echar un vistazo" a una certificación firmada por un administrador único, o mencione depósito de cuentas, aprobación de cuentas anuales, aplicación del resultado, aprobación de la gestión, junta general ordinaria, socio único, decisiones del socio único o el art. 279 LSC — aunque no use la palabra "certificación".
---

# Revisión de Certificación del Administrador Único (aprobación de cuentas, aplicación del resultado, aprobación de la gestión)

> Skill específica. **Antes de aplicarla, lee `skills/legal/SKILL.md`** (marco general legal):
> sus reglas de oro — citas verificables, plazos como ruin filter, revisión humana obligatoria —
> gobiernan también esta revisión. Este documento está referenciado desde el índice §8 de aquel.

**Versión:** v1.0 · **Fecha:** 22/07/2026 · **Responsable:** Alfredo Sánchez-Bella Solís

**Nota de vigencia:** los artículos citados corresponden al texto refundido de la Ley de
Sociedades de Capital (RDLeg 1/2010, "LSC") y al Reglamento del Registro Mercantil (RD 1784/1996,
"RRM"). Ambos textos han sido modificados varias veces (entre otras, Ley 22/2015 de Auditoría de
Cuentas, RDL 1/2021 sobre formulación de cuentas, Ley 5/2021 de fomento de la implicación a largo
plazo de los accionistas, Orden JUS/319/2018 y su modificación por Orden JUS/470/2021 —
declaración de titular real). **Los importes umbral (balance, cifra de negocio, capital social) y
los formularios oficiales cambian con relativa frecuencia**: antes de apoyar un hallazgo en una
cifra o en un modelo concreto, contrasta contra el BOE consolidado y la web del Registro Mercantil
Central, y márcalo **[VERIFICAR]** si no puedes hacerlo.

---

## 1. Qué hace esta skill (y qué no)

**Hace:** revisar una certificación (o su borrador) del administrador único de una sociedad de
capital, referida a los tres acuerdos típicos de la junta general ordinaria (o de la decisión del
socio único, si la sociedad es unipersonal) — aprobación de las cuentas anuales, aplicación del
resultado y aprobación de la gestión — antes de su firma, legitimación y presentación en el
Registro Mercantil. Devuelve un informe accionable con hallazgos clasificados 🔴🟡🟢.

**No hace:** formular las cuentas, decidir la política de dividendos por el cliente, presentar el
depósito, ni sustituir la revisión del abogado responsable. El plazo de depósito es prácticamente
improrrogable en la práctica registral (cierre de hoja): si la revisión detecta que el plazo está
vencido o en riesgo, eso se comunica **primero**, antes de cualquier otro hallazgo.

**Empresa base de referencia:** este skill asume por defecto una sociedad con domicilio social en
**Madrid** (Registro Mercantil de Madrid) y, salvo indicación contraria, una sociedad de
responsabilidad limitada o anónima española sujeta a la LSC. Si la sociedad es de otro tipo
(cooperativa, sociedad profesional con régimen especial, etc.) o de otra provincia, dilo
explícitamente: cambian formularios, tasas y algún trámite accesorio, aunque el fondo societario
(LSC) es el mismo en todo el territorio.

---

## 2. Inputs necesarios

Pide lo que falte antes de empezar; sin los tres primeros la revisión sale coja:

1. **El borrador o la certificación** a revisar (texto completo, no un resumen).
2. **Las cuentas anuales** a que se refiere (balance, cuenta de pérdidas y ganancias, memoria y,
   si no son abreviadas, ECPN y EFE) y, si existe, el **informe de gestión** y el **informe de
   auditoría** — sin ellos no se puede comprobar que las cifras certificadas cuadran con lo
   formulado.
3. **Naturaleza de la sociedad:** ¿unipersonal (un solo socio) o pluripersonal? Determina si el
   acuerdo de origen es una **junta general** (arts. 159 ss. LSC) o una **decisión del socio
   único** (art. 15 LSC) — cambia la forma, no el fondo de los tres acuerdos.
4. **Datos registrales de la sociedad:** denominación exacta, NIF, domicilio, hoja/tomo/folio de
   inscripción en el Registro Mercantil de Madrid, y **vigencia del cargo** del administrador
   único (fecha de nombramiento e inscripción, plazo estatutario — máximo 5 años salvo reelección,
   art. 221 LSC).
5. **Fecha de cierre del ejercicio** y **fecha de celebración** de la junta o de adopción de la
   decisión del socio único — para computar los dos plazos que importan (§ Fase 0).
6. **Instrucciones del cliente**, si las hay: ¿reparto de dividendo, dotación a reservas
   voluntarias, compensación de pérdidas? Sin instrucciones, señala las opciones sin decidirlas.

**Ingesta de documentos:** las certificaciones y las cuentas rara vez llegan en markdown. Usa la
skill **docx** para borradores en Word (`pandoc -t markdown` para leer), la skill **pdf** para
cuentas depositadas o certificaciones ya firmadas y escaneadas, y la skill **xlsx** para
recalcular la aplicación del resultado de forma verificable en vez de a mano.

---

## 3. Proceso de revisión en seis fases

Trabaja las fases en orden — cada una alimenta la siguiente. La checklist detallada de las fases
2–4 está en `references/checklist-certificacion.md`: **léela al ejecutarlas**, no la reproduzcas
de memoria.

### Fase 0 — Plazos (ruin filter)

Dos plazos distintos corren en paralelo; computa ambos con las fechas del input 5:

- **Junta ordinaria dentro de los 6 primeros meses de cada ejercicio** (art. 164.1 LSC). Celebrarla
  fuera de plazo no invalida el acuerdo pero es una irregularidad a señalar (🟡 salvo que agrave un
  riesgo mayor).
- **Depósito en el Registro Mercantil dentro del mes siguiente a la aprobación de las cuentas**
  (art. 279 LSC). Este es el plazo que importa de verdad: superarlo no impide depositar después,
  pero mientras no se deposite (y a partir de cierto punto, aunque se deposite tarde) la hoja
  registral de la sociedad puede quedar **cerrada** para casi todos los actos (art. 282 LSC, art.
  378 RRM), con las excepciones tasadas de cese/dimisión de administradores, revocación de poderes
  y disolución. Un cierre de hoja es reversible (basta depositar) pero bloquea a la sociedad
  mientras dura — trátalo como 🔴 si está vencido o a punto de vencer.

### Fase 1 — Identificación y habilitación del certificante

Antes de entrar en el fondo, verifica que quien certifica puede hacerlo:

- Denominación social, NIF y domicilio **exactos** — deben coincidir letra a letra con la hoja
  registral, no con una versión abreviada o comercial.
- **Cargo vigente del administrador único**: nombramiento inscrito y no caducado (máx. 5 años,
  art. 221.2 LSC, salvo reelección debidamente documentada e inscrita). Un administrador con cargo
  caducado no puede certificar válidamente — defecto clásico de calificación registral.
- Si la sociedad es **unipersonal**, comprueba que esa condición consta inscrita (art. 13 LSC) y
  que el certificante identifica correctamente si administrador único y socio único son la misma
  persona.

### Fase 2 — Revisión formal de la certificación

Requisitos de forma de toda certificación de acuerdos sociales (arts. 109 y 112 RRM), aplicados a
un administrador único que actúa como su propio certificante (no hay presidente ni secretario
distintos, salvo que los estatutos prevean otra cosa):

- Referencia expresa al **libro de actas** (junta) o al **libro-registro de decisiones del socio
  único** (art. 15 LSC), con fecha del acuerdo.
- Declaración sobre la **aprobación del acta**: por la propia junta al finalizar la reunión (art.
  202.2 LSC) o, si no fue así, dentro de los 15 días siguientes por el presidente y dos
  interventores (art. 202.3 LSC) — la certificación no puede ser anterior a esa aprobación.
  En decisión de socio único no hay "acta que aprobar" en sentido estricto: basta la firma del
  socio (o de su representante) en el libro-registro.
- Transcripción **fiel** de los tres acuerdos (no un resumen genérico) con las cifras exactas.
- Fórmula de cierre, fecha y **firma del administrador único** en su condición de tal (evitar
  fórmulas ambiguas como firmar solo "el administrador" sin more).

Checklist completa en `references/checklist-certificacion.md` §B.

### Fase 3 — Formación válida del acuerdo de origen

- **Junta pluripersonal:** si fue **convocada**, comprobar antelación (mínimo 15 días, art. 176
  LSC salvo mayor previsión estatutaria), forma de convocatoria (la que fijen los estatutos:
  BORME + diario, web corporativa, o comunicación individual escrita — art. 173 LSC) y contenido
  mínimo del orden del día. Si fue **universal** (art. 178 LSC), la certificación debe decir
  expresamente que concurrió el 100% del capital social y que se aceptó por unanimidad la
  celebración y el orden del día — un defecto habitual es llamarla "universal" sin esa mención.
- **Socio único:** basta la decisión documentada y firmada; no hay convocatoria ni quorum que
  comprobar, pero sí que la decisión esté fechada y consignada correctamente.
- **Quorum y mayoría de votación** aplicados (mayoría ordinaria del art. 198 LSC en la S.L. salvo
  previsión estatutaria distinta; régimen de quorum reforzado del art. 194 LSC en la S.A. si
  aplica). Un administrador único no vota per se: certifica lo acordado por los socios.

Checklist en §C de la referencia.

### Fase 4 — Revisión de fondo de los tres acuerdos

El corazón de la revisión — cada acuerdo tiene su propio riesgo:

1. **Aprobación de las cuentas anuales** (art. 272 LSC): debe identificar el **ejercicio social**
   exacto, si son individuales o consolidadas, y el resultado de la votación (unanimidad o mayoría
   con desgloses si hubo votos en contra o abstenciones relevantes).
2. **Aplicación del resultado** (art. 273 LSC): el desglose (dotación a reserva legal si no está
   cubierto el 20% del capital social — art. 274 LSC —, dividendos, reservas voluntarias,
   compensación de pérdidas de ejercicios anteriores) **debe sumar exactamente** el resultado del
   ejercicio recogido en la cuenta de pérdidas y ganancias certificada. Si hay reparto de
   dividendo, comprobar el límite del art. 273.2 LSC (patrimonio neto no puede quedar por debajo
   del capital social a consecuencia del reparto).
3. **Aprobación de la gestión social** (art. 164.1.3º LSC): debe figurar como **acuerdo separado y
   expreso** — "censura de la gestión social" o "aprobación de la gestión" —, no fundido ni dado
   por implícito en la aprobación de las cuentas; son dos pronunciamientos distintos aunque se
   voten en el mismo punto del orden del día.

Checklist en §D–§F de la referencia.

### Fase 5 — Control adversarial (como lo leería el registrador mercantil)

Relee la certificación con los ojos de quien la calificará, no con los de quien la redactó. Causas
frecuentes de defecto en el depósito de cuentas en el Registro Mercantil de Madrid:

- Discrepancia entre los datos de la certificación y los de la hoja registral (denominación, NIF,
  domicilio, identidad y vigencia del administrador).
- Falta de mención a la aprobación del acta, o certificación fechada antes de esa aprobación.
- Aplicación del resultado que no cuadra numéricamente con las cuentas.
- Ausencia de la "aprobación de la gestión" como acuerdo diferenciado.
- Falta del **informe de auditoría**, si la sociedad está obligada a auditar sus cuentas (art. 263
  LSC en relación con los umbrales del art. 257 LSC y la Ley 22/2015 — **[VERIFICAR]** los importes
  vigentes, se han modificado varias veces) y no consta exención aplicable.
- Falta de la **declaración de identificación del titular real** exigida en el modelo oficial de
  depósito desde la Orden JUS/470/2021, salvo excepciones tasadas (p. ej. sociedades cotizadas).
- Firma no legitimada notarialmente (depósito en papel) o certificado electrónico reconocido
  incorrecto o caducado (depósito telemático) — el Registro Mercantil de Madrid opera
  mayoritariamente en modo telemático.
- Plazo de depósito vencido sin nota de excepción aplicable → riesgo de cierre de hoja (art. 282
  LSC).

Cada defecto encontrado aquí es un hallazgo del informe. Esta fase existe porque el redactor deja
de ver sus propios huecos: el valor está en el cambio de perspectiva, no en releer más veces.

### Fase 6 — Informe

Emite el informe con la estructura fija de §4. No mezcles severidades ni entierres un 🔴 en medio
de observaciones de estilo.

**Formato de entrega — dos capas:**
1. **Informe en markdown** (plantilla de §4) — siempre.
2. **Si el borrador llegó en .docx, ofrece además devolverlo anotado con la skill docx:** los
   hallazgos 🔴/🟡 como **comentarios anclados** al párrafo afectado (`scripts/comment.py` de la
   skill docx) y las correcciones propuestas como **control de cambios** (`<w:ins>`/`<w:del>`).

**Verificación de citas y cifras:** si hay acceso a red, contrasta los artículos citados contra el
BOE consolidado y confirma los importes umbral de auditoría vigentes antes de darlos por buenos;
lo no contrastado va a la sección "Citas y cifras a verificar" del informe.

---

## 4. Estructura del informe

Usa SIEMPRE esta plantilla:

```markdown
# Informe de revisión — Certificación de acuerdos [sociedad, ejercicio]

## Semáforo global
🔴/🟡/🟢 + una línea de veredicto (¿está en condiciones de depositarse tal cual?)

## Plazos
Junta ordinaria (¿dentro de los 6 primeros meses?) y depósito (¿dentro del mes siguiente a la
aprobación?), con fecha límite estimada de cada uno y confianza del cómputo.

## Hallazgos 🔴 — impiden el depósito o exponen a cierre de hoja
(cargo de administrador caducado, acta no aprobada, aplicación del resultado que no cuadra,
acuerdo de gestión ausente, plazo de depósito vencido, falta de informe de auditoría exigido)
Por hallazgo: qué, dónde (acuerdo/párrafo), por qué es grave, corrección propuesta.

## Hallazgos 🟡 — debilitan la certificación
(formulaciones ambiguas, datos registrales imprecisos, convocatoria con antelación insuficiente,
mención incompleta a la aprobación del acta)

## Hallazgos 🟢 — estilo y forma
(claridad, orden, erratas, formato del modelo oficial)

## Tabla de acuerdos certificados
| Acuerdo | Contenido certificado | Cuadra con las cuentas / cumple el requisito legal | Riesgo |
|---|---|---|---|
| Aprobación de cuentas anuales | | | |
| Aplicación del resultado | | | |
| Aprobación de la gestión | | | |

## Citas y cifras a verificar
Lista de todos los [VERIFICAR] (artículos, importes umbral, modelo oficial vigente) con fuente
sugerida (BOE, Registro Mercantil Central).

## Siguiente paso concreto
Una línea: qué hacer ahora y quién.
```

---

## 5. Reglas de la revisión

- **Severidad honesta:** 🔴 solo para lo que de verdad impide el depósito o expone a un cierre de
  hoja registral. Inflar severidades destruye la señal — si todo es rojo, nada lo es.
- **Cada hallazgo con corrección propuesta.** Un defecto sin propuesta de redacción alternativa es
  medio hallazgo.
- **Cuadre numérico obligatorio.** La aplicación del resultado se comprueba sumando, no a ojo — si
  hace falta recalcular, usa la skill **xlsx** y adjunta el cuadro.
- **No inventes umbrales ni modelos oficiales.** Si no puedes confirmar el importe de auditoría
  obligatoria vigente o la versión actual del modelo de depósito, márcalo [VERIFICAR] (regla de
  oro nº 1 de `skills/legal/SKILL.md`).
- **Distingue socio único de pluripersonal desde la primera línea del informe** — confundir
  "decisión del socio único" con "junta general" en el propio informe es un error que resta
  credibilidad a toda la revisión.
- **La política de dividendo es del cliente.** Si detectas margen para repartir más o menos
  dividendo dentro de los límites legales, preséntalo como opción con pros/contras — no lo
  incorpores a la certificación por tu cuenta (🟡: espera OK).

---

## 6. Recursos de la skill

- `references/checklist-certificacion.md` — checklist exhaustiva por bloques (plazos, forma,
  formación del acuerdo, los tres acuerdos de fondo, documentos anexos al depósito, verificación
  final). Léela durante las fases 2–4.

## 7. Documentos relacionados

- `skills/legal/SKILL.md` — marco general legal (obligatorio; este skill lo presupone).
- `PRINCIPIOS_DE_TRABAJO.md` — principios generales de trabajo del repo.

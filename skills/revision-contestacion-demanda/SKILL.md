---
name: revision-contestacion-demanda
description: Revisión sistemática de un escrito de contestación a la demanda en el proceso civil español (LEC). Úsala siempre que el usuario pida revisar, auditar, mejorar o "echar un vistazo" a una contestación a la demanda, o mencione excepciones procesales, reconvención, allanamiento, admisión tácita de hechos, el art. 405 LEC o el plazo para contestar — aunque no use la palabra "revisión". Sirve también como checklist de redacción si la contestación se está escribiendo desde cero.
---

# Revisión de Contestación a la Demanda (proceso civil, LEC)

> Skill específica. **Antes de aplicarla, lee `skills/legal/SKILL.md`** (marco general legal):
> sus reglas de oro — citas verificables, plazos como ruin filter, revisión humana obligatoria —
> gobiernan también esta revisión. Este documento está referenciado desde el índice §7 de aquel.

**Versión:** v1.0 · **Fecha:** 09/07/2026 · **Responsable:** Alfredo Sánchez-Bella Solís

**Nota de vigencia:** los artículos citados corresponden a la Ley 1/2000, de Enjuiciamiento Civil.
Las reformas recientes (Ley 42/2015, RDL 6/2023) han retocado el juicio verbal y otros preceptos:
antes de apoyar un argumento en un artículo concreto, contrasta la redacción vigente en el BOE
consolidado y márcalo **[VERIFICAR]** si no puedes hacerlo.

---

## 1. Qué hace esta skill (y qué no)

**Hace:** revisar un borrador de contestación a la demanda en seis fases — contexto, forma,
plano procesal, plano de fondo, control adversarial e informe con severidad — y devolver un
informe accionable con hallazgos clasificados 🔴🟡🟢.

**No hace:** presentar escritos, decidir la estrategia procesal por el cliente ni sustituir la
revisión del abogado responsable. El plazo para contestar es improrrogable: si la revisión detecta
que el plazo está en riesgo, eso se comunica **primero**, antes de cualquier otro hallazgo.

---

## 2. Inputs necesarios

Pide lo que falte antes de empezar; sin los tres primeros la revisión sale coja:

1. **El borrador de contestación** a revisar.
2. **La demanda** (y sus documentos, o al menos su relación) — sin ella no se puede comprobar la
   congruencia ni el pronunciamiento hecho por hecho.
3. **Tipo de procedimiento:** ordinario o verbal — cambia plazo, estructura y momento de la prueba.
4. **Fecha de emplazamiento/notificación** — para computar el plazo (20 días hábiles en el
   ordinario, art. 404 LEC; 10 días hábiles en el verbal, art. 438 LEC; agosto inhábil; gracia
   hasta las 15:00 del día hábil siguiente, art. 135.5 LEC).
5. **Instrucciones del cliente**, si las hay: ¿allanamiento parcial? ¿reconvención? ¿hechos que no
   quiere reconocer? Sin instrucciones, señala las opciones sin decidirlas.

**Ingesta de documentos:** los escritos rara vez llegan en markdown. Usa la skill **docx** para
borradores en Word (`pandoc -t markdown` para leer), la skill **pdf** para demandas y documentos
del expediente (con OCR si vienen escaneados del juzgado) y la skill **file-reading** si el
archivo está subido y aún no leído. No hagas `cat` a un binario.

---

## 3. Proceso de revisión en seis fases

Trabaja las fases en orden — cada una alimenta la siguiente. La checklist detallada de las fases
2–4 está en `references/checklist-contestacion.md`: **léela al ejecutarlas**, no la reproduzcas de
memoria.

### Fase 0 — Plazo (ruin filter)
Computa el plazo con la fecha de emplazamiento. Si quedan ≤3 días hábiles o el cómputo es dudoso,
repórtalo de inmediato como 🔴 y sigue con la revisión. La preclusión del art. 136 LEC es
irreversible; todo lo demás de este documento es secundario frente a esto.

### Fase 1 — Mapa de la demanda
Antes de leer la contestación, extrae de la demanda: pretensiones del suplico, hechos numerados,
fundamentos invocados, documentos aportados y cuantía. Este mapa es la vara de medir de todo lo
demás: una contestación se revisa **contra la demanda**, no en abstracto.

### Fase 2 — Revisión formal
Estructura del art. 399 LEC por remisión del art. 405.1: encabezamiento, representación, hechos,
fundamentos, suplico, otrosíes, firmas. Checklist completa en `references/checklist-contestacion.md` §B.

### Fase 3 — Revisión procesal
Excepciones procesales (arts. 405.3 y 416 LEC), declinatoria (ojo: jurisdicción y competencia
**no** se plantean en la contestación — arts. 63–65 LEC, dentro de los 10 primeros días del
plazo), reconvención (arts. 406–409), compensación y nulidad (art. 408), allanamiento (arts. 21 y
395). Checklist en §C–§F de la referencia.

### Fase 4 — Revisión de fondo
El corazón: pronunciamiento sobre **cada** hecho de la demanda (el silencio o las respuestas
evasivas pueden valer como admisión tácita, art. 405.2 LEC), defensas materiales, carga de la
prueba (art. 217), documentos y su preclusión (arts. 265, 269–270), anuncio de periciales
(art. 337), coherencia entre cuerpo y suplico. Checklist en §D, §G–§H de la referencia.

### Fase 5 — Control adversarial
Relee el escrito dos veces con sombreros distintos:
- **Como abogado de la actora:** ¿qué hecho quedó sin negar? ¿qué documento no se impugnó? ¿qué
  excepción llega tarde o mal planteada?
- **Como juez en la audiencia previa (o en la vista del verbal):** ¿el suplico pide exactamente lo
  que debe (desestimación y costas)? ¿las excepciones están fundadas o son de relleno? ¿el escrito
  facilita fijar los hechos controvertidos?

Cada agujero encontrado aquí es un hallazgo del informe. Esta fase existe porque el redactor deja
de ver sus propios huecos: el valor está en el cambio de perspectiva, no en releer más veces.

### Fase 6 — Informe
Emite el informe con la estructura fija de §4. No mezcles severidades ni entierres un 🔴 en medio
de observaciones de estilo.

**Formato de entrega — dos capas:**
1. **Informe en markdown** (plantilla de §4) — siempre.
2. **Si el borrador llegó en .docx, ofrece además devolverlo anotado con la skill docx:** los
   hallazgos 🔴/🟡 como **comentarios anclados** al párrafo afectado (`scripts/comment.py` de la
   skill docx) y las correcciones de redacción propuestas como **control de cambios**
   (`<w:ins>`/`<w:del>`). Es el formato en que un abogado revisa de verdad: le permite aceptar o
   rechazar cambio a cambio en Word en lugar de cotejar dos documentos.

**Verificación de citas:** si hay acceso a red, contrasta las citas del escrito (y las que tú
propongas) contra BOE consolidado y CENDOJ antes de listarlas; lo no contrastado va a la sección
"Citas a verificar" del informe.

---

## 4. Estructura del informe

Usa SIEMPRE esta plantilla:

```markdown
# Informe de revisión — Contestación a la demanda [autos/referencia]

## Semáforo global
🔴/🟡/🟢 + una línea de veredicto (¿está en condiciones de presentarse?)

## Plazo
Cómputo realizado, fecha límite estimada y confianza del cómputo.

## Hallazgos 🔴 — impiden presentar el escrito tal cual
(preclusiones, hechos sin negar con riesgo de admisión tácita, excepción no planteada o
mal planteada, suplico defectuoso, documento esencial no aportado, plazo en riesgo)
Por hallazgo: qué, dónde (hecho/fundamento/párrafo), por qué es grave, corrección propuesta.

## Hallazgos 🟡 — debilitan el escrito
(argumentos flojos, jurisprudencia sin verificar o mal citada, defensas materiales no exploradas,
incoherencias menores cuerpo-suplico)

## Hallazgos 🟢 — estilo y forma
(claridad, orden, erratas, formato)

## Tabla de pronunciamiento sobre hechos (art. 405.2 LEC)
| Hecho demanda | Tratamiento en contestación | Riesgo |
|---|---|---|

## Citas a verificar
Lista de todos los [VERIFICAR] con fuente sugerida (BOE, CENDOJ).

## Siguiente paso concreto
Una línea: qué hacer ahora y quién.
```

---

## 5. Reglas de la revisión

- **Severidad honesta:** 🔴 solo para lo que de verdad impide presentar o causa un perjuicio
  procesal irreversible. Inflar severidades destruye la señal — si todo es rojo, nada lo es.
- **Cada hallazgo con corrección propuesta.** Un problema sin propuesta de redacción alternativa
  es medio hallazgo.
- **No inventes jurisprudencia** para reforzar la contestación (regla de oro nº 1 del marco
  general). Propón la línea argumental y marca la cita como [VERIFICAR] si no puedes confirmarla.
- **No argumentes de más.** Señala también lo que sobra: hechos confesados innecesariamente,
  argumentos subsidiarios que debilitan el principal, exceso que da pistas a la actora.
- **La estrategia es del abogado.** Si detectas una opción estratégica (reconvenir, allanarse
  parcialmente antes de contestar para evitar costas ex art. 395 LEC), preséntala como opción con
  pros/contras — no la incorpores al escrito por tu cuenta (🟡: espera OK).

---

## 6. Recursos de la skill

- `references/checklist-contestacion.md` — checklist exhaustiva por bloques (plazo, forma,
  excepciones, fondo, reconvención, documentos y prueba, cuantía y costas, estilo, verificación
  final). Léela durante las fases 2–4.

## 7. Documentos relacionados

- `skills/legal/SKILL.md` — marco general legal (obligatorio; este skill lo presupone).
- `PRINCIPIOS_DE_TRABAJO.md` — principios generales de trabajo del repo.

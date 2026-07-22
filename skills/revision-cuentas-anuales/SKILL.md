---
name: revision-cuentas-anuales
description: Revisión sistemática de las cuentas anuales de una sociedad española (balance, cuenta de pérdidas y ganancias, ECPN, EFE, memoria e informe de gestión). Úsala siempre que el usuario pida revisar, analizar o "echar un vistazo" a las cuentas anuales de una empresa, o mencione EBITDA, informe de auditoría, due diligence financiera, red flags contables, calidad del EBITDA, memoria de cuentas o depósito en el Registro Mercantil — aunque no use la palabra "revisión". Pensada para due diligence de M&A/search fund, pero sirve para cualquier análisis financiero de una sociedad a partir de sus cuentas depositadas.
---

# Revisión de Cuentas Anuales (sociedad española)

**Versión:** v1.1 · **Fecha:** 22/07/2026 · **Responsable:** Alfredo Sánchez-Bella Solís
> v1.1: añadida fase 8 (valoración, puente EV→equity value y capacidad de financiación de la
> adquisición) — el ángulo financiero de la operación más allá de si las cuentas son fiables.

**Nota de vigencia:** la normativa contable de referencia es el PGC (RD 1514/2007) y PGC-PYMES
(RD 1515/2007), el Código de Comercio y la Ley de Sociedades de Capital (RDLeg 1/2010). Antes de
apoyar un argumento en un artículo o norma concreta, contrasta la redacción vigente en el BOE
consolidado y márcalo **[VERIFICAR]** si no puedes hacerlo.

---

## 1. Qué hace esta skill (y qué no)

**Hace:** revisar las cuentas anuales de una sociedad en nueve fases — completitud formal, informe
de auditoría, balance, PyG, memoria, EFE, ratios, ajustes de normalización del EBITDA, y valoración
+ capacidad de financiación de la operación — y devolver un informe accionable con hallazgos
clasificados 🔴🟡🟢, pensado sobre todo para **due diligence financiera de M&A / search fund**
(¿es esta empresa lo que dice ser en sus números, y aguanta la estructura de compra que se plantea?).

**No hace:** sustituir una due diligence financiera completa con acceso a libros contables y a la
sociedad, ni una auditoría, ni asesoramiento fiscal o de inversión. El análisis parte de lo que las
cuentas depositadas muestran — y de lo que su ausencia u omisión revela.

---

## 2. Inputs necesarios

Pide lo que falte antes de empezar; sin los tres primeros el análisis sale corto:

1. **Las cuentas anuales completas** de al menos los 3 últimos ejercicios cerrados: balance, PyG,
   ECPN, EFE (si modelo normal), memoria e informe de gestión. Si el usuario solo aporta el balance
   y la PyG "resumidos", pide la memoria explícitamente — ahí está la mitad del análisis (§E de la
   referencia).
2. **El informe de auditoría**, si la sociedad audita (obligatoria u opcionalmente).
3. **Objetivo del análisis:** due diligence de compra, análisis de crédito/solvencia, valoración,
   o análisis financiero general — cambia qué hallazgos importan más (p. ej. en compra, los ajustes
   de normalización del EBITDA del §J son centrales; en análisis de crédito, la solvencia y el EFE).
4. **Sector y tamaño** — para contextualizar ratios (§I de la referencia) y saber qué modelo de
   cuentas corresponde (normal/abreviado/PYME).
5. Si no se aportan las cuentas y el usuario solo da el nombre/CIF de la sociedad: indica que
   pueden obtenerse depositadas en el Registro Mercantil (nota simple o vía portal del RM/BORME) y
   pregunta si el usuario tiene acceso o quiere que se gestione la solicitud.

**Ingesta de documentos:** las cuentas depositadas suelen llegar en PDF (a veces escaneado) o
XBRL/XML. Usa la skill **pdf** para extraer texto (con OCR si vienen escaneadas del Registro), la
skill **xlsx** para reconstruir tablas y calcular ratios de forma verificable, y la skill
**file-reading** si el archivo está subido y aún no leído. No hagas `cat` a un binario ni copies
cifras de memoria: cada número del informe debe trazarse a su documento fuente.

---

## 3. Proceso de revisión en nueve fases

Trabaja las fases en orden — cada una alimenta la siguiente. La checklist detallada está en
`references/checklist-cuentas-anuales.md`: **léela al ejecutar cada fase**, no la reproduzcas de
memoria.

### Fase 0 — Completitud y fiabilidad formal (ruin filter)
Comprueba antes que nada que el juego de cuentas está completo, en el modelo correcto, y
formulado/aprobado/depositado en plazo (arts. 253, 164 y 279 LSC). Cuentas sin depositar, con
retraso sistemático, o en modelo abreviado indebido para el tamaño de la sociedad, son un red flag
de gobernanza que condiciona la confianza en todo lo demás. Repórtalo primero. Checklist §A.

### Fase 1 — Informe de auditoría
Si la sociedad audita: tipo de opinión, salvedades, incertidumbre de empresa en funcionamiento
(going concern), cuestiones clave de auditoría, rotación de auditor. Una incertidumbre material
sobre continuidad es 🔴 inmediato en cualquier proceso de compra. Checklist §B.

### Fase 2 — Balance
Estructura y evolución, fondo de maniobra, deuda financiera neta, fondo de comercio y su
deterioro, existencias, clientes y su morosidad, deuda con socios, contingencias fuera de balance.
Checklist §C.

### Fase 3 — Cuenta de pérdidas y ganancias
Ingresos recurrentes vs. extraordinarios, márgenes y su evolución, gastos de personal,
operaciones con partes vinculadas que afectan al resultado, resultado financiero, tipo impositivo
efectivo. Checklist §D.

### Fase 4 — Memoria
La fase más importante y la que menos se lee por defecto: operaciones vinculadas, garantías
comprometidas, contingencias y litigios, cambios de criterio contable, hechos posteriores al
cierre, situación fiscal abierta. Léela **nota a nota**. Checklist §E.

### Fase 5 — EFE y ECPN
Conversión de EBITDA a caja operativa (la señal clásica de "beneficio de papel" está aquí), capex
de mantenimiento vs. crecimiento, movimientos de patrimonio neto y deuda con socios. Checklist §F–§G.

### Fase 6 — Ratios y comparación
Solvencia, endeudamiento, rentabilidad, ciclo de conversión de caja — en tendencia de al menos 3
ejercicios y, si hay benchmark, contra el sector. Calcula siempre en hoja de cálculo verificable
(skill **xlsx**), nunca a mano. Checklist §I.

### Fase 7 — Ajustes de normalización del EBITDA (si el objetivo es valorar/comprar)
Construye la tabla puente **EBITDA reportado → EBITDA normalizado**: remuneración de socios fuera
de mercado, partes vinculadas, gastos personales pasados por la empresa, partidas no recurrentes.
Cada ajuste con importe y justificación — nunca aplicado sin mostrar el cálculo. Las sinergias del
comprador **no** entran aquí. Checklist §J.

### Fase 8 — Valoración, puente a equity value y capacidad de financiación (si el objetivo es comprar)
El ángulo puramente financiero de la operación, más allá de si las cuentas son fiables:

- **Rango de valoración** por múltiplos comparables (EV/EBITDA normalizado, EV/Ventas de
  transacciones precedentes o comparables cotizados del sector) — nunca una cifra puntual, siempre
  rango con nivel de confianza declarado. DCF solo si hay proyecciones de gestión fiables, y
  marcadas como hipótesis de gestión, no como hecho.
- **Puente EV → equity value (precio de las acciones):** EV − deuda financiera neta *ajustada*
  (incluye partidas "deuda-like" que no siempre aparecen como deuda en el balance: leasing,
  factoring/confirming sin recurso, deuda con socios, dividendos acordados y no pagados,
  aplazamientos con Hacienda/Seguridad Social) ± ajuste de **working capital** frente al circulante
  normalizado (peg) + activos no operativos a excluir (caja excedente, inmuebles no afectos).
- **Capacidad de financiación de la adquisición:** DSCR proyectado con la estructura de deuda de
  compra propuesta, apalancamiento total resultante/EBITDA normalizado, deuda/EV, y sensibilidad
  frente a una caída de EBITDA del 10-20%. Contrasta contra los umbrales de inversión propios del
  usuario si los tiene definidos — **no apliques umbrales universales sin confirmarlos con él**
  (p. ej. DSCR≥1,5x, deuda senior ≤3x EBITDA o deuda total ≤70% EV son referencias habituales en
  screening de search funds, no reglas fijas de esta skill).
- **Covenants de la deuda existente de la target**, si ya tiene financiación bancaria: ratios
  pactados y cláusulas de cambio de control que la propia adquisición pueda activar.

Checklist §L–§M.

### Fase 9 — Informe
Emite el informe con la estructura fija de §4. No mezcles severidades ni entierres un 🔴 en medio
de observaciones de estilo.

**Formato de entrega:**
1. **Informe en markdown** (plantilla de §4) — siempre.
2. **Modelo en hoja de cálculo** (skill xlsx) si el objetivo es valoración/compra: tabla puente de
   EBITDA normalizado, puente EV → equity value y capacidad de financiación (DSCR, apalancamiento,
   sensibilidad) — con fórmulas trazables a cada cifra fuente, no valores fijos, para que el
   usuario pueda cambiar el múltiplo o la estructura de deuda y ver el efecto en cascada.
3. Si el análisis alimenta un dictamen o memorándum más amplio, ofrece integrarlo con la skill
   **docx**.

---

## 4. Estructura del informe

Usa SIEMPRE esta plantilla:

```markdown
# Informe de revisión — Cuentas anuales de [sociedad], ejercicios [años]

## Semáforo global
🔴/🟡/🟢 + una línea de veredicto (¿las cifras son fiables? ¿hay motivo para no seguir adelante?)

## Completitud y fiabilidad formal
Modelo aplicado, plazos de formulación/aprobación/depósito, informe de auditoría (si existe) y su
opinión.

## Hallazgos 🔴 — comprometen la fiabilidad de las cifras o la viabilidad del negocio
(incertidumbre de empresa en funcionamiento, cuentas sin depositar/auditar debiendo estarlo,
contingencia material no provisionada, EBITDA que no convierte en caja de forma sistemática,
operación vinculada relevante no explicada)
Por hallazgo: qué, dónde (partida/nota de la memoria), por qué es grave, qué falta verificar.

## Hallazgos 🟡 — debilitan la lectura de las cifras
(cambios de criterio contable, ratios en tendencia de deterioro, concentración de clientes,
partidas con partes vinculadas a precio dudoso pero no material)

## Hallazgos 🟢 — observaciones menores
(formato, comparabilidad, detalle insuficiente en alguna nota)

## Tabla de ratios (comparativo de ejercicios)
| Ratio | Año N-2 | Año N-1 | Año N | Lectura |
|---|---|---|---|---|

## Tabla puente — EBITDA reportado → EBITDA normalizado
(solo si el objetivo es valoración/compra)
| Concepto | Importe | Justificación |
|---|---|---|
| EBITDA reportado | | |
| ± ajuste 1 | | |
| ± ajuste 2 | | |
| **EBITDA normalizado** | | |

## Rango de valoración y puente EV → equity value
(solo si el objetivo es valoración/compra)
Método(s) usado(s) y rango con nivel de confianza (alta/media/baja).

| Concepto | Importe |
|---|---|
| Enterprise Value (rango) | |
| − Deuda financiera neta ajustada (deuda-like incluida) | |
| ± Ajuste de working capital vs. peg | |
| + Activos no operativos excluidos | |
| **Equity value (precio de las acciones, rango)** | |

## Capacidad de financiación de la adquisición
(solo si el objetivo es comprar)
| Métrica | Valor proyectado | Umbral del inversor (si definido) | Lectura |
|---|---|---|---|
| DSCR | | | |
| Deuda total / EBITDA normalizado | | | |
| Deuda / EV | | | |
| DSCR en escenario de caída de EBITDA (10-20%) | | | |

## Citas a verificar
Lista de todos los [VERIFICAR] con fuente sugerida (BOE consolidado, Registro Mercantil).

## Siguiente paso concreto
Una línea: qué hacer ahora y quién (p. ej. "pedir el detalle de operaciones vinculadas al
vendedor antes de continuar con la oferta").
```

---

## 5. Reglas de la revisión

- **Severidad honesta:** 🔴 solo para lo que de verdad compromete la fiabilidad de las cifras o la
  viabilidad del negocio. Inflar severidades destruye la señal — si todo es rojo, nada lo es.
- **Cada cifra trazable a su documento fuente.** No copies números de memoria ni redondees sin
  decirlo; si una cifra no cuadra entre documentos, es un hallazgo, no un detalle a ignorar.
- **Distingue hecho / interpretación / ajuste propuesto.** Lo que dicen las cuentas, lo que tú
  concluyes, y la hipótesis de normalización son tres planos — no los mezcles en el mismo párrafo
  sin marcarlo (regla heredada de `skills/legal/SKILL.md` §2.4, aplicable aquí igual).
- **No inventes cifras ni normativa** para reforzar una conclusión. Si no puedes verificar un dato
  o un artículo, márcalo **[VERIFICAR]**.
- **Los ajustes de EBITDA se muestran, no se imponen.** Cada ajuste de normalización lleva importe
  y justificación explícitos en la tabla puente; una cifra normalizada sin su cálculo visible no
  sirve para decidir nada.
- **Ningún umbral de financiación es universal.** DSCR, apalancamiento máximo o deuda/EV aceptables
  varían por inversor, sector y momento de mercado. Usa los umbrales que el usuario haya definido;
  si no los ha definido, presenta la métrica calculada y pregunta cuál es su umbral antes de emitir
  un veredicto de "financiable" o "no financiable".
- **Rango, nunca cifra puntual, en valoración.** Todo output de valoración (EV, equity value) se
  entrega como rango con nivel de confianza — la falsa precisión de una cifra única es más
  peligrosa que no valorar.
- **La decisión de inversión es del usuario.** Si detectas una opción estratégica (renegociar
  precio, condicionar la operación a due diligence adicional, exigir garantías), preséntala como
  opción con pros/contras — no la des por tomada.
- **Revisión humana obligatoria.** Este análisis es un borrador cualificado de apoyo a la decisión,
  no sustituye la due diligence financiera completa ni el criterio del asesor fiscal/financiero
  antes de comprometer una operación.

---

## 6. Recursos de la skill

- `references/checklist-cuentas-anuales.md` — checklist exhaustiva por bloques (completitud,
  auditoría, balance, PyG, memoria, EFE, ECPN, informe de gestión, ratios, ajustes de EBITDA,
  valoración/equity bridge, capacidad de financiación, verificación final). Léela durante las
  fases 1–8.

## 7. Integración con skills existentes del entorno

No reinventes lo que otra skill ya resuelve. Combina esta skill con:

| Skill | Cuándo usarla aquí |
|-------|-------------------|
| **pdf** | Extraer texto de cuentas depositadas en PDF (con OCR si vienen escaneadas del Registro Mercantil). |
| **xlsx** | Recalcular ratios, la tabla puente de EBITDA normalizado, el puente EV→equity value y el modelo de capacidad de financiación (DSCR, apalancamiento, sensibilidad) con fórmulas trazables, no valores fijos. |
| **file-reading** | Enrutar la lectura correcta de cualquier archivo subido. |
| **skills/legal** | Si el análisis financiero alimenta una due diligence de M&A más amplia con componente legal (contratos, contingencias legales, estructura societaria), combina con el marco general legal. |
| **deep-research / búsqueda web** | Verificar normativa contable/societaria contra el BOE consolidado, y benchmarks sectoriales de ratios cuando haya red. |

## 8. Documentos relacionados

- `skills/legal/SKILL.md` — marco general legal, relevante cuando la revisión de cuentas forma
  parte de una due diligence de M&A con componente jurídico.
- `PRINCIPIOS_DE_TRABAJO.md` — principios generales de trabajo del repo (honestidad radical,
  ruin filter, números con base y confianza declarada).

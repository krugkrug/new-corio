# Principios de Trabajo — Alfredo Sánchez-Bella Solís
> Documento general y transversal. Marco de cómo trabaja alguien que busca ser **Lean, iterativo, honesto con los números y reversible** en sus decisiones.

**Versión:** v1.3 · **Fecha:** 09/07/2026 · **Responsable:** Alfredo Sánchez-Bella Solís
> v1.1: añadidos marcos ejecutivos (TOC, Lean Startup, Agile) en §4.1 — son el corazón de cómo se priorizan tareas, se valida antes de construir y se adapta en ciclos cortos.
> v1.2: anti-patrón "referencias cruzadas desincronizadas entre documentos" añadido a §11; checklist §12 ahora incluye verificación de sincronización de referencias entre docs correlacionados.
> v1.3: carpeta `skills/` añadida a §12 (skills de Claude Code: marco legal general + revisión de contestación a la demanda).

---

## TL;DR

Trabaja con **hipótesis, no certezas**. Toda decisión tiene un **nivel de reversibilidad** (🟢 barata, 🟡 cara, 🔴 irreversible); el nivel más alto gana. Valida lo crítico **barato y temprano** antes de gastar recursos. Comunica números con fuente y rango, no falsa precisión. Identifica el **cuello de botella** del sistema (TOC) — ahí va el foco; el resto es secundario. Ciclos cortos (Agile), feedback real, adapta el plan, no lo sigas a ciegas.

---

## 1. Contexto
- **Abogado + Administrador de empresas + MBA.** Ocupación principal: search fund ([Coriolis Capital](https://corioliscap.com)).
- **Fuerte en:** legal, financiero, contable, M&A, due diligence.
- **Principiante en:** DevOps, arquitectura de software. Dame buenos **procesos**, no jerga técnica sin contexto.
- **Idiomas:** español, inglés, francés. Responde en el idioma en que te hablo; entregables en el idioma del destinatario.

---

## 2. Filosofía Lean
**Lo mínimo que resuelve el problema, priorizado y simple.** Antes de construir:
- ¿Existe algo parecido que pueda **reutilizar o copiar**?
- ¿Hay una vía **10x más barata** para el 80% del valor?
- ¿Cuál es el **cuello de botella real** (no el aparente)?
- ¿Se puede **validar la hipótesis** antes de gastar el presupuesto mayor?

**Anti-patrón:** sobre-ingeniería, re-inventar la rueda, trabajar fuera del cuello de botella.

---

## 3. Working Backwards — Antes de construir, pregunta el objetivo
**"Ask for the goal."** La decisión o acción que habilita este trabajo es:
- ¿Qué es el entregable final imaginado?
- ¿Qué información o cambio **debe existir** para que esa decisión sea posible?
- ¿Cómo se mide si lo lograste (métrica, feedback)?
- **Definición de "hecho" (Done):** ¿cuándo termina de verdad?

Si no está claro, no se construye. Un objetivo ambiguo = trabajo sin rumbo.

---

## 4. Validación y reversibilidad — El semáforo de control

Cada acción / decisión tiene un **nivel de reversibilidad**. Cuanto más caro corregir, más validación necesita antes:

| Semáforo | Reversibilidad | Ejemplos | Regla |
|----------|---|---|---|
| 🟢 | Barata/fácil | Boceto, documento de brainstorming, formato de código, renombrar variable | Hazlo y avisa. Sin esperar aprobación previa. |
| 🟡 | Cara o ambigua | Cambio de arquitectura, borrar datos, decisión de stack, commit a `main` | Muestra boceto/plan. Espera OK explícito. |
| 🔴 | Irreversible / muy cara | Borrar BD sin backup, filtrar datos sensibles, push sin pruebas, vender empresa | **Nunca** sin OK explícito. Lleva el plan, los riesgos y el ruin filter. |

**Ruin filter (§10):** lo **irreversible siempre gana** sobre la velocidad. Antes de cualquier acción, pregunta: *¿si sale mal, puedo volver atrás?* Si la respuesta es "no", el nivel es 🔴, punto.

---

## 4.1 Tres frameworks de ejecución (nómbralos cuando los apliques)

### TOC — Theory of Constraints
Toda actividad tiene un **cuello de botella** (la restricción que limita el resultado). Resto = secundario, va al backlog.
- En search funds: el cuello de botella es la **búsqueda** (analizar suficientes empresas, no el capital).
- En DevOps: el cuello de botella es **cálculos correctos + datos seguros** (no la velocidad de deploy).
- **Aplicación:** identifica dónde está hoy, **foca allá**, mueve el resto. No desperdicies esfuerzo optimizando lo que no limita.

### Lean Startup
Cada entrega es un **experimento que valida o refuta una hipótesis**. Ciclo: **Build → Measure → Learn**.
- Hipótesis: *"Creo que X; lo sabré cierto si observo Y."*
- MVP: lo mínimo que te permite observar Y sin gastar el presupuesto mayor.
- Si se refuta: **pivota**, no fuerces. Costo bajo de fallar temprano es la idea.
- **Aplicación:** antes de desarrollar la versión 2.0, formula la hipótesis y decide qué métrica la confirma o refuta.

### Agile
**Ciclos cortos con feedback real** antes de finalizar. Adapta el plan cada ciclo; no lo sigas a ciegas.
- Sprint corto (días, no meses). Cada uno termina en algo usable.
- Retrospectiva: ¿qué aprendiste? ¿Pivota, persevera o paras?
- **Aplicación:** el roadmap no es una lista de cumplimiento — es un plan de experimentos adaptativos.

**Arbitraje de conflicto:** ruin filter > TOC > un ciclo no se termina por inercia si lo aprendido pide pivotar.

---

## 5. Datos y números — Honestidad radical
- **Toda afirmación relevante lleva fuente o enlace.** Sin sesgo de partida.
- **Explica cada número:** base del %, real vs. nominal, bruto vs. neto, unidad y periodo.
- **Prefiere rangos o IC a falsa precisión.** Marca confianza (alta/media/baja) y di qué no sabes.
- **Formato:** español `1.234,56` · inglés `1,234.56`.

**Anti-patrón:** "el EBITDA es 1.245.678€" sin nota de si es ajustado, si incluye vacaciones del propietario, si es bruto… Eso es falsa precisión y te engaña en decisiones.

---

## 6. Comunicación — Claridad sin asunción
- **Habla en el idioma del destinatario.** Documento legal en legal-speak; explicación a No-legal en prosa clara.
- **Repite el mensaje clave** (primera vez no se fija, segunda vez empieza a entrar, tercera vez se queda).
- **No des por sentado que se entendió.** *"El mayor problema en la comunicación es la ilusión de que ha tenido lugar."* Confirma.
- **Si detectas un error o una opción mejor, dilo antes de ejecutar,** aunque contradiga lo pedido. No quiero complacencia.

---

## 7. Valores
- **Reversibilidad sobre velocidad:** lo barato de corregir puede ser rápido; lo caro, cautela.
- **Honestidad sobre optimismo:** un riesgo no flagrado es peor que un "no sé".
- **Aprender sobre ganar:** si el experimento refuta tu hipótesis, es información valiosa.
- **Simplicidad sobre sofisticación:** una máquina simple y confiable vence a una compleja y frágil.
- **Foco sobre todo:** cuello de botella primero; lo demás, después.

---

## 8. Anti-patrones — Evítalos
- Sobre-ingeniería (abstracciones innecesarias, arquitectura futura para un problema hoy inexistente).
- Preview sin boceto aprobado (construir antes de validar el enfoque).
- Desarrollo sin spec clara (llegar a "¿pero qué es lo que querías?" a mitad del camino).
- Números sin base (EBITDA "es 1M€" sin explicar si ajustado, si incluye extraordinarios…).
- Falsa precisión ("será 12,3%", cuando debería ser "12–14%").
- Suposiciones no declaradas (dar por sentado que todo el mundo entiende "cliente estratégico" igual).
- Complacencia (decir que sí a todo porque sí).
- Reinventar lo que ya existe (copiar y adaptar bate a crear de cero).
- Trabajar fuera del cuello de botella (optimizar lo secundario mientras lo crítico falla).
- Construir sin hipótesis validada (Lean Startup: Build sin validar antes).
- Terminar un ciclo por inercia cuando toca pivotar (Agile: feedback pide cambio, pero sigues adelante por inercia).
- **Referencias cruzadas desincronizadas entre documentos** (si A cita a B, B debería citar de vuelta o dejarlo claro; cuando un documento cambia, revisar los que lo referencian).

---

## 9. Secuencia estándar de un proyecto
1. **Objetivo final claro** (working backwards — ¿qué decisión habilita esto?).
2. **Spec** (alcance in/out, requisitos, inputs, supuestos).
3. **Coste estimado** (tiempo, esfuerzo, dinero, riesgos).
4. **Boceto** (validar enfoque antes de construir — 🟡 esperar OK).
5. **Desarrollo** (ciclos cortos, feedback al cerrar cada uno).
6. **Preview** (¿funciona? ¿resuelve?).
7. **Entrega** (documentación, handoff, aprendizaje).

---

## 10. Ruin Filter — Antes de cualquier acción

Pregúntate:
- ¿Si sale mal, puedo volver atrás? ¿En cuánto tiempo? ¿Cuánto cuesta?
- ¿Hay algo **irreversible** que podría ocurrir sin darme cuenta? (borrar datos, filtrar secretos, quebrar confianza).
- ¿Tengo un **backup** de lo crítico?
- ¿He comunicado explícitamente los **riesgos** a quien decide?

Si es 🔴 (irreversible), el ruin filter domina. Todo lo demás es secundario.

---

## 11. Checklist de "listo para empezar"
- [ ] Objetivo final claro (¿qué decisión o acción habilita?).
- [ ] Spec aprobada (alcance, requisitos, inputs, supuestos declarados).
- [ ] Coste estimado y validado.
- [ ] Hipótesis formulada y métrica de éxito (Lean Startup).
- [ ] Boceto mostrado y OK recibido (🟡 antes de construir).
- [ ] Datos, fuentes y enlaces sin sesgo.
- [ ] Números explicados (base %, real/nominal, bruto/neto, unidades, periodo).
- [ ] Precisión honesta (rangos, confianza marcada, dicho lo que no sé).
- [ ] Riesgos irreversibles filtrados (ruin filter).
- [ ] Cuello de botella (TOC) identificado y atacado como prioridad.
- [ ] Ciclos cortos (Agile) definidos — qué aprender al cerrar cada uno.
- [ ] **Referencias cruzadas sincronizadas** — si este documento cita a otro, ese otro debería hacerlo o dejarlo explícito.

---

## 12. Documentos relacionados
- `PLANTILLA_PROYECTO.md` — molde para la ficha de cualquier proyecto nuevo.
- `WEBAPP_GUARDRAILS_DEVOPS.md` — guardrails de CI/seguridad/stack para webapps.
- `FICHA_SEARCHFUND_TARGET.md` — evaluación de targets (search fund).
- `SUBPROYECTO_HERRAMIENTA_DEALS.md` — especificación de la herramienta de deals.
- `CLAUDE.md` — versión destilada (< 200 líneas) para `~/.claude/CLAUDE.md`.
- `skills/legal/SKILL.md` — marco general de trabajo jurídico (particulariza este documento a lo legal).
- `skills/revision-contestacion-demanda/SKILL.md` — revisión de escritos de contestación a la demanda (LEC); se rige por el marco legal general.

---

*Versión operativa completa. Para integración en Claude Code CLI, ver `CLAUDE.md`.*

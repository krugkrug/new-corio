# Guardrails y DevOps para construir webapps — Guía general

> Documento **general y reutilizable** para cualquier webapp de Coriolis (empezando por la herramienta de deals de `SUBPROYECTO_HERRAMIENTA_DEALS.md`).
> Objetivo: **procesos que aseguren calidad de código y seguridad**, adaptados a alguien que **no es DevOps** pero está comprometido con la mejora continua.
> Se rige por `PRINCIPIOS_DE_TRABAJO.md` (Lean, empezar por lo básico, reusar y simplificar, reducir fricción).

**Última actualización:** 2026-07-22 10:38 — sustituye "Versión: vX" por el indicador único obligatorio de fecha+hora+descripción (§1.2) · **Responsable:** Alfredo Sánchez-Bella Solís
> Histórico: v1.1 actualizó §8 (stack real observado en GitHub); v1.2 y v1.3 añadieron §1.1 (regla de cuándo commitear).

---

## TL;DR

No necesitas ser experto en DevOps. Necesitas **unos pocos guardrails automáticos** que hagan casi imposible romper cosas o filtrar datos sensibles. La regla: **que la máquina revise, no tu memoria.** Empieza con lo mínimo (control de versiones + revisión + tests básicos + gestión de secretos) y añade capas solo cuando duelan. Todo lo de aquí está priorizado 🟢 imprescindible / 🟡 recomendable / 🔵 más adelante.

---

## 0. Mentalidad: guardrails, no burocracia

> *"No sé de DevOps, pero ayúdame a tener buenos procesos."*

Un **guardrail** es una barrera automática que te protege sin que tengas que acordarte. Frente a un *proceso manual* (que se olvida), el guardrail:
- **Falla rápido y barato** (en tu ordenador o en el PR, no en producción).
- **No depende de disciplina** — está en la tubería.
- Aplica el **ruin filter**: bloquea lo irreversible (borrar datos, filtrar secretos) aunque ralentice un poco.

Modelo mental de las capas (de más barato a más caro corregir):
`Editor → commit local → Pull Request → CI → staging → producción`
Cuanto antes atrapes un fallo, más barato. **Mueve los controles a la izquierda.**

---

## 0.1 Frameworks de ejecución aplicados a DevOps

> Los mismos tres frameworks de `PRINCIPIOS_DE_TRABAJO.md` §4.1, aterrizados en el desarrollo:

- **Agile = la cadencia.** No se despliega "cuando esté todo"; se entrega en **ciclos cortos** (sprints de días, no meses), cada uno con algo usable y feedback. El roadmap de §9 está pensado como sprints, no como un plan monolítico. CI + PR son lo que hace **seguro** iterar rápido: puedes cambiar a menudo sin romper, porque la máquina revisa.
- **TOC = qué guardrail primero.** No se activan los 8 guardrails a la vez. Se ataca el que hoy más te expone: para una app financiera con datos de deals, el cuello de botella de riesgo es **(1) cálculo erróneo y (2) fuga de datos** — por eso tests de cálculo y escaneo de secretos van antes que CodeQL o E2E.
- **Lean Startup = cada release valida algo.** Cada versión desplegada es un **experimento**: ¿la usas?, ¿te ahorra tiempo?, ¿confías en los números? El feedback de cada sprint confirma o refuta la hipótesis del MVP (ver subproyecto §2) y decide si perseverar o pivotar. **Bajo el ruin filter:** iterar rápido sí, pero nunca a costa de lo irreversible (datos filtrados, backup sin probar).

---

## 1. Control de versiones (🟢 imprescindible)

- **Git + un repositorio** (GitHub). Todo el código, nada en el escritorio.
- **Rama `main` protegida:** nadie hace push directo; todo entra por Pull Request (PR).
- **Ramas cortas por cambio** (`feat/pipeline-tabla`, `fix/div0`), vida < pocos días.
- **Commits pequeños y descriptivos** (formato sugerido: `tipo: qué` — `feat: filtro por sector`).
- **`.gitignore`** desde el minuto 1: nunca subir `node_modules`, `.env`, credenciales, datos reales de deals.

**Por qué:** historial + poder volver atrás = tu red de seguridad. Es el equivalente del "cada operación a una carpeta" que ya haces, pero versionado.

### 1.1 Cuándo empezar a commitear (regla de Alfredo)

> **No se hace commit/push de una funcionalidad hasta tener el OK explícito al boceto/wireframe correspondiente.** Es la aplicación literal de "bocetos antes de previews" (`PRINCIPIOS_DE_TRABAJO.md` §3) al control de versiones: el repo y el `main` protegido pueden crearse desde ya (Semana 0, es infraestructura, no funcionalidad), pero el código de una pantalla/feature concreta no empieza a escribirse — y por tanto no hay nada que commitear de ella — hasta que el boceto de esa pantalla esté aprobado. Evita construir (y dejar rastro en el historial de) algo que luego se descarta por no haber validado el enfoque antes.

### 1.2 Indicador de versión obligatorio (regla de Alfredo)

> **Todo documento `.md` con cabecera de control** (este documento, `PLANTILLA_PROYECTO.md`, fichas de proyecto…) **y todo header visible de cualquier webapp** llevan, siempre, una línea con este formato exacto:

```
**Última actualización:** YYYY-MM-DD HH:MM — <descripción breve del cambio, en minúsculas>
```

Ejemplo real: `**Última actualización:** 2026-07-22 10:18 — corrige autorreferencia del liquidador y añade venta/valoración de acciones`

- **Fecha y hora**: siempre hora de Madrid, formato ISO (`YYYY-MM-DD HH:MM`, sin segundos). En documentos `.md` se sella sola vía `script/stamp-doc-header.cjs` (pre-commit/pre-push — ver `plantillas/SETUP-completo.md` / `SETUP-simplificado.md`). En una webapp, el proceso de build/deploy la fija (timestamp del build o del último commit) — nunca se escribe a mano.
- **Descripción**: una frase corta, en minúsculas y sin punto final, estilo *changelog* (qué cambió, no un resumen del documento). La escribe quien hace el cambio; el hook nunca la toca.
- **Sustituye** cualquier campo previo de `**Versión:** vX` — un único dato (fecha+hora+qué cambió) en vez de versionar semánticamente.
- **Obligatorio** en los 8 repos del ecosistema (`meta`, `alfbank`, `coriodash`, `prado`, `ratioc`, `gt`, `news`, `alfplan`).

---

## 2. Revisión de cambios — Pull Requests (🟢)

- **Todo cambio pasa por PR**, aunque trabajes solo: te obliga a releer con ojos frescos y deja registro.
- **Checklist de PR** (plantilla, reusar en cada uno):
  - [ ] ¿Qué problema resuelve y cómo se prueba?
  - [ ] ¿Toca datos sensibles o borra algo? (si sí → doble revisión)
  - [ ] ¿Pasa CI en verde?
  - [ ] ¿Actualiza docs si cambia comportamiento?
- **Merge solo con CI en verde.** Regla dura.
- 🟡 Si entra un colaborador: exigir 1 aprobación antes de merge (branch protection).

---

## 3. Integración continua (CI) — la tubería automática (🟢)

CI = un robot (GitHub Actions) que en **cada PR** ejecuta comprobaciones. Guardrails mínimos, en orden de coste:

| Guardrail | Qué hace | Prioridad |
|-----------|----------|-----------|
| **Formateo** (Prettier) | Estilo consistente, cero debates | 🟢 |
| **Linter** (ESLint) | Caza errores comunes y código sospechoso | 🟢 |
| **Type-check** (TypeScript) | Evita clases enteras de bugs (el `#DIV/0!` del código) | 🟢 |
| **Tests** | Verifican que la lógica clave no se rompe | 🟢 (empezar por lo crítico) |
| **Build** | Confirma que la app compila/despliega | 🟢 |
| **Escaneo de secretos** (gitleaks) | Bloquea subir claves/tokens por error | 🟢 |
| **Escaneo de dependencias** (`npm audit`, Dependabot) | Avisa de librerías con vulnerabilidades | 🟡 |
| **Escaneo de código** (CodeQL) | Detecta patrones inseguros | 🔵 |

- 🟡 **Pre-commit hooks** (Husky + lint-staged): corren formateo/lint **antes** de commitear → atrapas en local, no esperas al CI.

**Regla:** si un guardrail falla mucho por ruido, se ajusta — no se desactiva.

---

## 4. Tests: lo justo y lo crítico (🟢 el núcleo)

No hace falta cobertura del 100%. Prioriza **lo que, si se rompe, te hace tomar una mala decisión de deal**:

1. **Tests de cálculo financiero** (máxima prioridad): %EBITDA, CAGR, ROIC, DSCR, múltiplos, apalancamiento máx., manejo de datos faltantes ("s/d" nunca `#DIV/0!`). *Un número mal calculado es peor que un botón feo.*
2. **Tests de reglas de negocio:** umbrales de descarte, restricciones de transacción (DSCR ≥1,5; SN ≤3× EBITDA; deuda ≤70% EV).
3. 🟡 **Tests de flujo** (E2E) del camino crítico: crear target → capturar finanzas → ver quick review.

**Regla de oro heredada del subproyecto:** *la app calcula, el usuario no teclea fórmulas* → por eso esos cálculos **deben** tener test.

---

## 5. Seguridad — proteger datos de deals (🟢 crítico)

Los datos de targets/deals son **confidenciales** (cuentas, NDAs, valoraciones). Guardrails:

### Secretos y credenciales
- **Nunca** en el código. Variables de entorno (`.env` local, *secrets* del proveedor en producción).
- **Escaneo de secretos en CI** (gitleaks) para bloquear filtraciones accidentales.
- Rotación si algo se expone; `.env` siempre en `.gitignore`.

### Acceso y datos
- **Autenticación** desde el MVP (nada abierto en internet).
- **Autorización por rol** cuando entren colaboradores/asesores (tú = admin; analista = editar; asesor = solo lectura de su target).
- **Cifrado en tránsito** (HTTPS siempre) y en reposo (BD cifrada del proveedor).
- **Backups automáticos** de la base de datos + prueba de restauración (un backup sin restaurar no es un backup).
- **Datos de prueba anonimizados** en desarrollo/staging — nunca deals reales fuera de producción.
- 🟡 **Registro de auditoría** (quién cambió qué y cuándo) — ya previsto como entidad `audit` en el subproyecto.

### Dependencias
- **Dependabot** activo: PRs automáticos para parches de seguridad.
- Revisar `npm audit` en CI; no ignorar vulnerabilidades altas/críticas.

### Cumplimiento (contexto España/UE)
- **RGPD:** minimizar datos personales (propietarios, contactos), base legal clara, y poder borrar a petición. Consultar con tu criterio legal (es tu terreno) antes de guardar datos de personas.

---

## 6. Entornos y despliegue (🟢 básico, 🟡 lo demás)

- **Local** (tu máquina) → **Staging** (copia de pruebas) → **Producción** (lo real).
- 🟢 **Despliegue reproducible:** un comando/pipeline, no pasos manuales que se olvidan.
- 🟡 **Deploy automático** al hacer merge a `main` (continuous deployment) una vez CI está sólido.
- 🟢 **Variables por entorno** (dev/staging/prod separadas; nunca la BD de producción en local).
- 🟡 **Rollback fácil:** poder volver a la versión anterior en 1 clic/comando (ruin filter aplicado al deploy).
- 🔵 **Monitorización** (errores + uptime, p. ej. Sentry) cuando la app tenga uso real.

---

## 7. Calidad de código — convenciones (🟢)

- **Un lenguaje tipado** (TypeScript) para el `#DIV/0!` del software.
- **Estilo automático** (Prettier + ESLint) — cero discusiones de formato.
- **Nombres claros y en un idioma consistente** (recomiendo inglés para el código, español para la UI, según `PRINCIPIOS_DE_TRABAJO.md` §idiomas).
- **Funciones pequeñas, una responsabilidad.** Reusar y simplificar antes que abstraer de más.
- **Comentar el *porqué*, no el *qué*** (el rationale, como en `Definiciones y rationale`).
- **Documentar decisiones** en un `README` + un breve `DECISIONS.md` (por qué este stack, esta BD…).

---

## 8. Stack (basado en lo que YA usas — 🟢 recomendado)

> No partimos de cero. Revisé tus repos y **ya tienes un patrón consistente** en tus dos apps más trabajadas (`alfbank` = conciliación bancaria, `prado`), con idéntico stack:

**Tu stack actual (observado en GitHub, repos privados `krugkrug/alfbank` y `krugkrug/prado`):**

| Capa | Lo que usas hoy |
|------|-----------------|
| Lenguaje | **TypeScript** |
| Frontend | **React 18 + Vite**, **Tailwind CSS**, enrutado con **wouter**, datos con **@tanstack/react-query** |
| Backend | **Express 5** |
| Base de datos | **SQLite** (better-sqlite3) con ORM **Drizzle** (`drizzle-kit`, `db:push`) |
| Validación | **Zod** |
| Hosting/CI | **GitHub** (privado) + **Vercel** |
| Metodología | Agile por sprints, con `REQUERIMIENTOS_MVP.md` (mockup → validación → build incremental) — ya alineado con tus principios |

**Recomendación: reusa tu propio patrón** (Vite+React+Express+TS+Tailwind+Zod). Es lo que dominas y lo que ya tienes desplegando en Vercel — reusar y simplificar, como pides en `PRINCIPIOS_DE_TRABAJO.md`.

**Único cambio para este subproyecto:** la **base de datos**. Decidiste (decisión 5 en SUBPROYECTO_HERRAMIENTA_DEALS §8) que la BD sea **tu Google Sheets**, no SQLite. Implicación:
- Sustituir la capa Drizzle/SQLite por la **API de Google Sheets** (`googleapis`) como almacén.
- Añadir **autenticación con Google** (service account u OAuth) para acceso a la hoja.
- Mantener **Zod** para validar antes de escribir (Sheets no da tipos).
- Tests de cálculo con **Vitest** (encaja con Vite).

> ✅ **Validado (02/07/2026):** reusas tu patrón Vite+React+Express+TS+Tailwind+Zod con **Google Sheets como BD** (vía `googleapis`). Es lo más barato y lo que ya sabes operar; se descarta Next.js por no aportar aquí y obligar a otro patrón.

---

## 9. Roadmap de adopción (Lean + Agile — no todo a la vez)

> Cada fila es, en la práctica, **un sprint corto** (Agile): al cerrarlo tienes algo usable y decides el siguiente. El orden aplica **TOC** — primero el guardrail que más te expone. No se salta de fila hasta que la anterior está en verde.

| Fase (sprint) | Qué activar | Por qué primero (cuello de botella) |
|------|-------------|-----------------|
| **Semana 0** 🟢 | Git + repo + `.gitignore` + `main` protegida + PR checklist | Red de seguridad básica |
| **Semana 0-1** 🟢 | CI: formateo + lint + type-check + build + escaneo de secretos | Guardrails baratos, gran retorno |
| **Semana 1-2** 🟢 | Tests de cálculo financiero + auth + `.env`/secrets + backups | Protege números y datos sensibles |
| **Semana 2+** 🟡 | Pre-commit hooks, Dependabot, staging, deploy auto, auditoría | Reduce fricción y sube seguridad |
| **Cuando duela** 🔵 | CodeQL, monitorización, roles finos, E2E completos | Solo si el uso lo justifica |

---

## 10. Anti-patrones a evitar

- **Empezar por lo sofisticado** (Kubernetes, microservicios, IA) sin MVP validado → contra Lean.
- **Guardrails que se apagan** cuando molestan → se ajustan, no se quitan.
- **Datos reales de deals en dev/staging o en Git** → riesgo de filtración.
- **Push directo a `main`** o merge con CI en rojo → se acumula deuda y fragilidad.
- **"Ya lo pruebo yo a mano"** para lógica financiera → tiene que haber test.
- **Secretos en el código o en capturas/chats** → usar gestor de secretos.

---

## 11. Checklist de "listo para construir con calidad"

- [ ] Repo creado, `main` protegida, `.gitignore` con `.env` y datos.
- [ ] CI en verde con: formateo, lint, type-check, build, escaneo de secretos.
- [ ] Auth definida y datos de prueba anonimizados.
- [ ] Tests de los cálculos financieros críticos escritos.
- [ ] Backups automáticos + una restauración probada.
- [ ] `README` + `DECISIONS.md` iniciados.
- [ ] Stack validado contigo.
- [ ] Header de la webapp muestra el indicador obligatorio (§1.2): `Última actualización: YYYY-MM-DD HH:MM — descripción`.

---

*Guía general reutilizable. Para el primer caso concreto de aplicación, ver `SUBPROYECTO_HERRAMIENTA_DEALS.md`. Principios de trabajo transversales en `PRINCIPIOS_DE_TRABAJO.md`.*

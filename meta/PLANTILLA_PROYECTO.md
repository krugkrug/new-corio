# [NOMBRE DEL PROYECTO] — Ficha de Proyecto

> Plantilla por proyecto. Se rige por **`PRINCIPIOS_DE_TRABAJO.md`** (documento general).
> Rellenar solo lo necesario; borrar lo que no aplique. Lean: empezar por lo básico.
> Frameworks de ejecución (ver §4.1 del general): **TOC** (¿dónde está el cuello de botella?), **Lean Startup** (¿qué hipótesis valido con este MVP?), **Agile** (¿en qué ciclos cortos?).

**Última actualización de la plantilla:** 2026-07-22 10:38 — sustituye "Versión de la plantilla: vX" por el indicador único obligatorio de fecha+hora+descripción (ver `WEBAPP_GUARDRAILS_DEVOPS.md` §1.2)
> Histórico: v1.1 añadió §0 "Semáforo del proyecto" (veredicto + tesis en una línea + siguiente paso), patrón que FICHA_SEARCHFUND_TARGET y SUBPROYECTO_HERRAMIENTA_DEALS ya usaban por su cuenta.

**Estado:** ⬜ Idea · ⬜ Spec · ⬜ En desarrollo · ⬜ En revisión · ⬜ Entregado
**Última actualización:** YYYY-MM-DD HH:MM — <descripción breve del cambio>
**Fecha objetivo / deadline:** dd/mm/yyyy
**Coste estimado:** … (tiempo / esfuerzo / €)
**Responsable / interlocutor:** …

---

## 0. Semáforo del proyecto

> 🟢 avanzar · 🟡 requiere validación · 🔴 parar/replantear. (Veredicto de avance del proyecto — distinto del semáforo de validación por reversibilidad del general §3.2, que se usa acción a acción dentro del §5.)

**Veredicto actual:** 🟢 / 🟡 / 🔴 → …
**Tesis en una línea:** …
**Siguiente paso concreto:** …

---

## 1. Objetivo final (Working Backwards)

> *Ask for the goal.* Empezar por aquí. Si no está claro, no se construye.

- **¿Qué decisión o acción habilita este proyecto?**
  …
- **Entregable final imaginado** (la tabla / pantalla / documento terminado):
  …
- **Hipótesis principal a validar** (Lean Startup — *"creo que X; lo sabré cierto si observo Y"*):
  …
- **Cómo se mide** (la señal que confirma o refuta la hipótesis):
  …
- **Definición de "hecho" (Done):**
  …

---

## 2. Spec (Get great specs before building)

- **Alcance (in):** …
- **Fuera de alcance (out):** …
- **Requisitos / restricciones:** …
- **Inputs y fuentes de datos** (con enlaces): …
- **Supuestos** (marcar los que deben validarse): …

---

## 3. Prioridades (Lean · Pareto 80/20)

| Prioridad | Tarea | ¿MVP? | Notas |
|-----------|-------|-------|-------|
| P0 | … | Sí | Lo mínimo que resuelve |
| P1 | … | No | Mejora posterior |
| P2 | … | No | Nice to have |

- **Cuello de botella actual** (TOC — *¿qué restricción limita hoy el resultado? ahí va el foco*): …
- **¿Qué se puede reutilizar / copiar** en lugar de construir de cero? …
- **¿Cómo simplificar** este proyecto? …
- **¿Hay una vía 10x más barata** para el 80% del valor? …

---

## 4. Modelos mentales aplicados

> Nombrar explícitamente los frameworks usados y por qué.

- …

---

## 5. Puntos de validación (control del proceso)

> Secuencia: Objetivo → Spec → Estimación de coste → **Boceto (validar)** → Desarrollo (**validar enfoque**) → Preview → Entrega.
> Nivel de control por reversibilidad — 🟢 hago y aviso · 🟡 boceto y espero · 🔴 no toco sin OK explícito.
> Cadencia Agile: cada ciclo corto termina en algo usable + feedback. El **ruin filter manda** sobre la velocidad (ver arbitraje §4.1 del general).

- [ ] Objetivo confirmado
- [ ] Spec aprobada
- [ ] Coste estimado y validado
- [ ] **Boceto/wireframe mostrado y validado** (antes de cualquier preview)
- [ ] Enfoque de desarrollo validado
- [ ] Preview aprobada
- [ ] Entrega final

**Semáforo asignado a este proyecto:** 🟢 / 🟡 / 🔴 → …

- **Ciclo actual (Agile):** nº … · objetivo del ciclo: … · qué aprender al cerrarlo: …
- **¿Lo aprendido pide pivotar, perseverar o parar?** …

---

## 6. Datos, fuentes y números

- **Fuentes principales** (con enlaces): …
- **Números clave** — explicar cada uno:
  - Base de los % : …
  - Real vs. nominal: …
  - Bruto vs. neto: …
  - Unidades y periodo: …
- **Rango / intervalo de confianza** en vez de falsa precisión: …
- **Nivel de confianza** de las cifras clave (alta/media/baja) y **qué falta por verificar:** …
- **Formato numérico:** ES `1.234,56` · EN `1,234.56`

---

## 7. Comunicación del proyecto

- **Idioma del entregable:** ES / EN / FR
- **Interlocutores y qué necesita saber cada uno:** …
- **Mensajes clave a repetir / confirmar:** …
- Recordatorio: *"El mayor problema en la comunicación es la ilusión de que ha tenido lugar."*

---

## 8. Fricción y siguiente paso

- **¿Dónde está la fricción del proceso completo?** …
- **¿Cómo reducirla / automatizar de forma sensata?** …
- **Próximo paso concreto:** …

---

## 9. Registro de decisiones (log)

| Fecha (dd/mm/yyyy) | Decisión | Motivo / framework | Reversible? |
|--------------------|----------|--------------------|-------------|
| … | … | … | Sí/No (ruin filter) |

---

## 10. Riesgos y anti-patrones a vigilar

- **Riesgos del proyecto** (y si son reversibles): …
- **Anti-patrones a evitar** (ver general §11): sobre-ingeniería · preview sin boceto · números sin base · suposiciones no declaradas · complacencia · reinventar lo existente.

---

## 11. Checklist de entrega

- [ ] Objetivo final claro
- [ ] Spec aprobada
- [ ] Lean: mínimo, priorizado, simple, reutilizando lo posible
- [ ] Cuello de botella (TOC) identificado y atacado · hipótesis y métrica (Lean Startup) definidas · ciclo corto (Agile) cerrado con feedback
- [ ] Validación antes de desarrollar · boceto antes de preview
- [ ] Datos, fuentes y enlaces · sin sesgo
- [ ] Números explicados (base %, real/nominal, bruto/neto, unidades, periodo)
- [ ] Precisión honesta (rangos / IC) · formato numérico correcto
- [ ] Comunicación clara (emociones, repetición, sin suposiciones)
- [ ] Nivel de confianza marcado · dicho lo que no se sabe
- [ ] Riesgos y mejores opciones señalados (aunque no se pidieran)
- [ ] Fricción reducida · próximo paso definido

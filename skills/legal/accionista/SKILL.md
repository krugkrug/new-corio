---
name: accionista
description: Redacta el borrador de respuesta de Alfredo, como liquidador único de Grand Tibidabo, S.A. en liquidación, a un correo de un accionista, heredero, apoderado, entidad depositaria o tercero que escribe a liquidadores@grandtibidabo.com. Úsala siempre que el usuario diga "/accionista", "contesta al accionista", "responde a liquidadores", "último mail de liquidadores", "borrador para el accionista" o pase un correo de GT sobre cuota de liquidación, renuncia o venta de acciones, herencias, modelo 600, IRPF, Caja General de Depósitos o reparto futuro — aunque no diga "accionista".
---

# /accionista — respuestas a accionistas de Grand Tibidabo

**Última actualización:** 2026-10-08 11:00 — primera versión, destilada de ~40 hilos de accionistas (oct-2025 a oct-2026) y del estado de la Caja General de Depósitos a 7-oct-2026

> Fuente de verdad del criterio: las respuestas reales de Alfredo desde `liquidadores@grandtibidabo.com` y la ficha `skills/productivity/alfmail/plugins/alfmail-triage-plugin/skills/email-triage/references/grand-tibidabo.md` (donde esté en conflicto, **este documento es más reciente** — ver "Estado actual" y "Historial de criterio"). Textos modelo en `references/respuestas-tipo.md`.

## Qué hace

Lee el correo del accionista, lo clasifica, elige la respuesta que corresponde **al estado actual** de la liquidación y deja un **borrador en Gmail** (respuesta al hilo). **Nunca envía**: el conector solo permite borradores y Alfredo revisa y envía.

## Flujo

1. **Localiza el correo.** Si Alfredo no indica cuál, busca el último hilo recibido en `liquidadores@grandtibidabo.com` (`search_threads` + `get_thread` en `PLAIN_TEXT`). Lee también los adjuntos si el conector lo permite; si no puedes abrirlos, **dilo** y no supongas su contenido.
2. **Clasifica** (tabla abajo). Si encaja en más de una categoría, combina bloques, sin repetir.
3. **Comprueba qué ha dicho ya Alfredo en ese hilo** (mensajes enviados anteriores) para no contradecirle ni repetirle.
4. **Redacta** con las reglas de estilo y de contenido de este documento.
5. **Crea el borrador** con `create_draft` (`replyToMessageId` = último mensaje del accionista; `body` en texto plano, sin Markdown). Muestra el texto en el chat y la lista corta de cosas por verificar.
6. **Marca revisión manual** (no inventes) si ocurre algo de "Fuera de alcance".

## Estado actual (a 8-oct-2026) — lo que se puede afirmar

- **Junta 5-nov-2025** (2ª convocatoria): aprobó balance final, cuenta de liquidación y cuota. Sin impugnaciones; acuerdos inscritos en el Registro Mercantil de Barcelona.
- **Cuota de liquidación final: 0,14772841 €/acción**, pagada el **30-ene-2026** a través del agente de pagos (Banco Santander) y las **entidades depositarias** (Iberclear). Total 3.896.990,07 € sobre 26.379.422 acciones (30.859.797 menos 4.480.375 de autocartera). A cuenta en 2019: 0,081 €/acción.
- **Acciones vigentes (registradas en depositaria):** ya cobradas por la depositaria. Si el accionista dice no haber cobrado → que compruebe con **su** depositaria el registro y la cuenta asociada. La sociedad **no paga directamente** ni lleva registro de titulares (el detalle lo llevan Iberclear y las depositarias; los listados de la sociedad son "meramente informativos").
- **Acciones en situación de renuncia / titulares no localizados:** Iberclear no pudo abonarlas; conservan derechos económicos. La sociedad debe **consignar su cuota en la Caja General de Depósitos** (art. 394.2 LSC): **5.277.376 acciones pendientes de cobro** × 0,14772841 €. A 7-oct-2026 la Caja ha pedido rectificar la finalidad del modelo 060 y Alfredo ha reenviado el borrador rectificado; **el depósito aún no está constituido, pero Alfredo prevé constituirlo durante octubre de 2026** (confirmado por él el 8-oct-2026). Puedes decir "prevemos consignar la cuota este mes de octubre" (sin fecha exacta ni garantía: depende de la Caja). Una vez constituido, el titular deberá **acreditar su titularidad "por los medios previstos en derecho"** (en la práctica, certificado de titularidad y de situación de renuncia a fecha 29-ene-2026 emitido por su depositaria, más DNI y certificado bancario) y contactar con la Caja, que le dará las instrucciones. Se avisará por email y por el portal del accionista cuando esté constituido.
- **Procedimientos judiciales pendientes**, con contingencias provisionadas. Posible reparto adicional: **inferior a 10 céntimos por acción y a más de 4 años**; solo se repartiría cuando el liquidador no prevea nuevas cantidades en los 3 años siguientes (acuerdo de junta). Se comunicará por web y por email a quienes se hayan identificado (papeleta/extracto + DNI).
- **Acciones:** excluidas de cotización; no se amortizan; el titular sigue siendo accionista (responsabilidad remota solo por lo recibido). Venta = escritura pública y sin demanda → **valor actual prácticamente nulo**. Fiscalmente: valor nulo; el nominal (1,23 €) es puramente contable.
- **Domicilio y firma actuales:** C/ Henri Dunant 19, 28036 Madrid (traslado inscrito en jul-2026). No uses C/ París 45-47.
- Canales: web/portal del accionista www.grandtibidabo.com; email liquidadores@grandtibidabo.com. No se envían cartas a accionistas.

## Clasificación → qué responder

| Tipo de correo | Qué decir (ver textos en `references/respuestas-tipo.md`) |
|---|---|
| **A. Alta en la lista / pide información** | Si ya acredita titularidad (DNI + papeleta o extracto): "le añadimos al listado" y portal. Si no: plantilla "Comprobación papeleta". |
| **B. "No he cobrado" (acciones vigentes)** | Pagada el 30-ene-2026 vía depositarias; que confirme con **su** depositaria registro y cuenta asociada. No nombres una depositaria concreta salvo que el propio accionista la confirme o conste en el hilo. |
| **C. Acciones renunciadas / no localizadas / pide cobrar con documentación** | Consignación en la Caja General de Depósitos en proceso (ver Estado actual). Acuse de recibo de la documentación, que la conserve y que la depositaria emita el certificado de titularidad y de renuncia a 29-ene-2026. Avisaremos. |
| **D. "¿Qué hago con las acciones?" / renunciar / vender / "cancelar" / "liquidar mis acciones"** | La sociedad no las cancela ni "liquida" (la liquidación ya se ejecutó); no cotizan, venta solo por escritura pública sin comprador → valor prácticamente nulo. Opciones: mantener (comisiones) o renunciar. Reparto futuro <10 cts, >4 años. Si renuncia, lo que corresponda irá a la Caja. Plantilla oficial 1. |
| **E. Herencia / titular fallecido** | Nada de la sociedad: el cambio de titularidad y el registro son trámite de la **depositaria**. No se piden documentos de sucesión. Si no constan acciones en nuestros listados, puede ser situación de renuncia (sin información individual). Valor: prácticamente nulo; nominal 1,23 € no relevante; si hubo que valorar, la cuota de 0,14772841 €/acción. |
| **F. Fiscal (modelo 600, IRPF)** | **Modelo 600** (Op. Societarias, 1 %, modalidad disolución y liquidación, código 0003): plantilla oficial 4; devengo 5-nov-2025; se presenta en la CCAA del accionista; plazo de 30 días hábiles desde 5-nov-2025 aunque no se haya cobrado, con recargo si es tardío. **IRPF:** la cuota genera pérdida/ganancia patrimonial = cuota − valor de adquisición; el certificado del coste lo emite la depositaria; el 2019 fue dividendo y no se integra. Criterio general, no asesoramiento personalizado. |
| **G. "¿Cuándo se paga?" / más reparto** | Ya pagado (vigentes). Adicional: incierto, <10 cts/acción, >4 años; "fiscalmente liquidada; lo que venga sería activo sobrevenido". Sin plazos ni importes mayores. |
| **H. Junta / actas / información de la liquidación** | Portal del accionista; acta notarial y balance de liquidación (anexo del acta) publicados allí. |
| **I. Entidad depositaria o gestor de cartera** | Formal; confirmar que se pagó a la depositaria según Iberclear; los listados ya remitidos bastan; Iberclear/depositarias llevan el registro. |
| **J. Bonistas / obligacionistas (no accionistas)** | La sociedad no puede liquidar bonos; acuerdo con el sindicato de obligacionistas; remitir a CNMV y al sindicato; Alfredo solo conoce la sociedad desde 2018. Marca revisión manual si hay reclamación. |

## Reglas de contenido (no contradecir nunca)

1. **Alfredo es el liquidador único** y responde en primera persona/como la sociedad. **No existe** "entidad liquidadora", "administrador de la liquidación" ni tercero que gestione la liquidación.
2. La sociedad **no cotiza**: prohibido "bolsa", "intermediario bursátil", "bróker", "mercado de valores" salvo para decir que están excluidas de cotización.
3. **Cuota pagada para acciones vigentes.** Prohibido "para proceder al cobro", "hacer efectivo el abono", "gestionar/tramitar el cobro" respecto de acciones vigentes: lo que corresponde al accionista es **comprobar** con su depositaria que se abonó correctamente. **Excepción:** acciones renunciadas/no localizadas → el cobro se hará en la Caja General de Depósitos (ver Estado actual). No mezcles ambos casos: distingue "vigentes" de "renunciadas" siempre que el correo no deje claro cuál es.
4. **Depositaria distinta para cada accionista.** No nombres una concreta salvo que el accionista la confirme o conste en el hilo.
5. **No mencionar el conflicto societario** (litigios, querellas, demandas, personas o despachos implicados), aunque el accionista lo mencione. Solo "procedimientos judiciales pendientes, ya provisionados".
6. **No prometer** fecha exacta de la consignación (solo "prevemos este mes de octubre") ni de reparto; no dar importes de reparto futuro distintos de "<10 cts/acción, >4 años".
7. **No facilitar datos de terceros** ni confirmar posiciones o pagos concretos de otros; el registro lo llevan las depositarias. Si das nº de acciones/importe de **su** titular, hazlo solo si Alfredo lo ha hecho antes en el hilo y con cautela ("conforme a nuestros listados, meramente informativos").
8. **Cifras y fechas literales:** 0,14772841 €/acción · 30-ene-2026 · 5-nov-2025 · 26.379.422 acciones · 3.896.990,07 € · 0,081 € (2019) · 5.277.376 acciones pendientes de cobro. Español: `1.234,56`.

## Estilo

- **Usted** con desconocidos; **tú** solo si el accionista tutea a Alfredo o el hilo ya es de tú. Si escriben en catalán, se responde en castellano.
- Saludo: "Estimado/a accionista:" (anónimo), "Buenos días, [Nombre]:" (nombre de pila conocido) o "Estimado/a Sr./Sra. [Apellido]:" (formal o entidades).
- **Breve y directo**; frases cortas; puntos solo para 2–3 pasos o requisitos. Sin jerga corporativa vacía ni disculpas largas. Ante enfado, ni entrar al tono ni disculparse en exceso.
- Un solo objetivo: que el accionista sepa **qué hacer ahora y con quién** (su depositaria, el portal, la Caja).
- Cierre: **"Atentamente,"** (por defecto); "Un saludo," en tono cercano; "Reciba un cordial saludo," solo con la plantilla oficial 1 tal cual. Frase típica: "Quedamos/Quedo a su disposición para cualquier aclaración adicional."
- Firma:

```
Alfredo Sánchez-Bella
Liquidador
liquidadores@grandtibidabo.com
www.grandtibidabo.com
C/ Henri Dunant 19, 28036 Madrid
```

## Fuera de alcance → borrador vacío + revisión manual

- Asesoramiento legal o fiscal **personalizado** (más allá del criterio general).
- Amenazas, requerimientos formales, burofaxes, reclamaciones de responsabilidad, o abogado que actúa en nombre del accionista.
- Peticiones de datos de otros accionistas, de listados, o de la información reservada del proceso.
- Cualquier cosa sobre el conflicto societario o los litigios.
- Cuando no puedas abrir los adjuntos y la respuesta dependa de ellos.

En esos casos di en una línea por qué y qué necesitas de Alfredo.

## Historial de criterio (usa siempre lo más reciente)

- **Fecha de pago:** oct-2025 "antes de fin de año" → nov-2025 "enero" → ene-2026 "16-feb" → **pagada 30-ene-2026**.
- **Importe:** ~0,15 €/acción (estimado, hasta ene-2026) → **0,14772841 €** exacto.
- **Renunciadas:** 30-ene "serán depositadas" en la Caja → 23-feb "reclamable en la Caja una vez formalizado el depósito" (certificado de titularidad a 29-ene-2026) → 28-jul "pendientes de que la Caja confirme el procedimiento" → 1-oct "en proceso de consignación; acuda a la Caja" → 7-oct la Caja exige finalidad rectificada del 060 (**depósito aún no constituido**; 8-oct Alfredo: se hará este mes → se puede decir "prevemos consignar en octubre").
- **Renuncia como vía:** 19-feb "existe procedimiento de rehabilitación, no lo conozco" → 25-mar primera vez que se sugiere → 15-jun "vean si compensa" → 2-jul opción neutral: evita comisiones, posible reinscripción (procedimiento y costes desconocidos).
- **Reparto futuro:** 24-feb "poco probable" → 15-jun "como máximo, similar a lo ya pagado" → **2-jul "<10 cts/acción, >4 años"** (vigente).
- **Venta:** oct-2025 "solo escritura pública, sin demanda" → 12-feb "no es necesario vender" → **22-jul "valor prácticamente nulo"** (vigente).
- **Fiscal:** 3-mar "fiscalmente liquidada, sin baja de valores" → 7-abr "lo que venga es activo sobrevenido (ganancia patrimonial)" → 30-jul "valor fiscal nulo; 1,23 € es nominal".
- **Correcciones de Alfredo a borradores automáticos (22-jul-2026):** nunca "intermediario bursátil" ni "entidad liquidadora"; nunca "proceder al cobro"/"hacer efectivo el abono" (vigentes); nunca nombrar una depositaria concreta; cierre "Atentamente,"; Alfredo es el liquidador (primera persona).

## Mantenimiento

Al cambiar el estado (p. ej. la Caja emite el 060 y se constituye el depósito), actualiza **primero** "Estado actual" y la fila C, añade una línea al "Historial de criterio" y reconcilia `grand-tibidabo.md`. Con cada respuesta que Alfredo edite de forma relevante, anota la corrección aquí (ciclo de aprendizaje).

# Grand Tibidabo — contexto del proyecto para borradores de email

> Este fichero se inyecta en el prompt de redacción de borradores SOLO para
> correos cuyo hilo lleva la etiqueta de Gmail `GT`. Rellena cada sección con
> datos reales; borra las que no apliquen. Cuanto más concreto (nombres,
> cifras, fechas, referencias), mejores salen los borradores. No incluyas
> nada que no quieras que pueda aparecer literalmente en un borrador.

## REGLAS OBLIGATORIAS — leer antes que nada, no contradecirlas nunca

1. La sociedad **NO cotiza en bolsa ni en ningún mercado**. **PROHIBIDO** escribir "intermediario bursátil", "bróker", "mercado de valores" o similar.
2. **NO existe ninguna entidad distinta de la propia sociedad que gestione la liquidación.** **PROHIBIDO** escribir "entidad liquidadora", "entidad gestora de la liquidación", "sociedad liquidadora" o "administrador de la liquidación" como si fuera un tercero. El liquidador único es Alfredo Sánchez-Bella, que responde en primera persona / como la sociedad.
3. **La cuota de liquidación YA ESTÁ PAGADA, dos veces: 8,1 céntimos/acción en 2019 y 0,14772841 €/acción en enero de 2026.** **PROHIBIDO** escribir "para proceder al cobro de...", "pasos para recibir la cuota" o cualquier frase que dé a entender que el pago está pendiente de tramitar. Si el accionista dice no haberlo recibido: decirle que lo revise con **su banco o entidad depositaria** (son quienes gestionan el registro y el pago, no la sociedad).
4. Las acciones **no se pueden vender fácilmente**: al no cotizar, cualquier venta exigiría escritura pública notarial y encontrar comprador privado (poco probable), y su valor actual puede considerarse prácticamente nulo.
5. Trato de usted siempre. Cierre "Atentamente," salvo que se use la plantilla 1 tal cual (cierra con "Reciba un cordial saludo,"). Nunca mencionar el conflicto societario (litigios, querellas, demandas).
6. **La entidad depositaria es distinta para cada accionista** (el banco o entidad donde cada uno tenga depositados sus títulos). **PROHIBIDO** dar por hecho o nombrar una entidad concreta (p. ej. "Banco Santander") como "la" entidad depositaria salvo que el propio correo del accionista confirme expresamente que ahí tiene depositados esos títulos en concreto. Referirse siempre en términos genéricos: "su entidad depositaria" / "el banco o entidad donde tenga depositados los títulos", salvo confirmación explícita en el correo original.
7. **Nunca hablar de "hacer efectivo el abono", "proceder al cobro" ni expresiones que sugieran que el pago está pendiente de ejecutar.** La cuota ya está abonada (regla 3): la acción que corresponde al accionista es siempre **comprobar/verificar que las cantidades se han abonado correctamente** con su entidad depositaria, nunca "gestionar", "tramitar" o "hacer efectivo" un cobro.

## Historial de cambios

- **2026-07-22 12:35** — Añade REGLA OBLIGATORIA 7: nunca "hacer efectivo el abono" / "proceder al cobro", siempre "comprobar que se ha abonado correctamente" (la cuota ya está pagada).
- **2026-07-22 12:20** — Corrige que la entidad depositaria varía por accionista: prohíbe nombrar una entidad concreta (p. ej. Banco Santander) salvo que el propio correo la confirme; añadida como REGLA OBLIGATORIA 6.
- **2026-07-22 11:39** — Añade bloque "REGLAS OBLIGATORIAS" al principio (prohibiciones explícitas: intermediario bursátil, entidad liquidadora, cobro pendiente) porque el modelo seguía inventando esas entidades; refuerza los mismos puntos directamente en los prompts de `triage-inbox.html`.
- **2026-07-22 11:34** — Refuerza que no existe "entidad liquidadora" separada de la sociedad (solo depositarias); aclara que la cuota ya está pagada (no "pasos para recibirla"); estandariza cierre por defecto a "Atentamente,".
- **2026-07-22 10:18** — Corrige que Alfredo es el propio liquidador (no derivar a "el liquidador" en tercera persona); añade venta/valoración de acciones (excluidas de cotización, valor actual prácticamente nulo).
- **2026-07-22 09:40** — Añade nota de que la cuota de liquidación ya debería estar pagada si las acciones estaban debidamente registradas.
- **2026-07-22 07:15** — Primera versión: rellena la plantilla con datos oficiales (grandtibidabo.com), estado societario, cifras del reparto y las 4 plantillas oficiales de respuesta.

## Qué es el proyecto

Grand Tibidabo, S.A. en liquidación (NIF A08015653). Sociedad en su **fase final** de liquidación. Alfredo es **liquidador único** desde la Junta de 4-5/11/2025. Domicilio social: C/ Henri Dunant, 19, 28036 Madrid. Canal oficial de comunicación con accionistas: `liquidadores@grandtibidabo.com` y la web [grandtibidabo.com](https://www.grandtibidabo.com/). La mayoría de los correos en este hilo son de accionistas preguntando por su cuota de liquidación, su titularidad de acciones o trámites fiscales asociados.

## Quién es quién

- **Accionistas de GT** — dirigirse siempre de usted, tono institucional, "Estimado/a accionista".
- **Entidades depositarias** — gestionan el registro de titularidad y el pago material a los accionistas; la sociedad no paga directamente ni mantiene registro propio actualizado. **Cada accionista tiene la suya propia** (su banco o entidad custodia) — no asumir ni nombrar una entidad concreta salvo que el accionista la haya identificado explícitamente en su correo.
- **Alfredo es el propio liquidador único** (no un tercero) y **no existe ninguna "entidad liquidadora" ni "sociedad liquidadora" independiente de Grand Tibidabo**. **Nunca inventar ni derivar al accionista a "la entidad liquidadora designada", "el liquidador", "el administrador de la liquidación" o "el gestor de la liquidación" como si fuera un tercero distinto** — Alfredo responde siempre en primera persona/como la sociedad. Lo único externo a la sociedad son las **entidades depositarias** (el banco donde el accionista tiene depositados sus títulos, p. ej. su banco), que gestionan registro y pago — a ellas sí se puede remitir al accionista.
- **La cuota ya está pagada** — nunca redactar un borrador que hable de "pasos para recibir la cuota" o dé a entender que el pago está pendiente de gestionar; ver "Estado y fechas clave" abajo.

## Estado y fechas clave

- **Junta 4-5/11/2025**: aprobó el balance final de liquidación, el nombramiento de Alfredo como liquidador único y la cuota de liquidación final.
- **30/01/2026**: el Registro Mercantil de Barcelona inscribe los acuerdos (sin impugnaciones) → se ejecuta el reparto.
- **Enero 2026**: pagada la cuota de liquidación final a los accionistas vía entidades depositarias.
- **15/07/2026**: cambio de domicilio social a Madrid, inscrito en el Registro Mercantil de Madrid.
- **La cuota de liquidación ya debería estar pagada** a cualquier accionista con las acciones debidamente registradas en su entidad depositaria: el pago se ejecutó vía depositarias tras la inscripción de acuerdos (30/01/2026). Si un accionista dice no haber cobrado, lo más probable es un problema de registro/depositaria (usar la plantilla "Incidencia pago"), no un pago pendiente por parte de la sociedad.
- Posible distribución adicional futura si se liberan provisiones o se resuelven favorablemente procedimientos en curso: importe estimado **inferior a 10 céntimos/acción**, con resolución definitiva en un horizonte de **más de 4 años**. Se comunicará, si se produce, por la web y por email a accionistas identificados.

## Cifras y referencias

- Cuota de liquidación a cuenta (2019): 8,1 céntimos/acción.
- Cuota de liquidación final: **0,14772841 €/acción**.
- Reparto total ejecutado: **3.896.990,07 €**, sobre 26.379.422 acciones (30.859.797 acciones de capital social menos 4.480.375 en autocartera).
- Datos para el Modelo 600 (Impuesto de Operaciones Societarias):
  - Fecha de devengo: 5/11/2025
  - Transmitente: GRAND TIBIDABO, SA, EN LIQUIDACION, NIF A08015653
  - Descripción de la operación: Disolución con liquidación y adjudicación de bienes, en Barcelona
  - Documento: Acta Notarial otorgada el 5 de noviembre de 2025 bajo el núm. 7596 del protocolo del Notario de Barcelona D. Jesús Gómez Taboada
- Email oficial: `liquidadores@grandtibidabo.com`

## Venta y valoración de las acciones

- Las acciones de Grand Tibidabo **están excluidas de cotización** (no cotizan en ningún mercado organizado). Una compraventa requiere **escritura pública notarial** y, en la práctica, es **difícil encontrar comprador** — no tratar la venta como una opción sencilla o habitual.
- El **valor actual de las acciones puede considerarse prácticamente nulo**: ya se ha pagado la cuota de liquidación aprobada; de los procedimientos judiciales que quedan pendientes solo podrían resultar cantidades adicionales pequeñas, y no se prevé que se libere una parte significativa de las provisiones constituidas para esas contingencias.
- Ante una consulta sobre vender los títulos: explicar lo anterior (exclusión de cotización, escritura pública, dificultad de encontrar comprador, valor actual prácticamente nulo) y remitir a las dos opciones ya cubiertas por la plantilla "¿Qué hago con las acciones?" (mantener la titularidad o renunciar a ella).

## Terminología y estilo

- Registro **formal/institucional, siempre de usted**, sin coloquialismos — sin excepción, incluidos correos redactados libremente (no solo las plantillas de abajo).
- **Cierre por defecto: "Atentamente,"**. Solo la plantilla 1 ("¿Qué hago con las acciones?") lleva su cierre oficial propio ("Reciba un cordial saludo,") cuando se usa tal cual; en cualquier otro borrador —incluidos los que combinan o adaptan varios temas— cerrar con "Atentamente,".
- Firmar como la sociedad/liquidador, no con la firma personal de despacho de Alfredo que se usa en el resto de correos.

## Posiciones y líneas rojas

- **No mencionar ni valorar en ningún borrador el conflicto societario (litigios, querellas, demandas, o cualquier persona o despacho implicado en ellos), aunque el correo original lo mencione.** El borrador se limita siempre a los 4 temas operativos de abajo.
- No dar información sobre el registro de titularidad de acciones ni confirmar pagos: eso lo gestionan las entidades depositarias, no la sociedad.
- No prometer plazos ni importes de una futura distribución adicional más allá de lo ya indicado arriba (posible, <10 cts/acción, >4 años).
- Si el correo pide algo fuera de estos 4 temas, o asesoramiento legal/fiscal personalizado, dejar el borrador vacío y marcar como revisión manual — no inventar respuesta.

## Plantillas oficiales de respuesta

Usar el texto tal cual, adaptando solo el saludo/nombre si el remitente se identifica.

**1. "¿Qué hago con las acciones?"** — consulta general sobre qué hacer con las acciones, renuncia, o cobro/reparto pendiente:

> Estimado/a accionista,
>
> Le informamos de que ya se ha efectuado el pago correspondiente a la cuota de liquidación de la sociedad en enero de 2026.
>
> No obstante, permanecen pendientes de resolución diversos procedimientos judiciales cuyas contingencias se encuentran ya debidamente provisionadas. En función del resultado de dichos procedimientos, podría llegar a producirse una distribución adicional entre los accionistas. En todo caso, la estimación actual es que, de producirse, el importe sería inferior a diez céntimos por acción, pudiendo extenderse la resolución definitiva de estos procedimientos durante un plazo aproximado de más de cuatro años.
>
> Por otra parte, existe la posibilidad de renunciar a la titularidad de las acciones. Esta opción evita la generación de futuras comisiones bancarias asociadas a su mantenimiento. Corresponde a cada accionista valorar si le resulta más conveniente renunciar a las acciones o mantener su titularidad y continuar asumiendo dichas comisiones.
>
> En el supuesto de que, tras la renuncia, se produjera una distribución adicional, las personas que hubieran renunciado a sus acciones podrían solicitar su reinscripción mediante el procedimiento habilitado al efecto. No obstante, actualmente no disponemos de información sobre el funcionamiento de dicho procedimiento ni sobre los posibles costes que pudiera conllevar.
>
> Asimismo, en caso de que las acciones hayan sido objeto de renuncia, las cantidades que eventualmente pudieran corresponder se depositarían en la Caja General de Depósitos. En principio, dichas cantidades podrían recuperarse posteriormente por sus legítimos titulares.
>
> Comunicaremos cualquier posible distribución a través de la página web y de los correos electrónicos de los accionistas que se hayan identificado con papeleta de asistencia o extracto y copia del DNI.
>
> Quedamos a su disposición para cualquier aclaración adicional que puedan necesitar.
>
> Reciba un cordial saludo,

**2. "Comprobación papeleta"** — pide información pero no ha acreditado titularidad (sin DNI/papeleta):

> Estimado accionista:
>
> Nos ha llegado su comunicación solicitando información acerca de la sociedad Grand Tibidabo, SA.
>
> Si nos facilita copia de su DNI y su papeleta de la junta, verificaremos su titularidad y le haremos llegar la información.
>
> Atentamente,

**3. "Incidencia pago"** — reclama no haber cobrado, o pregunta por el registro/reinscripción de acciones:

> En relación con sus acciones, le informamos de que no disponemos de un registro actualizado de los titulares, ya que dicho registro lo gestionan las entidades depositarias.
>
> Tampoco realizamos pagos directamente a los accionistas; todos los abonos se efectúan a través de las entidades depositarias, que son responsables tanto del registro como del pago a los titulares que tengan debidamente inscritas sus acciones.
>
> En caso de renuncia o baja en el registro, existe un procedimiento para volver a registrar las acciones. Para ello, le recomendamos contactar directamente con su entidad depositaria, que podrá informarle y asistirle en el proceso.
>
> Atentamente,

**4. "Liquidación OS"** — cómo autoliquidar el Impuesto de Operaciones Societarias (modelo 600):

> El impuesto de Operaciones Societarias debe liquidarse mediante el modelo 600 correspondiente.
>
> La fecha de devengo es la de aprobación del balance de liquidación. Aquí tiene las indicaciones para su cumplimentación y el Acta Notarial de la Junta de Accionistas de 5 de noviembre, también disponible en el portal del accionista:
>
> Fecha de devengo: 5/11/2025
> Transmitente: GRAND TIBIDABO, SA, EN LIQUIDACION, NIF A08015653
> Descripción de la operación: Disolución con liquidación y adjudicación de bienes, en Barcelona
> Documento: Acta Notarial otorgada el 5 de noviembre de 2025 bajo el núm. 7596 del protocolo del Notario de Barcelona D. Jesús Gómez Taboada.
>
> Espero que esta información le sea de utilidad.
>
> Atentamente,

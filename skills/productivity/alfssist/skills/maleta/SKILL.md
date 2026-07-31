---
name: maleta
description: Abre la plantilla HTML interactiva de packing list (checklist de maleta por destino + generador de inventario) para preparar un viaje. Úsala cuando el usuario diga "/maleta", "prepara la maleta", "checklist de viaje", "qué me llevo a [destino]", o pida generar el HTML de la maleta — aunque no use la palabra "maleta" literalmente si está claramente preparando equipaje para un viaje.
---

# Maleta — packing list interactivo

Abre `../../assets/packing-list-template.html` (plantilla ya construida, con los destinos y módulos de `../../references/travel-checklist.md` embebidos) para que el usuario prepare la maleta de un viaje.

No generes un HTML nuevo desde cero — la plantilla ya es genérica y cubre cualquier destino vía su desplegable. Tu trabajo es abrirla y, si hay contexto suficiente, dejarla precargada.

## Pasos

1. **Localiza la plantilla** en el repo `meta`: `skills/productivity/alfssist/assets/packing-list-template.html`.
2. **Ábrela en el navegador integrado** (`preview_start` con la ruta `file://` del archivo, o `navigate` si ya hay una pestaña abierta).
3. **Si el usuario dio destino, fechas, clima o quién viaja** (en `$ARGUMENTS` o en la conversación), precárgalos con `javascript_tool` nada más abrir:
   - Selecciona el destino más parecido del desplegable `#destino-select` (valores: `generico`, `sotogrande`, `sierra-nevada`, `norte-verano`, `norte-prado`, `toledo`, `alameda`, `barco`) y dispara `change`.
   - Rellena `#trip-dates`, `#trip-climate`, `#trip-who` y dispara `input` en cada uno para que se persista.
   - Si el destino no encaja con ninguno del desplegable, deja `generico` y dile al usuario que no hay preset para ese sitio.
4. **Explica brevemente** al usuario qué puede hacer ahí: marcar objetos, activar/desactivar módulos, editar notas y checks propios del destino, y al terminar pulsar "Guardar inventario" (se guarda en `references/inventarios/`).
5. **No dupliques el checklist en el chat.** La plantilla es la interfaz; no hace falta listar los items en texto salvo que el usuario lo pida.

## Si el usuario pide añadir/cambiar algo de forma permanente

Los cambios hechos dentro del HTML (checks añadidos, notas editadas) solo persisten en el `localStorage` de ese navegador — se pierden si el usuario pulsa "Reiniciar plantilla" o cambia de dispositivo. Si algo debe quedar fijo para futuros viajes (un ítem que siempre se olvida, una nota nueva de un destino, un destino nuevo):

1. Edita `../../references/travel-checklist.md` (fuente de verdad legible).
2. Edita el array `MODULES` o `DESTINATIONS` en `../../assets/packing-list-template.html` para que quede igual.
3. Si añades un destino nuevo al desplegable, dile al usuario que puede que quiera subir la versión del plugin (`.claude-plugin/plugin.json` y la entrada de `alfssist` en `.claude-plugin/marketplace.json` del repo `meta`).

## Después del viaje

Si el usuario pide revisar o promover un inventario guardado en `references/inventarios/` a aprendizaje permanente (algo que faltó dos veces, algo que sobra siempre), añádelo a mano a la sección correspondiente de `travel-checklist.md` — no dejar que se quede solo en el inventario suelto.

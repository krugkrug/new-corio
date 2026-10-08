# alf-notas — puesta en marcha (pasos de Alfredo, ~10 minutos)

Para que una sesión de cualquier repo lea y escriba en el cuaderno de notas hace
falta **una clave** y que la web la conozca. Se hace una vez.

## 1. Crear la clave (1 min)

En cualquier terminal: `openssl rand -hex 24` → da 48 caracteres. Es la clave.
Guárdala en tu gestor de contraseñas. Mínimo exigido por el servidor: 32
caracteres (más corta, la API la rechaza aunque coincida).

## 2. Ponerla en Vercel (2 min)

En el proyecto de la web (`home.sanchezbella.com`) → Settings → Environment
Variables → añade `HOME_NOTAS_API_KEY` con esa clave, en Production → redespliega
(Deployments → ··· → Redeploy; sin esto la variable no se aplica).

Prueba rápida (cambia `<CLAVE>`):

```
curl -s -H "Authorization: Bearer <CLAVE>" "https://home.sanchezbella.com/api/notas?fresh=1" | head -c 300
```

Debe salir un JSON con `"notas":[…]`. Si sale `{"error":"No autorizado"}`: clave mal
copiada o sin redesplegar.

## 3. Darla a las sesiones (5 min)

- **Sesiones cloud (claude.ai/code):** en el entorno de cada repo → variables
  secretas del entorno → `HOME_NOTAS_API_KEY`. Las mismas pantallas valen para
  permitir el dominio: en la política de red del entorno, añade
  `home.sanchezbella.com` a los dominios permitidos (si no, el script dirá
  «No llego a …»). Pídele a Claude `read_documentation` de «secretos» y «red del
  entorno» para ver los pasos actuales.
- **Sesiones locales:** variable de entorno de usuario `HOME_NOTAS_API_KEY`
  (Windows: «Editar las variables de entorno de esta cuenta»).

## 4. Instalar la skill

Marketplace `alfplugin` → plugin `alf-notas`. Después, en cualquier sesión:
`/nota` o «apunta esto en mis notas».

## Rotar la clave si se filtra

Cambia el valor en Vercel, redespliega y actualiza las sesiones. La clave solo
abre `/api/notas` (leer y crear/editar notas): no borra, no toca la estructura
ni abre documentos, claudedash ni nada más. Todo lo que escriba queda en el
historial de git de `meta` y se puede deshacer.

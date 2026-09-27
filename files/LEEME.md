# Terminal Macro en vivo — cómo publicarlo (gratis)

## 1. Consigue tu API key gratis de FRED
Ve a https://fred.stlouisfed.org/docs/api/api_key.html, crea una cuenta gratuita
y copia tu API key (es un texto largo de letras y números).

## 2. Sube esta carpeta a GitHub
- Crea una cuenta en github.com si no tienes.
- Crea un repositorio nuevo (puede ser privado).
- Sube estos 3 archivos manteniendo la misma estructura de carpetas:
  - `index.html`
  - `netlify.toml`
  - `netlify/functions/macro.js`

## 3. Conecta el repositorio a Netlify
- Ve a https://app.netlify.com y crea una cuenta gratis.
- "Add new site" → "Import an existing project" → conecta tu cuenta de GitHub
  → elige el repositorio que acabas de subir.
- Déjalo con la configuración por defecto y dale "Deploy".

## 4. Agrega tu API key como variable de entorno
- En el panel del sitio: "Site configuration" → "Environment variables" → "Add a variable".
- Nombre: `FRED_API_KEY`
- Valor: la key que copiaste en el paso 1.
- Guarda y vuelve a desplegar el sitio ("Trigger deploy").

## Listo
Netlify te da una URL tipo `tu-sitio.netlify.app`. Ábrela: vas a ver los datos
reales de CPI, tasa Fed, bono a 2 años, PBI y S&P 500, actualizados desde FRED
cada vez que la página se recarga (con caché de 1 hora para no gastar tu cuota
gratuita de la API).

## Notas
- La API key nunca se expone al navegador: vive solo en el servidor de Netlify.
- Si quieres agregar más indicadores, busca el "series ID" en fred.stlouisfed.org
  (por ejemplo buscando "unemployment rate") y agrégalo al objeto `series` en
  `netlify/functions/macro.js`.
- El plan gratuito de Netlify es más que suficiente para esto (100 GB de tráfico
  y 125,000 invocaciones de función al mes).

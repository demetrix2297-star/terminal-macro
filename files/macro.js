// Función serverless (corre en el servidor de Netlify, no en el navegador).
// Esconde tu FRED_API_KEY y le entrega al frontend solo el dato ya limpio.

exports.handler = async function () {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta configurar FRED_API_KEY en Netlify (Site settings > Environment variables)." }),
    };
  }

  // series_id de FRED para cada indicador
  const series = {
    cpi_yoy: { id: "CPIAUCSL", units: "pc1", label: "CPI interanual" },
    fed_funds: { id: "FEDFUNDS", units: "lin", label: "Tasa efectiva Fed" },
    ust2y: { id: "DGS2", units: "lin", label: "Bono UST 2 años" },
    gdp_growth: { id: "A191RL1Q225SBEA", units: "lin", label: "PBI real (crec. anualizado)" },
    sp500: { id: "SP500", units: "lin", label: "S&P 500" },
  };

  const base = "https://api.stlouisfed.org/fred/series/observations";

  try {
    const entries = await Promise.all(
      Object.entries(series).map(async ([key, cfg]) => {
        const url = `${base}?series_id=${cfg.id}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1&units=${cfg.units}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`FRED respondió ${res.status} para ${cfg.id}`);
        const data = await res.json();
        const obs = data.observations && data.observations[0];
        return [key, obs ? { label: cfg.label, date: obs.date, value: obs.value } : null];
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // cachea 1 hora en el edge de Netlify para no gastar tu cuota de FRED de más
        "Cache-Control": "public, max-age=3600",
      },
      body: JSON.stringify({ updated_at: new Date().toISOString(), data: Object.fromEntries(entries) }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

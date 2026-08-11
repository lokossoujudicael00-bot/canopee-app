// Intégration Global Forest Watch (WRI) — vérification déforestation par point GPS.
//
// Doc API : https://data-api.globalforestwatch.org
// Clé gratuite : https://www.globalforestwatch.org/help/developers/
//
// Logique métier (simplifiée mais réelle) :
//  - La référence EUDR pour "déforestation" est le 31 décembre 2020.
//  - Si le jeu de données "perte de couvert arboré" indique une perte sur la parcelle
//    après cette date => risque élevé.
//  - Sinon, si des alertes récentes (12 derniers mois) existent sur la zone => à vérifier.
//  - Sinon => conforme.
//
// NB : ceci interroge un point unique via un petit polygone tampon (~60m de côté),
// car les jeux de données de GFW sont des rasters et exigent une géométrie.

const GFW_BASE = "https://data-api.globalforestwatch.org";

function buildBufferPolygon(lat, lng, meters = 30) {
  // Conversion approximative degrés <-> mètres (suffisant pour un petit polygone local)
  const dLat = meters / 111320;
  const dLng = meters / (111320 * Math.cos((lat * Math.PI) / 180));
  return {
    type: "Polygon",
    coordinates: [
      [
        [lng - dLng, lat - dLat],
        [lng + dLng, lat - dLat],
        [lng + dLng, lat + dLat],
        [lng - dLng, lat + dLat],
        [lng - dLng, lat - dLat],
      ],
    ],
  };
}

async function queryGFW(dataset, version, sql, geometry, apiKey) {
  const res = await fetch(`${GFW_BASE}/dataset/${dataset}/${version}/query/json`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, geometry }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GFW ${dataset} ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Vérifie une parcelle et renvoie { status, raw }
 * status: "conforme" | "a_verifier" | "risque"
 */
export async function checkDeforestation(lat, lng) {
  const apiKey = process.env.GFW_API_KEY;

  if (!apiKey) {
    // Pas de clé configurée -> on ne bloque pas le flux, mais on marque "à vérifier"
    return {
      status: "a_verifier",
      raw: { warning: "GFW_API_KEY manquante — vérification non exécutée" },
    };
  }

  const geometry = buildBufferPolygon(lat, lng);

  try {
    const [lossResult, alertsResult] = await Promise.all([
      queryGFW(
        "umd_tree_cover_loss",
        "v1.9",
        "SELECT SUM(area__ha) as loss_ha FROM results WHERE umd_tree_cover_loss__year >= 2021",
        geometry,
        apiKey
      ),
      queryGFW(
        "gfw_integrated_alerts",
        "latest",
        "SELECT COUNT(*) as alert_count FROM results WHERE gfw_integrated_alerts__date >= '2025-01-01'",
        geometry,
        apiKey
      ),
    ]);

    const lossHa = lossResult?.data?.[0]?.loss_ha || 0;
    const alertCount = alertsResult?.data?.[0]?.alert_count || 0;

    let status = "conforme";
    if (lossHa > 0) status = "risque";
    else if (alertCount > 0) status = "a_verifier";

    return { status, raw: { lossHa, alertCount } };
  } catch (err) {
    console.error("Erreur vérification GFW :", err.message);
    return { status: "a_verifier", raw: { error: err.message } };
  }
}

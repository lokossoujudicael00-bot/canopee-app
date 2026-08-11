import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="top-nav" style={{ padding: 0, border: "none", marginBottom: 40 }}>
        <div className="brand">🌿 Canopée</div>
      </div>

      <h1 style={{ fontSize: 32 }}>Traçabilité EUDR pour vos coopératives fournisseurs</h1>
      <p style={{ color: "rgba(233,228,216,0.6)", maxWidth: 560, marginBottom: 32 }}>
        Collecte les données GPS de vos producteurs, suit les paiements, et génère automatiquement vos déclarations de conformité déforestation.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link href="/producteur" className="btn" style={{ textDecoration: "none", display: "inline-block" }}>
          📍 Enregistrer une parcelle
        </Link>
        <Link href="/paiement" className="btn" style={{ textDecoration: "none", display: "inline-block", background: "#C9984E" }}>
          💰 Enregistrer un paiement
        </Link>
        <Link href="/dashboard" className="btn secondary" style={{ textDecoration: "none", display: "inline-block" }}>
          📊 Voir le tableau de bord
        </Link>
      </div>
    </div>
  );
}

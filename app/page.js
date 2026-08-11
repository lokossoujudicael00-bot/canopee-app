import Link from 'next/link';

export default function Home() {
  return (
    <main 
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "linear-gradient(rgba(10, 25, 15, 0.85), rgba(10, 25, 15, 0.85)), url('https://images.unsplash.com/photo-1596191410411-a892b15e2f7f?q=80&w=1600&auto=format&fit=crop')"
      }}
    >
      <div className="p-12 h-screen flex flex-col justify-center">
        <div className="top-nav" style={{ padding: 0, border: "none", marginBottom: 40 }}>
          <div className="brand">Canopée</div>
        </div>
        
        <h1 style={{ fontSize: 32 }}>Traçabilité EUDR pour vos coopératives fournisseurs</h1>
        <p style={{ color: "rgba(233,228,216,0.6)", maxWidth: 560, marginBottom: 32 }}>
          Collecte les données GPS de vos producteurs, suit les paiements, et génère automatiquement vos déclarations de conformité déforestation.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/producteur" className="btn" style={{ textDecoration: "none" }}>
            Enregistrer une parcelle
          </Link>
          <Link href="/paiement" className="btn" style={{ textDecoration: "none", backgroundColor: "#C9984E" }}>
            Enregistrer un paiement
          </Link>
          <Link href="/dashboard" className="btn secondary" style={{ textDecoration: "none" }}>
            Voir le tableau de bord
          </Link>
        </div>
      </div>
    </main>
  );
}

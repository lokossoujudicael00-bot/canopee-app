import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>
      <div className="top-nav" style={{ padding: 0, border: "none", marginBottom: 24, textAlign: "center" }}>
        <div className="brand" style={{ fontSize: 28 }}>🌿 Canopée</div>
      </div>

      <div style={{
        background: "rgba(20, 35, 25, 0.8)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
      }}>
        <h1 style={{ fontSize: 22, textAlign: "center", marginBottom: 8 }}>Créer un compte</h1>
        <p style={{ color: "rgba(233,228,216,0.6)", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
          Inscrivez-vous pour accéder à la plateforme de traçabilité.
        </p>

        <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#ccc" }}>Nom & Prénom</label>
            <input 
              type="text" 
              placeholder="Ex: Rufin Lokossou" 
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#ccc" }}>Numéro de téléphone / WhatsApp</label>
            <input 
              type="tel" 
              placeholder="Ex: +229 97 00 00 00" 
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#ccc" }}>Rôle</label>
            <select 
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
                boxSizing: "border-box"
              }}
            >
              <option>Producteur / Agriculteur</option>
              <option>Coopérative</option>
              <option>Acheteur / Exportateur</option>
            </select>
          </div>

          <Link 
            href="/dashboard" 
            className="btn" 
            style={{ 
              textDecoration: "none", 
              textAlign: "center", 
              marginTop: 8,
              padding: "12px",
              fontWeight: "bold"
            }}
          >
            S'inscrire et Accéder 🚀
          </Link>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    role: 'Producteur / Agriculteur'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.telephone) {
      alert("Veuillez remplir votre nom et votre numéro de téléphone.");
      return;
    }
    
    // Sauvegarde la session dans le navigateur
    localStorage.setItem('user_session', JSON.stringify(formData));
    
    // Redirige vers la page d'accueil avec les fonctionnalités
    router.push('/accueil');
  };

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
          Inscrivez-vous obligatoirement pour débloquer l'accès aux fonctionnalités de la plateforme.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#ccc" }}>Nom & Prénom</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Rufin Lokossou" 
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
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
              required
              placeholder="Ex: +229 97 00 00 00" 
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
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
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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

          <button 
            type="submit" 
            className="btn" 
            style={{ 
              marginTop: 8,
              padding: "12px",
              fontWeight: "bold",
              width: "100%",
              cursor: "pointer"
            }}
          >
            S'inscrire et Accéder 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

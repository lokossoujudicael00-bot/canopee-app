'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Paiement() {
  const [formData, setFormData] = useState({
    nom: '',
    cooperative: '',
    poids: '',
    prixKilo: '',
    mode: 'Mobile Money',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = parseFloat(formData.poids || 0) * parseFloat(formData.prixKilo || 0);
    const paiements = JSON.parse(localStorage.getItem('paiements') || '[]');
    paiements.push({ ...formData, total, id: Date.now() });
    localStorage.setItem('paiements', JSON.stringify(paiements));
    alert(`Paiement de ${total.toLocaleString()} FCFA enregistré !`);
    setFormData({ nom: '', cooperative: '', poids: '', prixKilo: '', mode: 'Mobile Money', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div style={{ maxWidth: 540, margin: "40px auto", padding: "32px 24px", borderRadius: 16, background: "rgba(18, 26, 20, 0.85)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
      <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13, display: "inline-block", marginBottom: 20 }}>
        ← Retour à l'accueil
      </Link>
      
      <h1 style={{ fontSize: 28, fontFamily: "serif", fontWeight: "normal", color: "#f3f4f6", marginBottom: 8 }}>
        💰 Enregistrer un paiement
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5, marginBottom: 28 }}>
        À remplir par la coopérative au moment de l'achat de la récolte auprès du producteur.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={labelStyle}>Nom du producteur</label>
          <input type="text" required placeholder="Ex : Rufin Ahouansou" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Coopérative</label>
          <input type="text" required placeholder="Nom de la coopérative" value={formData.cooperative} onChange={e => setFormData({...formData, cooperative: e.target.value})} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Poids acheté (kg)</label>
          <input type="number" step="0.1" required placeholder="Ex : 50" value={formData.poids} onChange={e => setFormData({...formData, poids: e.target.value})} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Prix au kilo (FCFA)</label>
          <input type="number" required placeholder="Ex : 350" value={formData.prixKilo} onChange={e => setFormData({...formData, prixKilo: e.target.value})} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Mode de paiement</label>
          <select value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})} style={selectStyle}>
            <option style={{background: "#121a14"}}>Mobile Money</option>
            <option style={{background: "#121a14"}}>Espèces</option>
            <option style={{background: "#121a14"}}>Virement Bancaire</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Date du paiement</label>
          <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={inputStyle} />
        </div>

        <button type="submit" style={{ ...btnSubmitStyle, background: "#f59e0b", color: "#451a03" }}>
          Confirmer le paiement
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 6, fontWeight: 500 };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.25)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };
const btnSubmitStyle = { width: "100%", padding: "14px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 10 };

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Producteur() {
  const [formData, setFormData] = useState({
    nom: '',
    cooperative: '',
    produit: 'Karité',
    superficie: '',
    latitude: '',
    longitude: ''
  });
  const [status, setStatus] = useState('');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setStatus('📍 Position capturée avec succès !');
      }, () => {
        setStatus('❌ Impossible de récupérer la position GPS.');
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const producteurs = JSON.parse(localStorage.getItem('producteurs') || '[]');
    producteurs.push({ ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('producteurs', JSON.stringify(producteurs));
    alert('Parcelle enregistrée avec succès !');
    setFormData({ nom: '', cooperative: '', produit: 'Karité', superficie: '', latitude: '', longitude: '' });
    setStatus('');
  };

  return (
    <div style={{ maxWidth: 540, margin: "40px auto", padding: "32px 24px", borderRadius: 16, background: "rgba(18, 26, 20, 0.85)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
      <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13, display: "inline-block", marginBottom: 20 }}>
        ← Retour à l'accueil
      </Link>
      
      <h1 style={{ fontSize: 28, fontFamily: "serif", fontWeight: "normal", color: "#f3f4f6", marginBottom: 8 }}>
        📍 Enregistrer ma parcelle
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5, marginBottom: 28 }}>
        Ces informations servent à prouver la conformité de votre production auprès des acheteurs européens.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={labelStyle}>Nom complet</label>
          <input type="text" required placeholder="Ex : Rufin Ahouansou" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Coopérative</label>
          <input type="text" required placeholder="Nom de votre coopérative" value={formData.cooperative} onChange={e => setFormData({...formData, cooperative: e.target.value})} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Produit</label>
          <select value={formData.produit} onChange={e => setFormData({...formData, produit: e.target.value})} style={selectStyle}>
            <option style={{background: "#121a14"}}>Karité</option>
            <option style={{background: "#121a14"}}>Cacao</option>
            <option style={{background: "#121a14"}}>Café</option>
            <option style={{background: "#121a14"}}>Soja</option>
            <option style={{background: "#121a14"}}>Anacarde</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Superficie approximative (hectares)</label>
          <input type="number" step="0.1" required placeholder="Ex : 1.5" value={formData.superficie} onChange={e => setFormData({...formData, superficie: e.target.value})} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Position de la parcelle</label>
          <button type="button" onClick={getLocation} style={btnGpsStyle}>
            📍 Partager ma position
          </button>
          {status && <p style={{ fontSize: 12, marginTop: 8, color: "#86efac" }}>{status}</p>}
        </div>

        <button type="submit" style={btnSubmitStyle}>
          Valider ma parcelle
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 6, fontWeight: 500 };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.25)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };
const btnGpsStyle = { width: "100%", padding: "12px", borderRadius: 8, border: "1px solid rgba(134,239,172,0.3)", background: "rgba(134,239,172,0.05)", color: "#86efac", fontWeight: 600, fontSize: 14, cursor: "pointer" };
const btnSubmitStyle = { width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#4ade80", color: "#052e16", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 10 };

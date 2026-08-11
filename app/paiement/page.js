"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const COOPS = ["IRETI M'BE", "Union Karité Savè", "Coop Néré Ouoghi"];
const METHODS = [
  { value: "mobile_money", label: "Mobile Money" },
  { value: "especes", label: "Espèces" },
  { value: "virement", label: "Virement" },
];

export default function PaiementPage() {
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState("");
  const [form, setForm] = useState({
    producerName: "",
    coop: COOPS[0],
    weightKg: "",
    pricePerKg: "",
    paymentMethod: "mobile_money",
    paymentDate: new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadParcels() {
      const { data } = await supabase
        .from("parcels")
        .select("id, producer_name, coop, product")
        .order("created_at", { ascending: false });
      setParcels(data || []);
    }
    loadParcels();
  }, []);

  function selectParcel(id) {
    setSelectedParcelId(id);
    const p = parcels.find((x) => x.id === id);
    if (p) {
      setForm((f) => ({ ...f, producerName: p.producer_name, coop: p.coop }));
    }
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const total =
    (parseFloat(form.weightKg) || 0) * (parseFloat(form.pricePerKg) || 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.producerName.trim() || !form.weightKg || !form.pricePerKg) {
      setError("Merci de remplir le nom, le poids et le prix au kilo.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: selectedParcelId || null,
          producerName: form.producerName,
          coop: form.coop,
          weightKg: form.weightKg,
          pricePerKg: form.pricePerKg,
          paymentMethod: form.paymentMethod,
          paymentDate: form.paymentDate,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur lors de l'enregistrement.");
      setResult(json.payment);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
          <h2>✅ Paiement enregistré</h2>
          <p style={{ color: "rgba(233,228,216,0.6)" }}>
            {result.producer_name} a été payé {result.total_amount.toLocaleString("fr-FR")} FCFA
            pour {result.weight_kg} kg, le {result.payment_date}.
          </p>
          <p style={{ fontSize: 12, color: "rgba(233,228,216,0.45)" }}>
            Ce reçu est consultable à tout moment dans le registre des paiements.
          </p>
          <button
            className="btn secondary"
            style={{ marginTop: 12 }}
            onClick={() => {
              setResult(null);
              setSelectedParcelId("");
              setForm({
                producerName: "",
                coop: COOPS[0],
                weightKg: "",
                pricePerKg: "",
                paymentMethod: "mobile_money",
                paymentDate: new Date().toISOString().slice(0, 10),
              });
            }}
          >
            + Enregistrer un autre paiement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h2>💰 Enregistrer un paiement</h2>
        <p style={{ color: "rgba(233,228,216,0.55)", fontSize: 13, marginBottom: 20 }}>
          À remplir par la coopérative au moment de l'achat de la récolte auprès du producteur.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Lier à une parcelle déjà enregistrée (optionnel)</label>
          <select value={selectedParcelId} onChange={(e) => selectParcel(e.target.value)}>
            <option value="">— Aucune parcelle liée —</option>
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.producer_name} — {p.coop} ({p.product})
              </option>
            ))}
          </select>

          <label>Nom du producteur</label>
          <input
            value={form.producerName}
            onChange={(e) => update("producerName", e.target.value)}
            placeholder="Ex : Rufin Ahouansou"
            required
          />

          <label>Coopérative</label>
          <select value={form.coop} onChange={(e) => update("coop", e.target.value)}>
            {COOPS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label>Poids acheté (kg)</label>
          <input
            type="number"
            step="0.1"
            value={form.weightKg}
            onChange={(e) => update("weightKg", e.target.value)}
            placeholder="Ex : 50"
            required
          />

          <label>Prix au kilo (FCFA)</label>
          <input
            type="number"
            step="1"
            value={form.pricePerKg}
            onChange={(e) => update("pricePerKg", e.target.value)}
            placeholder="Ex : 350"
            required
          />

          {total > 0 && (
            <p style={{ fontSize: 13, color: "#7FB069", marginBottom: 14 }}>
              Total à payer : {total.toLocaleString("fr-FR")} FCFA
            </p>
          )}

          <label>Mode de paiement</label>
          <select value={form.paymentMethod} onChange={(e) => update("paymentMethod", e.target.value)}>
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <label>Date du paiement</label>
          <input
            type="date"
            value={form.paymentDate}
            onChange={(e) => update("paymentDate", e.target.value)}
            style={{ marginBottom: 20 }}
          />

          {error && <p style={{ color: "#C4593F", fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button type="submit" className="btn" style={{ width: "100%" }} disabled={submitting}>
            {submitting ? "Enregistrement…" : "Confirmer le paiement"}
          </button>
        </form>
      </div>
    </div>
  );
}

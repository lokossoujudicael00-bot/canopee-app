"use client";

import { useState } from "react";
import { generatePaymentPdf } from "@/lib/pdf";

const COOP_SUGGESTIONS = ["IRETI M'BE", "Union Karité Savè", "Coop Néré Ouoghi"];
const METHODS = [
  { value: "mobile_money", label: "Mobile Money" },
  { value: "especes", label: "Espèces" },
  { value: "virement", label: "Virement" },
];

export default function PaiementPage() {
  const [form, setForm] = useState({
    producerName: "",
    coop: "",
    weightKg: "",
    pricePerKg: "",
    paymentMethod: "mobile_money",
    paymentDate: new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const total = (parseFloat(form.weightKg) || 0) * (parseFloat(form.pricePerKg) || 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.producerName.trim() || !form.coop.trim() || !form.weightKg || !form.pricePerKg) {
      setError("Merci de remplir le nom, la coopérative, le poids et le prix au kilo.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Saisie entièrement manuelle : aucune parcelle existante n'est requise pour
        // enregistrer un paiement, exactement comme le nom de la coopérative.
        body: JSON.stringify({
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
      <div className="page-bg page-bg-paiement">
      <div className="container">
        <div className="card" style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
          <h2>✅ Paiement enregistré</h2>
          <p style={{ color: "rgba(233,228,216,0.6)" }}>
            {result.producer_name} a été payé {result.total_amount.toLocaleString("fr-FR")} FCFA
            pour {result.weight_kg} kg, le {result.payment_date}.
          </p>
          <button
            className="btn"
            style={{ marginTop: 12, width: "100%" }}
            onClick={() => generatePaymentPdf(result)}
          >
            📄 Télécharger le reçu PDF
          </button>
          <button
            className="btn secondary"
            style={{ marginTop: 10 }}
            onClick={() => {
              setResult(null);
              setForm({
                producerName: "",
                coop: "",
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
      </div>
    );
  }

  return (
    <div className="page-bg page-bg-paiement">
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h2>💰 Enregistrer un paiement</h2>
        <p style={{ color: "rgba(233,228,216,0.55)", fontSize: 13, marginBottom: 20 }}>
          À remplir par la coopérative au moment de l'achat de la récolte auprès du producteur.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Nom du producteur</label>
          <input
            value={form.producerName}
            onChange={(e) => update("producerName", e.target.value)}
            placeholder="Ex : Rufin Ahouansou"
            required
          />

          <label>Coopérative</label>
          <input
            list="coop-suggestions"
            value={form.coop}
            onChange={(e) => update("coop", e.target.value)}
            placeholder="Nom de la coopérative"
            required
          />
          <datalist id="coop-suggestions">
            {COOP_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

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
    </div>
  );
}

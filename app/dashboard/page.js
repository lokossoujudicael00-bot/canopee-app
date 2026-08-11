"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import { generateParcelPdf, generatePaymentPdf } from "@/lib/pdf";

const SatelliteMap = dynamic(() => import("@/components/SatelliteMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(233,228,216,0.4)" }}>
      Chargement de la carte…
    </div>
  ),
});

const STATUS_META = {
  conforme: { label: "Conforme", color: "#7FB069", bg: "rgba(127,176,105,0.15)" },
  a_verifier: { label: "À vérifier", color: "#C99B4E", bg: "rgba(201,155,78,0.15)" },
  risque: { label: "Risque élevé", color: "#C4593F", bg: "rgba(196,89,63,0.15)" },
};

export default function DashboardPage() {
  const [parcels, setParcels] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [parcelsRes, paymentsRes] = await Promise.all([
      supabase.from("parcels").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
    ]);
    if (!parcelsRes.error) setParcels(parcelsRes.data || []);
    if (!paymentsRes.error) setPayments(paymentsRes.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("dashboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "parcels" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const total = parcels.length;
  const conforme = parcels.filter((p) => p.status === "conforme").length;
  const risque = parcels.filter((p) => p.status === "risque").length;
  const hectares = parcels.reduce((s, p) => s + (p.area_ha || 0), 0);
  const pct = total ? Math.round((conforme / total) * 100) : 0;
  const totalPaye = payments.reduce((s, p) => s + (p.total_amount || 0), 0);

  return (
    <div className="page-bg page-bg-dashboard">
    <div className="container">
      <h1>Tableau de bord exportateur</h1>
      <p style={{ color: "rgba(233,228,216,0.6)", marginBottom: 28 }}>
        Données en direct de vos coopératives fournisseurs.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        <StatCard label="Producteurs enregistrés" value={total} />
        <StatCard label="Hectares cartographiés" value={hectares.toFixed(1)} />
        <StatCard label="Taux de conformité" value={`${pct}%`} accent={pct >= 70 ? "#7FB069" : "#C99B4E"} />
        <StatCard label="Total payé (FCFA)" value={totalPaye.toLocaleString("fr-FR")} accent="#C99B4E" />
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 8 }}>
        <SatelliteMap parcels={parcels} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Registre des producteurs</h3>
        {loading && <p style={{ color: "rgba(233,228,216,0.5)" }}>Chargement…</p>}
        {!loading && parcels.length === 0 && (
          <p style={{ color: "rgba(233,228,216,0.5)" }}>
            Aucune parcelle enregistrée pour l'instant. Partage le lien /producteur avec tes coopératives.
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {parcels.map((p) => {
            const meta = STATUS_META[p.status] || STATUS_META.a_verifier;
            return (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(233,228,216,0.03)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{p.producer_name}</div>
                  <div style={{ fontSize: 12, color: "rgba(233,228,216,0.5)" }}>
                    {p.coop} · {p.product} · {p.area_ha ? `${p.area_ha} ha` : "superficie non renseignée"}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "rgba(233,228,216,0.4)" }}>
                    {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="status-pill" style={{ color: meta.color, background: meta.bg }}>
                    {meta.label}
                  </span>
                  <button
                    className="btn secondary"
                    style={{ padding: "6px 10px", fontSize: 12 }}
                    onClick={() => generateParcelPdf(p)}
                  >
                    📄 PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Registre des paiements</h3>
        {!loading && payments.length === 0 && (
          <p style={{ color: "rgba(233,228,216,0.5)" }}>
            Aucun paiement enregistré pour l'instant.
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {payments.map((pay) => (
            <div
              key={pay.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(233,228,216,0.03)",
                borderRadius: 8,
                padding: "10px 14px",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{pay.producer_name}</div>
                <div style={{ fontSize: 12, color: "rgba(233,228,216,0.5)" }}>
                  {pay.coop} · {pay.weight_kg} kg à {pay.price_per_kg} FCFA/kg · {pay.payment_date}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#C99B4E", fontWeight: 600, fontSize: 13 }}>
                  {Number(pay.total_amount).toLocaleString("fr-FR")} FCFA
                </span>
                <button
                  className="btn secondary"
                  style={{ padding: "6px 10px", fontSize: 12 }}
                  onClick={() => generatePaymentPdf(pay)}
                >
                  📄 PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="card">
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: accent || "#E9E4D8" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "rgba(233,228,216,0.55)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

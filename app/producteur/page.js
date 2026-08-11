"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const OFFLINE_QUEUE_KEY = "canopee_offline_queue";

function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

async function trySyncQueue() {
  const queue = getQueue();
  if (queue.length === 0) return { synced: 0, remaining: 0 };

  const remaining = [];
  let synced = 0;

  for (const entry of queue) {
    try {
      const res = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        synced++;
      } else {
        remaining.push(entry);
      }
    } catch {
      remaining.push(entry);
    }
  }

  saveQueue(remaining);
  return { synced, remaining: remaining.length };
}

const COOPS = ["IRETI M'BE", "Union Karité Savè", "Coop Néré Ouoghi"];
const PRODUCTS = ["Karité", "Néré", "Cacao", "Café"];

export default function ProducteurPage() {
  const [form, setForm] = useState({
    producerName: "",
    coop: COOPS[0],
    product: PRODUCTS[0],
    areaHa: "",
  });
  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [savedOffline, setSavedOffline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setQueueCount(getQueue().length);

    async function handleOnline() {
      setIsOnline(true);
      const result = await trySyncQueue();
      setQueueCount(getQueue().length);
      if (result.synced > 0) {
        console.log(`${result.synced} parcelle(s) synchronisée(s)`);
      }
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if (navigator.onLine) handleOnline();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function captureLocation() {
    setLocError("");
    if (!navigator.geolocation) {
      setLocError("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        setLocError("Impossible d'obtenir la position : " + err.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!location) {
      setError("Merci de partager votre position avant de valider.");
      return;
    }
    if (!form.producerName.trim()) {
      setError("Merci d'indiquer le nom du producteur.");
      return;
    }

    setSubmitting(true);

    const payload = {
      producerName: form.producerName,
      coop: form.coop,
      product: form.product,
      lat: location.lat,
      lng: location.lng,
      areaHa: form.areaHa ? parseFloat(form.areaHa) : null,
      photoUrl: null,
    };

    if (!navigator.onLine) {
      const queue = getQueue();
      queue.push(payload);
      saveQueue(queue);
      setQueueCount(queue.length);
      setSavedOffline(true);
      setSubmitting(false);
      return;
    }

    try {
      let photoUrl = null;

      if (photoFile) {
        const fileName = `${Date.now()}-${photoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(fileName, photoFile);

        if (uploadError) throw new Error("Échec de l'envoi de la photo : " + uploadError.message);

        const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(fileName);
        photoUrl = publicUrlData.publicUrl;
      }

      const res = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, photoUrl }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur lors de l'enregistrement.");

      setResult(json.parcel);
    } catch (err) {
      const queue = getQueue();
      queue.push(payload);
      saveQueue(queue);
      setQueueCount(queue.length);
      setSavedOffline(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (result || savedOffline) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
          {result ? (
            <>
              <h2>✅ Parcelle enregistrée</h2>
              <p style={{ color: "rgba(233,228,216,0.6)" }}>
                Merci {result.producer_name}, votre parcelle a bien été enregistrée pour {result.coop}.
              </p>
            </>
          ) : (
            <>
              <h2>📴 Enregistré sur l'appareil</h2>
              <p style={{ color: "rgba(233,228,216,0.6)" }}>
                Pas de connexion internet détectée. Les informations de {form.producerName} sont
                sauvegardées sur ce téléphone et seront envoyées automatiquement dès que la
                connexion reviendra. Ne désinstalle pas l'application avant la synchronisation.
              </p>
              {queueCount > 0 && (
                <p style={{ fontSize: 12, color: "#C99B4E" }}>
                  {queueCount} parcelle{queueCount > 1 ? "s" : ""} en attente d'envoi.
                </p>
              )}
            </>
          )}
          <button
            className="btn secondary"
            style={{ marginTop: 12 }}
            onClick={() => {
              setResult(null);
              setSavedOffline(false);
              setForm({ producerName: "", coop: COOPS[0], product: PRODUCTS[0], areaHa: "" });
              setLocation(null);
              setPhotoFile(null);
            }}
          >
            + Enregistrer une autre parcelle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        {!isOnline && (
          <div
            style={{
              background: "rgba(201,155,78,0.15)",
              color: "#C99B4E",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            📴 Pas de connexion — vos données seront sauvegardées sur l'appareil et envoyées
            automatiquement dès que le réseau reviendra.
          </div>
        )}
        {queueCount > 0 && isOnline && (
          <div
            style={{
              background: "rgba(127,176,105,0.15)",
              color: "#7FB069",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            🔄 Synchronisation de {queueCount} parcelle{queueCount > 1 ? "s" : ""} en attente…
          </div>
        )}
        <h2>📍 Enregistrer ma parcelle</h2>
        <p style={{ color: "rgba(233,228,216,0.55)", fontSize: 13, marginBottom: 20 }}>
          Ces informations servent à prouver la conformité de votre production auprès des
          acheteurs européens.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Nom complet</label>
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

          <label>Produit</label>
          <select value={form.product} onChange={(e) => update("product", e.target.value)}>
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <label>Superficie approximative (hectares)</label>
          <input
            type="number"
            step="0.1"
            value={form.areaHa}
            onChange={(e) => update("areaHa", e.target.value)}
            placeholder="Ex : 1.5"
          />

          <label>Position de la parcelle</label>
          <button type="button" className="btn secondary" style={{ width: "100%", marginBottom: 10 }} onClick={captureLocation}>
            {location ? `📍 Position capturée (${location.lat.toFixed(5)}, ${location.lng.toFixed(5)})` : "📍 Partager ma position"}
          </button>
          {locError && <p style={{ color: "#C4593F", fontSize: 12 }}>{locError}</p>}

          <label>Photo de la parcelle</label>
          <input type="file" accept="image/*" capture="environment" onChange={(e) => setPhotoFile(e.target.files[0])} style={{ marginBottom: 20 }} />

          {error && <p style={{ color: "#C4593F", fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button type="submit" className="btn" style={{ width: "100%" }} disabled={submitting}>
            {submitting ? "Enregistrement en cours…" : "Valider ma parcelle"}
          </button>
        </form>
      </div>
    </div>
  );
}

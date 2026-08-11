import jsPDF from "jspdf";

function drawHeader(doc, title) {
  doc.setFillColor(14, 31, 23); // fond forêt sombre, cohérent avec l'identité Canopée
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("🌿 Canopée", 14, 15);
  doc.setFontSize(11);
  doc.text(title, 14, 24);
  doc.setTextColor(20, 20, 20);
}

function drawRow(doc, y, label, value) {
  doc.setFont(undefined, "bold");
  doc.text(`${label} :`, 14, y);
  doc.setFont(undefined, "normal");
  doc.text(String(value ?? "—"), 75, y);
}

export function generatePaymentPdf(payment) {
  const doc = new jsPDF();
  drawHeader(doc, "Reçu de paiement producteur");

  let y = 45;
  const rows = [
    ["Producteur", payment.producer_name],
    ["Coopérative", payment.coop],
    ["Poids acheté", `${payment.weight_kg} kg`],
    ["Prix au kilo", `${payment.price_per_kg} FCFA`],
    ["Montant total", `${Number(payment.total_amount).toLocaleString("fr-FR")} FCFA`],
    ["Mode de paiement", payment.payment_method],
    ["Date de paiement", payment.payment_date],
    ["Référence", payment.id],
  ];
  rows.forEach(([label, value]) => {
    drawRow(doc, y, label, value);
    y += 10;
  });

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Document généré automatiquement par Canopée — sert de preuve de paiement entre la coopérative et le producteur.",
    14,
    y + 10,
    { maxWidth: 180 }
  );

  doc.save(`recu-paiement-${(payment.producer_name || "producteur").replace(/\s+/g, "-")}.pdf`);
}

export function generateParcelPdf(parcel) {
  const doc = new jsPDF();
  drawHeader(doc, "Fiche de parcelle");

  let y = 45;
  const statusLabels = {
    conforme: "Conforme",
    a_verifier: "À vérifier",
    risque: "Risque élevé",
  };
  const rows = [
    ["Producteur", parcel.producer_name],
    ["Coopérative", parcel.coop],
    ["Produit", parcel.product],
    ["Superficie", parcel.area_ha ? `${parcel.area_ha} ha` : "Non renseignée"],
    ["Coordonnées GPS", parcel.lat && parcel.lng ? `${parcel.lat.toFixed(5)}, ${parcel.lng.toFixed(5)}` : "—"],
    ["Statut de conformité", statusLabels[parcel.status] || parcel.status],
    ["Référence", parcel.id],
  ];
  rows.forEach(([label, value]) => {
    drawRow(doc, y, label, value);
    y += 10;
  });

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Document généré automatiquement par Canopée — utilisé comme preuve de collecte pour la conformité EUDR.",
    14,
    y + 10,
    { maxWidth: 180 }
  );

  doc.save(`fiche-parcelle-${(parcel.producer_name || "producteur").replace(/\s+/g, "-")}.pdf`);
}

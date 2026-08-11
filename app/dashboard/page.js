// Ajoutez cette fonction dans votre composant DashboardPage
async function deleteItem(table, id) {
  if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) load(); // Recharge les données après suppression
  }
}

// Dans la section Registre des producteurs (au niveau des boutons) :
<button
  className="btn secondary"
  style={{ padding: "6px 10px", fontSize: 12, background: "rgba(239, 68, 68, 0.1)" }}
  onClick={() => deleteItem("parcels", p.id)}
>
  🗑️
</button>

// Dans la section Registre des paiements (remplacez les labels par $ et ajoutez le bouton) :
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <span style={{ color: "#C99B4E", fontWeight: 600, fontSize: 13 }}>
    {Number(pay.total_amount).toLocaleString("en-US")} $
  </span>
  <button
    className="btn secondary"
    style={{ padding: "6px 10px", fontSize: 12 }}
    onClick={() => generatePaymentPdf(pay)}
  >
    📄 PDF
  </button>
  <button
    className="btn secondary"
    style={{ padding: "6px 10px", fontSize: 12, background: "rgba(239, 68, 68, 0.1)" }}
    onClick={() => deleteItem("payments", pay.id)}
  >
    🗑️
  </button>
</div>

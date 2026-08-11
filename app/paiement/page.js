// Dans handleSubmit :
alert(`Paiement de ${total.toLocaleString("en-US")} $ enregistré !`);

// Dans le champ Prix au kilo (label et placeholder) :
<label>Prix au kilo ($)</label>
<input type="number" placeholder="Ex : 350" ... />

// Dans le message de succès :
{total > 0 && (
  <p style={{ fontSize: 13, color: "#7FB069", marginBottom: 14 }}>
    Total à payer : {total.toLocaleString("en-US")} $
  </p>
)}

// Dans generatePaymentPdf :
["Prix au kilo", `${payment.price_per_kg} $`],
["Montant total", `${Number(payment.total_amount).toLocaleString("en-US")} $`],

// Et dans la ligne de rendu :
doc.text(`${Number(payment.total_amount).toLocaleString("en-US")} $`, 75, y);

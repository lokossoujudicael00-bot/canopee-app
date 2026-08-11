import Link from 'next/link';

export default function Paiement() {
  return (
    <main 
      className="min-h-screen bg-cover bg-center relative p-6 md:p-12 flex flex-col items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 25, 15, 0.88), rgba(10, 25, 15, 0.88)), url('https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=1600&auto=format&fit=crop')`
      }}
    >
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-md border border-amber-500/30 p-8 rounded-2xl shadow-2xl text-white">
        <Link href="/" className="text-amber-400 text-sm hover:underline mb-4 inline-block">← Retour à l'accueil</Link>
        
        <h2 className="text-2xl font-bold mb-2 text-amber-400">💰 Enregistrer un paiement</h2>
        <p className="text-sm text-emerald-100/70 mb-6">Saisissez les détails de la transaction pour le producteur.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Producteur</label>
            <input type="text" placeholder="Nom du producteur" className="w-full p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
            <input type="number" placeholder="Ex: 150000" className="w-full p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantité (kg)</label>
            <input type="number" placeholder="Ex: 250" className="w-full p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500" />
          </div>

          <button type="button" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition">
            Valider le paiement
          </button>
        </form>
      </div>
    </main>
  );
}

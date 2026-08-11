import Link from 'next/link';

export default function Producteur() {
  return (
    <main 
      className="min-h-screen bg-cover bg-center relative p-6 md:p-12 flex flex-col items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 25, 15, 0.88), rgba(10, 25, 15, 0.88)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop')`
      }}
    >
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 p-8 rounded-2xl shadow-2xl text-white">
        <Link href="/" className="text-emerald-400 text-sm hover:underline mb-4 inline-block">← Retour à l'accueil</Link>
        
        <h2 className="text-2xl font-bold mb-2 text-emerald-400">📍 Enregistrer ma parcelle</h2>
        <p className="text-sm text-emerald-100/70 mb-6">Prouvez la conformité de votre production auprès des acheteurs.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input type="text" placeholder="Ex: Rufin Ahouansou" className="w-full p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Coopérative</label>
            <input type="text" placeholder="Nom de votre coopérative" className="w-full p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Produit</label>
            <select className="w-full p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500">
              <option>Karité</option>
              <option>Cacao</option>
              <option>Café</option>
              <option>Anacarde</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Superficie (hectares)</label>
            <input type="number" placeholder="Ex: 1.5" className="w-full p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <button type="button" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition">
            📍 Partager ma position GPS
          </button>
        </form>
      </div>
    </main>
  );
}

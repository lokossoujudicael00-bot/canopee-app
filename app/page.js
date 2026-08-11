import Link from 'next/link';

export default function Home() {
  return (
    <main 
      className="min-h-screen bg-cover bg-center relative p-8 md:p-16 flex flex-col justify-between"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 25, 15, 0.85), rgba(10, 25, 15, 0.85)), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop')`
      }}
    >
      <header className="flex items-center gap-2 mb-12">
        <span className="text-2xl">🌿</span>
        <span className="text-2xl font-bold text-emerald-400">Canopée</span>
      </header>

      <div className="max-w-3xl my-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white">
          Traçabilité EUDR pour vos coopératives fournisseurs
        </h1>
        <p className="text-lg text-emerald-100/90 mb-10 leading-relaxed max-w-2xl">
          Collecte les données GPS de vos producteurs, suit les paiements, et génère automatiquement vos déclarations de conformité déforestation.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/producteur" className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold transition">
            📍 Enregistrer une parcelle
          </Link>
          <Link href="/paiement" className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition">
            💰 Enregistrer un paiement
          </Link>
          <Link href="/dashboard" className="px-6 py-3 rounded-lg border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-300 font-semibold transition">
            📊 Voir le tableau de bord
          </Link>
        </div>
      </div>

      <footer className="mt-12 text-sm text-emerald-100/40">
        © Canopée - Conformité Déforestation & Traçabilité
      </footer>
    </main>
  );
}

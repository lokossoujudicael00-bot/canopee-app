# Canopée — Application de traçabilité EUDR

Application réelle (pas un prototype) : formulaire producteur avec vraie
géolocalisation GPS, vérification satellite automatique via l'API Global
Forest Watch, et tableau de bord exportateur en temps réel.

## Ce dont tu as besoin (tout est gratuit pour démarrer)

1. Un compte [Supabase](https://supabase.com) — base de données + stockage photos
2. Un compte [Vercel](https://vercel.com) — hébergement de l'application
3. Une clé API [Global Forest Watch](https://www.globalforestwatch.org/help/developers/) — vérification déforestation
4. [Node.js](https://nodejs.org) installé sur ton ordinateur (pour tester avant de mettre en ligne)
5. Un compte [GitHub](https://github.com) — pour connecter le code à Vercel

## Étape 1 — Créer le projet Supabase

1. Va sur supabase.com, crée un compte, crée un nouveau projet (choisis une région proche, ex. Europe)
2. Une fois le projet créé, va dans **SQL Editor** et colle tout le contenu du fichier `supabase/schema.sql`, puis exécute
3. Va dans **Storage**, crée un bucket nommé `photos`, coche **Public bucket**
4. Va dans **Project Settings > API** et note :
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ secrète, ne jamais la partager)

## Étape 2 — Obtenir la clé Global Forest Watch

1. Va sur globalforestwatch.org/help/developers, crée un compte développeur
2. Génère une clé API gratuite
3. Note-la

## Étape 3 — Configurer le projet en local

```bash
# Dans le dossier canopee-app
cp .env.local.example .env.local
```

Ouvre `.env.local` et remplace les valeurs par celles obtenues aux étapes 1 et 2.

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000 — tu dois voir la page d'accueil. Teste le formulaire
producteur sur ton téléphone (connecté au même réseau, remplace `localhost` par
l'adresse IP locale de ton ordinateur) pour que la géolocalisation fonctionne.

## Étape 4 — Mettre en ligne sur Vercel

1. Crée un dépôt sur GitHub et pousse le code :
   ```bash
   git init
   git add .
   git commit -m "Première version Canopée"
   git branch -M main
   git remote add origin https://github.com/TON_COMPTE/canopee-app.git
   git push -u origin main
   ```
2. Va sur vercel.com, connecte ton compte GitHub, importe le dépôt `canopee-app`
3. Dans les paramètres du projet Vercel, section **Environment Variables**, ajoute
   les 4 variables du fichier `.env.local` (les mêmes valeurs)
4. Clique **Deploy**

Après quelques minutes, ton application est en ligne sur une adresse du type
`canopee-app.vercel.app`. Tu peux ensuite connecter un vrai nom de domaine
(ex. canopee.bj ou canopee.app) dans les paramètres Vercel.

## Comment l'utiliser pour démarcher des entreprises

- Partage le lien `/producteur` avec une coopérative pilote (2-3 producteurs suffisent pour une démo)
- Montre le `/dashboard` en direct à un exportateur potentiel — les données apparaissent en temps réel dès qu'un producteur valide sa parcelle
- Ça te sert de preuve de concept concrète pour la prospection, pas juste une maquette

## Sécurité avant de vendre à un vrai client

Le schéma actuel autorise l'écriture publique dans la base (pratique pour un
MVP/démo, risqué en production). Avant d'avoir de vraies données clients :
- Ajoute une authentification par coopérative (Supabase Auth) ou un token
  unique par coopérative dans le lien `/producteur`
- Restreins les policies RLS dans `supabase/schema.sql` en conséquence
- Passe la clé `service_role` uniquement côté serveur (déjà fait dans ce code,
  ne jamais la mettre dans une variable `NEXT_PUBLIC_*`)

## Structure du projet

```
app/
  page.js                    → page d'accueil
  producteur/page.js         → formulaire producteur (GPS + photo)
  dashboard/page.js          → tableau de bord exportateur (temps réel)
  api/parcels/route.js       → API : liste + création des parcelles
lib/
  supabaseClient.js          → connexion Supabase côté navigateur
  supabaseServer.js          → connexion Supabase côté serveur (clé admin)
  gfw.js                     → vérification déforestation (Global Forest Watch)
supabase/
  schema.sql                 → schéma de base de données à exécuter
```

## Si tu rencontres une erreur

Colle-moi le message d'erreur exact (dans le terminal ou dans les logs Vercel),
je corrige le code directement.

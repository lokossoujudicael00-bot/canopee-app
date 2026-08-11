-- À exécuter dans Supabase > SQL Editor

create extension if not exists "pgcrypto";

create table if not exists parcels (
  id uuid primary key default gen_random_uuid(),
  producer_name text not null,
  coop text not null,
  product text not null,
  lat double precision not null,
  lng double precision not null,
  area_ha double precision,
  photo_url text,
  status text not null default 'a_verifier', -- conforme | a_verifier | risque
  gfw_raw jsonb,
  created_at timestamptz not null default now()
);

create index if not exists parcels_coop_idx on parcels (coop);
create index if not exists parcels_status_idx on parcels (status);

-- Bucket de stockage pour les photos (à créer aussi depuis l'interface Supabase > Storage,
-- nom du bucket : "photos", coché "Public bucket")

-- Sécurité (Row Level Security) — à activer avant de mettre de vraies données de production.
-- Pour le MVP/démo on laisse ouvert en lecture/écriture via la clé anonyme, mais AVANT
-- de vendre ça à un vrai client, il faut restreindre l'écriture (ex: via un token par coopérative).
alter table parcels enable row level security;

create policy "Lecture publique" on parcels
  for select using (true);

create policy "Insertion publique (MVP uniquement)" on parcels
  for insert with check (true);

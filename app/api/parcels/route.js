import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { checkDeforestation } from "@/lib/gfw";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("parcels")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ parcels: data });
}

export async function POST(request) {
  const supabase = getSupabaseServer();
  const body = await request.json();

  const { producerName, coop, product, lat, lng, areaHa, photoUrl } = body;

  if (!producerName || !coop || !product || lat == null || lng == null) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  // Vérification satellite en temps réel
  const { status, raw } = await checkDeforestation(lat, lng);

  const { data, error } = await supabase
    .from("parcels")
    .insert({
      producer_name: producerName,
      coop,
      product,
      lat,
      lng,
      area_ha: areaHa || null,
      photo_url: photoUrl || null,
      status,
      gfw_raw: raw,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ parcel: data });
}

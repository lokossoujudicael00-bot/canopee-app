import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payments: data });
}

export async function POST(request) {
  const supabase = getSupabaseServer();
  const body = await request.json();

  const { parcelId, producerName, coop, weightKg, pricePerKg, paymentMethod, paymentDate } = body;

  if (!producerName || !coop || !weightKg || !pricePerKg) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const totalAmount = parseFloat(weightKg) * parseFloat(pricePerKg);

  const { data, error } = await supabase
    .from("payments")
    .insert({
      parcel_id: parcelId || null,
      producer_name: producerName,
      coop,
      weight_kg: parseFloat(weightKg),
      price_per_kg: parseFloat(pricePerKg),
      total_amount: totalAmount,
      payment_method: paymentMethod || "especes",
      payment_date: paymentDate || new Date().toISOString().slice(0, 10),
      paid: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payment: data });
}

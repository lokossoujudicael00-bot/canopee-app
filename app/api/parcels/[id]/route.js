import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function DELETE(request, { params }) {
  const supabase = getSupabaseServer();
  const { id } = params;

  const { error } = await supabase.from("parcels").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

"use server"

import { createClient } from "../supabase/server";

export async function getPlaceId(ccn: string): Promise<string> {
  const supabase = await createClient();

  const { data } = await supabase.from('users_hospice').select('place_id').eq("ccn", `${ccn}`).single();

  return data?.place_id ?? "";
}

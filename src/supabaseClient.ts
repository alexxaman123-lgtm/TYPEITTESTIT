import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yoaybrhxjwugjauwzrua.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_Ao2Mtkzw0ZqAwUbM4zQ4Vg_NLjw_asR";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);


import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { obtenerBinance } from "./binance.ts";
import { obtenerBCV } from "./bcv.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const binance = await obtenerBinance();
    const bcv = await obtenerBCV();

    const { error } = await supabase
  .from("tasas")
  .update({
    bcv,
    binance,
    ultima_actualizacion: new Date().toISOString(),
    origen: "Automática",
  })
  .eq("id", "dbde19bf-446c-4800-aae7-c822f5e4c65f");

if (error) {
  throw error;
}

    console.log("Tasa Binance:", binance);

    console.log("Fila a actualizar: dbde19bf-446c-4800-aae7-c822f5e4c65f");

    

    return new Response(
  JSON.stringify({
    ok: true,
    tasa_bcv: bcv,
    tasa_binance: binance,
  }),
      {
        headers: {
  ...corsHeaders,
  "Content-Type": "application/json",
},
      }
    );
  } catch (error) {

    console.error(error);    

    return new Response(
      JSON.stringify({
        ok: false,
       error,
      }),
      {
        status: 500,
        headers: {
  ...corsHeaders,
  "Content-Type": "application/json",
},
      }
    );
  }
});
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      try {
        const {
          nombre,
          email,
          password,
          rol,
        } = await req.json();

        const { data, error } =
          await ctx.supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          });

        if (error) {
          throw error;
        }

        const { error: insertError } =
          await ctx.supabaseAdmin
            .from("usuarios")
            .insert({
              id: data.user.id,
              nombre,
              email,
              rol,
              activo: true,
            });

        if (insertError) {
          throw insertError;
        }

        return Response.json({
          success: true,
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            message:
              error instanceof Error
                ? error.message
                : "Error desconocido",
          },
          {
            status: 400,
          }
        );
      }
    }
  ),
};
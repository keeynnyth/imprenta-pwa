import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      try {
        const { email } = await req.json();

       const { error } =
  await ctx.supabaseAdmin.auth.resetPasswordForEmail(
    email,
    {
      redirectTo:
        "http://localhost:5173/reset-password",
    }
  );

        if (error) {
          throw error;
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
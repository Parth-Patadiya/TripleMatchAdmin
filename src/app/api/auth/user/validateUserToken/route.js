import { validateResetToken } from "../../../../../../lib/auth";

export async function POST(req) {
  try {
    const { token } = await req.json();
    const result = await validateResetToken(token);

    if (result.success) {
      return new Response(
        JSON.stringify({
          message: result.message,
          status: 1,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: result.message,
          status: 0,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in Validate Reset Token API:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        status: 0,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

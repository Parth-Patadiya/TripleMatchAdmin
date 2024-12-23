import { handleForgotPassword } from "../../../../../../lib/auth";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const result = await handleForgotPassword(email);

    if (result.success) {
      // TODO: Replace console log with email-sending logic using Nodemailer or similar
      console.log("Reset link:", result.resetLink);

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
    console.error("Error in forgotPassword API:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        status: 0,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

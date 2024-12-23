import { updatePassword } from "../../../../../../lib/auth";

export async function POST(req) {
    try {
        const { token, newPassword } = await req.json();
    
        const result = await updatePassword(token, newPassword);
    
        if (result.success) {
          return new Response(
            JSON.stringify({ status: 1, message: 'Password Updated Succesfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } else {
          return new Response(
            JSON.stringify({ status: 0, message: 'Link is Expired!' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (error) {
        console.error('Error in /updatePassword route:', error);
        return new Response(
          JSON.stringify({ status: 0, message: 'Internal server error.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
}
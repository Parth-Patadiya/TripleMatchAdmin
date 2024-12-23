import { deleteUserById } from "../../../../../../lib/auth";

export async function POST(req) {
  try {
    // Parse the JSON body to get the userId
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({
          message: 'User ID is required',
          status: 0,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } } // Bad Request
      );
    }

    // Call the `deleteUserById` function
    const result = await deleteUserById(userId);
    
    // Return appropriate responses based on the result
    if (result.success) {
      return new Response(
        JSON.stringify({
          message: 'User deleted successfully',
          status: 1,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: 'User ID not found',
          status: 0,
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error:', error);

    // Handle unexpected errors
    return new Response(
      JSON.stringify({
        message: 'Internal Server Error',
        status: 0,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

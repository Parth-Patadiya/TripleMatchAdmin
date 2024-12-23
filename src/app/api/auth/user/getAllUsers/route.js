import { getAllUsers } from "../../../../../../lib/auth";

export async function GET(req) {
    try {
      const users = await getAllUsers();
  
      return new Response(
        JSON.stringify({
          message: 'Users fetched successfully',
          users,
          status: 1 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error(error);
      return new Response(
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
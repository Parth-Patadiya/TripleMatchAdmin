import { getUserById } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ status: 0, message: 'User Id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the User by email
    const user = await getUserById(userId);
    
    if (!user.success) {
      return new Response(
        JSON.stringify({ status: 0, message: 'User Not Found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
        JSON.stringify({
          message: 'User Found Successfull',
          id: userId,
          user: {
            name: user.name,
            email: user.email,
            mobile: user.mobile
          },
          userActivity: {
            ...user.userActivity,
          },
          status: 1
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
  }
  catch (error) {
    console.error(error); // Log error to the server console
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } 
}
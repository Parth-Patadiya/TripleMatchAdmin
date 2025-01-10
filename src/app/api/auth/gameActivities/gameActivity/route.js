import { getUserByEmail, updateUserActivity } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, activityType, gameDetails } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the User by email
    const user = await getUserByEmail(email);
    if (!user) {
      return new Response(
        JSON.stringify({ status: 0, message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update user activity in database
    const updateResult = await updateUserActivity(email, activityType, gameDetails);

    if (updateResult.message === 'User not found') {
      return new Response(
        JSON.stringify({ status: 0, message: updateResult.message }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (updateResult.success === false) {
      return new Response( JSON.stringify({
        message: updateResult.message,
        status: 0,
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
    }
    return new Response(
      JSON.stringify({
        message: updateResult.message,
        user: {
          name: user.name,
          email: user.email,
        },
        status: 1,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error during update:', error);
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

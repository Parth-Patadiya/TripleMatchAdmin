import { getUserByEmail, updateLogoutCount } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { email } = await req.json();

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

    const result = await updateLogoutCount(user._id)

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ status: 0, message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Sign-out successful',
        user: {
          name: user.name,
          email: user.email,
          userActivity: {
            ...user.userActivity,
            signoutCount: user.userActivity.signoutCount + 1, // Updated value
          },
        },
        status: 1,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error during sign-out:', error);
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

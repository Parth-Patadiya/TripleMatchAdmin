import { comparePasswords, generateToken, getUserByEmail, getUserById, updateUserActivity } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the User by email
    const user = await getUserByEmail(email);
    if (!user) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Invalid credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update user activity
    const updatedUserActivity = {
      signinCount: (user.userActivity?.signinCount || 0) + 1,
      signoutCount: user.userActivity?.signoutCount || 0,
    };

    await updateUserActivity(user._id, updatedUserActivity);

    const userData = await getUserById(user._id);

    // Compare the password
    const isMatch = await comparePasswords(password, userData.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Invalid credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate JWT token
    const token = generateToken(email);

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: {
          name: userData.name,
          email: userData.email,
        },
        token,
        userActivity: {
          ...userData.userActivity,
          signinCount: userData.userActivity.signinCount, // Updated value
        },
        status: 1
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error); // Log error to the server console
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

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

    // Update only the signinCount while keeping other userActivity values intact
    const updatedUserActivity = {
      signinCount: (user.userActivity?.signinCount || 0) + 1,
      signoutCount: user.userActivity?.signoutCount || 0,
      playForFun: user.userActivity?.playForFun || {
        count: 0,
        win: 0,
        lost: 0,
        restrat: 0,
      },
      playForReal: user.userActivity?.playForReal || {
        easy: { count: 0, win: 0, lost: 0, restrat: 0 },
        medium: { count: 0, win: 0, lost: 0, restrat: 0 },
        hard: { count: 0, win: 0, lost: 0, restrat: 0 },
      },
    };

    // Update user activity in database
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
        userActivity: updatedUserActivity, // Send updated userActivity with the incremented signinCount
        status: 1,
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

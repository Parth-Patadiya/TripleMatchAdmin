import { comparePasswords, generateToken, getUserByEmail, getUserById, updateUserActivity } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, password, activityType, deviceDetails } = await req.json();

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

    if (!user.userActivity) {
      user.userActivity = { signIn: [] }; // Initialize userActivity with an empty signIn array if it doesn't exist
    } else if (!user.userActivity.signIn) {
      user.userActivity.signIn = []; // Initialize signIn array if it doesn't exist
    }

    // // Update only the signinCount while keeping other userActivity values intact
    const newSignInActivity = {
      deviceName: deviceDetails.deviceName,
      deviceModel: deviceDetails.deviceModel,
      operatingSystem: deviceDetails.operatingSystem,
      processorType: deviceDetails.processorType,
      appVersion: deviceDetails.appVersion,
      date: Date.now(), // Add current date and time
    };
    const updatedUserActivity = {
      ...user.userActivity,
      signIn: [...user.userActivity.signIn, newSignInActivity], // Append to the existing signIn array
    };
    // Update user activity in database
    await updateUserActivity(user.email, activityType, deviceDetails);

    const userData = await getUserByEmail(user.email);

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
          id: userData._id,
          name: userData.name,
          email: userData.email,
          coins: user.coins,
          amountPaid: user.amountPaid,
          winAmount: user.winAmount
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

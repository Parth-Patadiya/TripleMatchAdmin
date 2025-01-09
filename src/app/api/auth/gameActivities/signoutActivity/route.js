import { getUserByEmail, updateUserActivity } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, activityType, deviceDetails } = await req.json();

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

    if (!user.userActivity) {
      user.userActivity = { signOut: [] };
    } else if (!user.userActivity.signOut) {
      user.userActivity.signOut = [];
    }

    // Update only the signinCount while keeping other userActivity values intact
    const newSignOutActivity = {
      deviceName: deviceDetails.deviceName,
      deviceModel: deviceDetails.deviceModel,
      operatingSystem: deviceDetails.operatingSystem,
      processorType: deviceDetails.processorType,
      appVersion: deviceDetails.appVersion,
      date: Date.now(), // Add current date and time
    };

    const updatedUserActivity = {
      ...user.userActivity,
      signOut: [...user.userActivity.signOut, newSignOutActivity], // Append to the existing signIn array
    };
    const result = await updateUserActivity(email, activityType, deviceDetails);

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
          userActivity: updatedUserActivity,
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

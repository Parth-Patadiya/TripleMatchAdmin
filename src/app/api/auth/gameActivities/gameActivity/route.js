import { getUserByEmail, updateUserActivity } from '../../../../../../lib/auth';
// import { ObjectId } from 'mongodb'; // Ensure ObjectId is imported if required

// Utility function for deep merge with default initialization
// function deepMergeWithDefaults(target, source, defaults) {
//   for (const key of Object.keys(defaults)) {
//     if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
//       // Initialize missing keys in nested objects
//       target[key] = target[key] || {};
//       deepMergeWithDefaults(target[key], source[key] || {}, defaults[key]);
//     } else {
//       // If the source value is undefined, initialize with default or zero, else keep the old value
//       target[key] = source[key] !== undefined ? source[key] : (target[key] !== undefined ? target[key] : defaults[key]);
//     }
//   }
//   return target;
// }

// Function to provide initial userActivity structure
// function getDefaultUserActivity() {
//   return {
//     signIn: [],
//     signOut: [],
//     playForFun: {
//       win: [],
//       lost: [],
//       restrat: [],
//     },
//     playForReal: {
//       easy: {
//         win: [],
//         lost: [],
//         restrat: [],
//       },
//       medium: {
//         win: [],
//         lost: [],
//         restrat: [],
//       },
//       hard: {
//         win: [],
//         lost: [],
//         restrat: [],
//       },
//     }
//   };
// }

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

    // Use default userActivity if it doesn't exist
    // const currentActivity = user.userActivity || getDefaultUserActivity();

    // Deep merge existing userActivity with provided userActivity, initializing missing values to defaults
    // const updatedUserActivity = deepMergeWithDefaults(
    //   { ...currentActivity }, // Clone existing activity to avoid mutation
    //   gameDetails || {}, // Merge new data if provided
    //   getDefaultUserActivity() // Default values to initialize missing ones
    // );

    // Update user activity in database
    const updateResult = await updateUserActivity(email, activityType, gameDetails);

    if (updateResult.message === 'User not found') {
      return new Response(
        JSON.stringify({ status: 0, message: updateResult.message }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        message: updateResult.message,
        user: {
          name: user.name,
          email: user.email,
          // userActivity: updatedUserActivity,
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

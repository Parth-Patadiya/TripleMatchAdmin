import { getUserById } from '../../../../../../lib/auth';

function reverseArrays(obj) {
  if (Array.isArray(obj)) {
    return obj.reverse(); // Reverse the array
  } else if (typeof obj === "object" && obj !== null) {
    // Iterate over keys in the object
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = reverseArrays(obj[key]); // Recursively reverse arrays in nested objects
      }
    }
  }
  return obj; // Return the updated object
}

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
            email: user.email,
            coins: user.coins,
            amountPaid: user.amountPaid,
            winAmount: user.winAmount
          },
          userActivity: reverseArrays({...user.userActivity}),
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
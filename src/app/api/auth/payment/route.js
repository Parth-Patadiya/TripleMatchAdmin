import { getUserById, updateUserById } from "../../../../../lib/auth"; // Function to update user

export async function POST(req) {
  try {
    const { userId, amount, coins, winAmount } = await req.json();

    // Validate `userId`
    if (!userId) {
      return new Response(
        JSON.stringify({
          message: 'User ID is required',
          status: 0,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the user's current data
    const user = await getUserById(userId); // Replace with your database fetching logic
    if (!user) {
      return new Response(
        JSON.stringify({
          message: 'User not found',
          status: 0,
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare the updated values
    const updatedData = {};
    if (amount != null) {
      if (amount <= 0) {
        return new Response(
          JSON.stringify({
            message: 'Amount must be a positive value',
            status: 0,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      updatedData.amountPaid = amount || 0; // Increment the current value
    }

    if (winAmount != null) {
      if (winAmount <= 0) {
        return new Response(
          JSON.stringify({
            message: 'Win Amount must be a positive value',
            status: 0,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      updatedData.winAmount = winAmount || 0; // Increment the current value
    }

    if (coins != null) {
      if (coins <= 0) {
        return new Response(
          JSON.stringify({
            message: 'Coins must be a positive value',
            status: 0,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      updatedData.coins = coins || 0; // Increment the current value
    }

    // Update the user's data
    const result = await updateUserById(userId, updatedData);

    if (result.success) {
      return new Response(
        JSON.stringify({
          message: 'Payment or coins updated successfully',
          status: 1,
          data: updatedData,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: result.message || 'Failed to update user data',
          status: 0,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error:', error);

    return new Response(
      JSON.stringify({
        message: 'Internal Server Error',
        status: 0,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

import { getPurchaseByUserId, getUserById } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { userId } = await req.json();

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({
          status: 0,
          message: 'User ID is required.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await getUserById(userId);
    
    if (!user.success) {
      return new Response(
        JSON.stringify({ status: 0, message: 'No User Found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Retrieve purchase history by userId
    const purchaseHistory = await getPurchaseByUserId(userId);

    if (!purchaseHistory.success) {
      return new Response(
        JSON.stringify({
          status: 0,
          message: purchaseHistory.message || 'Failed to retrieve purchase history.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        status: 1,
        message: 'Purchase history retrieved successfully.',
        data: purchaseHistory.data,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error retrieving purchase history:', error);

    return new Response(
      JSON.stringify({
        status: 0,
        message: error.message || 'Internal server error.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

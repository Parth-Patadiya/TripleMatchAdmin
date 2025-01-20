import { getPurchaseByUserId, getUserById } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { userId, itemsPerPage = 10, pageNumber = 1, searchQuery = "", status } = await req.json();

    if (status !== "Active" && status !== "Pending") {
      return new Response(
        JSON.stringify({
          status: 0,
          message:'Status must be Active or Pending',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    // Fetch user details once
    const user = await getUserById(userId);
    if (!user.success) {
      return new Response(
        JSON.stringify({ status: 0, message: 'No User Found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Retrieve purchase history by userId with pagination and search
    const purchaseHistory = await getPurchaseByUserId(userId, itemsPerPage, pageNumber, searchQuery, status);

    if (!purchaseHistory.success) {
      return new Response(
        JSON.stringify({
          status: 0,
          message: purchaseHistory.message || 'Failed to retrieve purchase history.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add user details once to the response
    const responseData = {
      user: {
        userId:userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      purchases: purchaseHistory.data,
      pagination: purchaseHistory.pagination,
    };

    return new Response(
      JSON.stringify({
        status: 1,
        message: 'Purchase history retrieved successfully.',
        data: responseData,
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

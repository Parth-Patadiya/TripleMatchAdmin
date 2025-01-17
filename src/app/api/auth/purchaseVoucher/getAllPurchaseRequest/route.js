import { getAllPurchaseRequest, getUserById } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const {
      itemsPerPage = 10,
      pageNumber = 1,
      searchQuery = "",
    } = await req.json();

    // Retrieve all purchase histories with search and pagination
    const getAllRequest = await getAllPurchaseRequest(itemsPerPage, pageNumber, searchQuery);

    if (!getAllRequest.success) {
      return new Response(
        JSON.stringify({
          status: 0,
          message: getAllRequest.message || 'Failed to retrieve purchase histories.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Filter out purchases with status "Active"
    const filteredPurchases = getAllRequest.data.map((history) => {
      // Filter out "Active" purchases in each user's purchase list
      const filteredPurchaseHistory = {
        ...history,
        purchases: history.purchases.filter(purchase => purchase.status !== "Active"),
      };

      return filteredPurchaseHistory;
    });

    // Filter out histories with empty purchase arrays
    const nonEmptyHistories = filteredPurchases.filter(history => history.purchases.length > 0);

    // Fetch userName for each purchase history only if there are purchases
    const purchaseRequestWithUserName = await Promise.all(
      nonEmptyHistories.map(async (history) => {
        const user = await getUserById(history.userId);
        const userName = user.success ? user.name : 'Unknown User';
        const email = user.success ? user.email : '';
        const mobile = user.success ? user.mobile : '';
        return {
          userName,
          email,
          mobile,
          ...history,
        };
      })
    );

    return new Response(
      JSON.stringify({
        status: 1,
        message: 'All purchase histories retrieved successfully.',
        data: purchaseRequestWithUserName,
        pagination: getAllRequest.pagination,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error retrieving purchase histories:', error);

    return new Response(
      JSON.stringify({
        status: 0,
        message: error.message || 'Internal server error.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

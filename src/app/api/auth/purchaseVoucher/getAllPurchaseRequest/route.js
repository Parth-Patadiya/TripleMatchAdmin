import { getAllPurchaseRequest, getUserById } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    // Extract itemsPerPage, pageNumber, and searchQuery from the request body
    const { itemsPerPage = 10, pageNumber = 1, searchQuery = "", status } = await req.json();
    
    if (status !== "Active" && status !== "Pending") {
      return new Response(
        JSON.stringify({
          status: 0,
          message:'Status must be Active or Pending',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Retrieve all purchase histories with pagination and search query
    const getAllRequest = await getAllPurchaseRequest(status);
    
    if (!getAllRequest.success) {
      return new Response(
        JSON.stringify({
          status: 0,
          message: getAllRequest.message || 'Failed to retrieve purchase histories.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle the case where no data is found
    if (getAllRequest.data.length === 0) {
      return new Response(
        JSON.stringify({
          status: 1,
          message: 'No purchase histories found.',
          data: [],
          pagination: getAllRequest.pagination,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Filter out "Active" purchases, ensuring purchases is defined and an array
    const filteredPurchases = getAllRequest.data.map((history) => {
      const filteredPurchaseHistory = {
        ...history,
      };
      return filteredPurchaseHistory;
    });

    // Fetch user details (userName, email, mobile) for each purchase history asynchronously
    let purchaseRequestWithUserName = await Promise.all(
      filteredPurchases.map(async (history) => {
        const user = await getUserById(history.userId);
        // const name = user.success ? user.name : 'Unknown User';
        const email = user.success ? user.email : '';
        // const mobile = user.success ? user.mobile : '';
        return {
          // name,
          email,
          // mobile,
          ...history, // Merge user details with the purchase history
        };
      })
    );

    // Apply search on the `purchaseRequestWithUserName` data
    if (searchQuery && searchQuery.trim() !== "") {
      const lowercasedSearchQuery = searchQuery.toLowerCase();
      purchaseRequestWithUserName = purchaseRequestWithUserName.filter((history) => {
        return (
          // history.name.toLowerCase().includes(lowercasedSearchQuery) ||
          history.email.toLowerCase().includes(lowercasedSearchQuery) ||
          // history.mobile.toLowerCase().includes(lowercasedSearchQuery) ||
          history.title.toLowerCase().includes(lowercasedSearchQuery) ||
          history.purchaseId.toLowerCase().includes(lowercasedSearchQuery)
        );
      });
    }

    // Update pagination based on the filtered data
    const totalRecords = purchaseRequestWithUserName.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const skip = (pageNumber - 1) * itemsPerPage;
    const paginatedData = purchaseRequestWithUserName.slice(skip, skip + itemsPerPage);

    // Respond with the filtered and enriched purchase histories and updated pagination info
    return new Response(
      JSON.stringify({
        status: 1,
        message: 'All purchase histories retrieved successfully.',
        data: paginatedData,
        pagination: {
          totalRecords, // Total number of filtered records
          itemsPerPage,
          currentPage: pageNumber,
          totalPages, // Total pages based on filtered data
        },
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

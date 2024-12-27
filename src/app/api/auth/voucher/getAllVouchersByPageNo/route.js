import { getAllVouchersByPageNo } from "../../../../../../lib/auth";

export async function POST(req) {
  try {
    // Read the request body
    const { itemsPerPage = 10, pageNumber = 1 } = await req.json(); // Default values if not provided

    // Call the function to get the vouchers with pagination
    const response = await getAllVouchersByPageNo(itemsPerPage, pageNumber);

    if (response.status === 0) {
      return new Response(
        JSON.stringify({ status: 0, message: response.message }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        status: 1,
        message: response.message,
        vouchers: response.data.reverse(),
        pagination: response.pagination,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

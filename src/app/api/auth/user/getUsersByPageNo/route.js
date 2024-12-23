import { getUsersByItemPerPage } from "../../../../../../lib/auth";

export async function POST(req) {
  try {
    const { itemsPerPage = 10, pageNumber = 1 } = await req.json();
    // const itemsPerPage = parseInt(url.searchParams.get('itemsPerPage') || '10', 10); // Default 10 items per page
    // const pageNumber = parseInt(url.searchParams.get('pageNumber') || '1', 10); // Default to page 1

    const { users, totalUsers, totalPages, currentPage } = await getUsersByItemPerPage(Number(itemsPerPage), Number(pageNumber));

    return new Response(
      JSON.stringify({
        message: 'Users fetched successfully',
        users,
        pagination: {
          totalUsers,
          totalPages,
          currentPage,
          itemsPerPage,
        },
        status: 1 
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

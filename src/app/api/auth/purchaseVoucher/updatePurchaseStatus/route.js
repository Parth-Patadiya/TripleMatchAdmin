import { updateVoucherPurchaseStatus } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { userId, purchaseId, newStatus } = await req.json();

    if (!userId || !purchaseId , !newStatus ) {
      return new Response(
        JSON.stringify({
          status: 0,
          message: 'User ID, Voucher ID and New Status are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if(newStatus !== "Active"){
        return new Response(
            JSON.stringify({
              status: 0,
              message: 'New Status must be Active .',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
    }

    // Update the purchase status in the database
    const updateResult = await updateVoucherPurchaseStatus(userId, purchaseId, newStatus);

    if (!updateResult.success) {
      throw new Error(updateResult.message || 'Failed to update voucher status');
    }

    return new Response(
      JSON.stringify({
        status: 1,
        message: 'Voucher status updated successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating voucher status:', error.message);
    return new Response(
      JSON.stringify({ status: 0, message: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

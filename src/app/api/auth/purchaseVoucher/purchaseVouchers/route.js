import { getVoucherById, purchaseVouchers } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { userId, voucherIds, deviceDetails } = await req.json();

    if (!userId || !voucherIds || !Array.isArray(voucherIds) || voucherIds.length === 0) {
      return new Response(
        JSON.stringify({
          status: 0,
          message: 'User ID and a list of Voucher IDs are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newSignOutActivity = {
      deviceName: deviceDetails.deviceName,
      deviceModel: deviceDetails.deviceModel,
      operatingSystem: deviceDetails.operatingSystem,
      processorType: deviceDetails.processorType,
      appVersion: deviceDetails.appVersion,
      date: Date.now(), // Add current date and time
    };

    // Validate and retrieve voucher details
    const voucherDetails = [];
    for (const voucherId of voucherIds) {
      const voucher = await getVoucherById(voucherId); // Function to fetch voucher details by ID
      if (!voucher) {
        return new Response(
          JSON.stringify({
            status: 0,
            message: `Voucher with ID ${voucherId} not found`,
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      voucherDetails.push(voucher);
    }

    // Save the purchase in the database
    const purchaseResult = await purchaseVouchers(userId, voucherIds, newSignOutActivity);

    if (!purchaseResult.success) {
      throw new Error('Failed to process purchase');
    }

    return new Response(
      JSON.stringify({
        status: 1,
        message: 'Vouchers purchased successfully',
        purchaseDetails: purchaseResult.details,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error purchasing vouchers:', error.message);
    return new Response(
      JSON.stringify({ status: 0, message: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

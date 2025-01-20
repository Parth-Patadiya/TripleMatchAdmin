import { deleteVoucher } from '../../../../../../lib/auth';
import { getVoucherById } from '../../../../../../lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    // Parse request body for voucherId
    const { voucherId } = await req.json();

    // Check if voucherId is provided
    if (!voucherId) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Voucher ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the existing voucher details from the database
    const existingVoucher = await getVoucherById(voucherId);

    if (!existingVoucher) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Voucher not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the associated image if it exists
    if (existingVoucher.image) {
      const imagePath = path.resolve(`./tmp${existingVoucher.image}`);

      try {
        await fs.unlink(imagePath); // Delete the image file
      } catch (err) {
        console.error('Error deleting image:', err);
        return new Response(
          JSON.stringify({ status: 0, message: 'Failed to delete image' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Delete the voucher
    const response = await deleteVoucher(voucherId);

    if (response.status === 0) {
      return new Response(
        JSON.stringify({ status: 0, message: response.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        status: 1,
        message: 'Voucher deleted successfully',
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

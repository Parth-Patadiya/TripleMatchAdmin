import { updateVoucher } from '../../../../../../lib/auth';
import { getVoucherById } from '../../../../../../lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Get text fields from form data
    const voucherId = formData.get('voucherId');
    const title = formData.get('title');
    const description = formData.get('description');
    const validTill = formData.get('validTill');
    const amount = formData.get('amount');

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

    // Handle file upload for image
    const imageFile = formData.get('image');
    let imagePath = existingVoucher.image; // Retain the existing image path

    if (imageFile && typeof imageFile !== 'string') {
      // Save the new image locally if provided
      const uploadDir = path.resolve('./var/task/vouchers'); // Ensure 'uploads' directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      imagePath = path.join(uploadDir, imageFile.name);
      const imageBuffer = await imageFile.arrayBuffer();
      await fs.writeFile(imagePath, Buffer.from(imageBuffer));
    }

    // Create the update data object
    const updateData = {
      title: title || existingVoucher.title,
      description: description || existingVoucher.description,
      image: imageFile ? `/images/vouchers/${imageFile.name}` : imagePath,
      validTill: validTill || existingVoucher.validTill,
      amount: amount || existingVoucher.amount,
      updatedAt: new Date(), // Add the updatedAt field
    };

    // Call the updateVoucher function to update the voucher in the database
    const response = await updateVoucher(voucherId, updateData);

    if (response.status === 0) {
      return new Response(
        JSON.stringify({ status: 0, message: response.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        status: 1,
        message: 'Voucher updated successfully',
        voucher: { voucherId, ...updateData },
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

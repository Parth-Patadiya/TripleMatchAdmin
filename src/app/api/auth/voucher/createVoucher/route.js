import { createVoucher } from '../../../../../../lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Parse text fields
    const title = formData.get('title');
    const description = formData.get('description');
    const validTill = formData.get('validTill');
    const amount = formData.get('amount');

    if (!title || !description || !validTill || !amount) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Title, Description, Date, and Amount are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle file upload
    const imageFile = formData.get('image');
    if (!imageFile || typeof imageFile === 'string') {
      return new Response(
        JSON.stringify({ status: 0, message: 'Image file is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type (optional)
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(imageFile.type)) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Invalid image type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure unique file name
    const uniqueName = `${Date.now()}-${imageFile.name}`;
    const uploadDir = path.resolve('./var/task/vouchers'); // Adjust path as needed
    await fs.mkdir(uploadDir, { recursive: true });

    const imagePath = path.join(uploadDir, uniqueName);
    const imageBuffer = await imageFile.arrayBuffer();
    await fs.writeFile(imagePath, Buffer.from(imageBuffer));

    // Save voucher in the database
    const imageURL = `/vouchers/${uniqueName}`;
    const userReqData = [title, description, imageURL, validTill, amount];
    await createVoucher(...userReqData);

    return new Response(
      JSON.stringify({
        message: 'Voucher created successfully',
        voucher: { title, description, image: imageURL, validTill, amount },
        status: 1,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

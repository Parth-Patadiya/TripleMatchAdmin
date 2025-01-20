import { createVoucher } from '../../../../../../lib/auth';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Install this with `npm install uuid`

async function saveImage(imageFile) {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (!validImageTypes.includes(imageFile.type)) {
    throw new Error('Invalid image type');
  }

  const fileExtension = path.extname(imageFile.name);
  const uniqueFileName = `${uuidv4()}${fileExtension}`;

  const uploadDir = path.resolve('/tmp');
  await fs.mkdir(uploadDir, { recursive: true });

  const imagePath = path.join(uploadDir, uniqueFileName);
  const imageBuffer = await imageFile.arrayBuffer();
  await fs.writeFile(imagePath, Buffer.from(imageBuffer));

  return `/tmp/${uniqueFileName}`;
}

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

    // Save the image file and get the image URL
    const imageURL = await saveImage(imageFile);

    const userReqData = [title, description, imageURL, validTill, amount];

    // Save the voucher in the database
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
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ status: 0, message: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

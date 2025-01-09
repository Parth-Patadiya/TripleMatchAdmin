import { decryptPassword, getAdminById } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { adminId } = await req.json();

    if (!adminId) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Admin Id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the admin by email
    const admin = await getAdminById(adminId);
    
    if (!admin.success) {
      return new Response(
        JSON.stringify({ status: 0, message: 'admin Not Found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
        JSON.stringify({
          message: 'admin Found Successfull',
          id: adminId,
          admin: {
            name: admin.name,
            email: admin.email,
            password: await decryptPassword(admin.password)
          },
          
          status: 1
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
  }
  catch (error) {
    console.error(error); // Log error to the server console
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } 
}
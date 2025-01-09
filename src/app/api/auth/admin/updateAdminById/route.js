import { hashPassword, updateAdminById } from "../../../../../../lib/auth";

export async function POST(req) {
  try {
    const { adminId, name, email, password } = await req.json();

    if (!adminId) {
      return new Response(
        JSON.stringify({
          message: 'Admin ID is required',
          status: 0,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } } // Bad Request
      );
    }

    // Prepare the data to be updated
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await hashPassword(password); // Ensure the password is hashed properly
    }
    // Call the `updateUserById` function
    const result = await updateAdminById(adminId, updateData);

    if (result.success) {
      return new Response(
        JSON.stringify({
          message: result.message,
          status: 1,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: result.message,
          status: 0,
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error:', error);

    return new Response(
      JSON.stringify({
        message: 'Internal Server Error',
        status: 0,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

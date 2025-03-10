import { hashPassword, updateUserById } from "../../../../../../lib/auth";

export async function POST(req) {
  try {
    // const { userId, name, email, mobile, password } = await req.json();
    const { userId, email, password } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({
          message: 'User ID is required',
          status: 0,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } } // Bad Request
      );
    }

    // Prepare the data to be updated
    const updateData = {};
    // if (name) updateData.name = name;
    if (email) updateData.email = email;
    // if (mobile) updateData.mobile = mobile;
    if (password) {
      updateData.password = await hashPassword(password); // Ensure the password is hashed properly
    }
    // Call the `updateUserById` function
    const result = await updateUserById(userId, updateData);

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

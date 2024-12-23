import { hashPassword, createAdmin, generateToken, getAdminByEmail } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }
    if (role !== "Admin") {
      return new Response(
        JSON.stringify({ status: 0, message: 'Admin Role Required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }
    // Check if the Admin already exists
    const admin = await getAdminByEmail(email);
    if (admin) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Email already in use' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new Admin
    await createAdmin(name, email, hashedPassword, role);

    // Generate JWT token
    const token = generateToken(email);

    return new Response(
      JSON.stringify({ status: 1, message: 'Signup successful', token }),
      { status: 201, headers: { 'Content-Type': 'application/json' }  }
    );
  } catch (error) {
    console.error(error); // Log error to the server console
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' }  }
    );
  }
}

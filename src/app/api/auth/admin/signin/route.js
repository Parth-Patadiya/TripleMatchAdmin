import { comparePasswords, generateToken, getAdminByEmail } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }

    // Find the Admin by email
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Invalid credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }

    // Compare the password
    const isMatch = await comparePasswords(password, admin.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Invalid credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }

    // Generate JWT token
    const token = generateToken(email);

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: {
          name: admin.name,
          email: admin.email,
        },
        token,
        status: 1 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error); // Log error to the server console
    return new Response(
      JSON.stringify({ status: 0, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' }  }
    );
  }
}

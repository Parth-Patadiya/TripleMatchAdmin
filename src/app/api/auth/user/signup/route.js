import { hashPassword, createUser, generateToken, getUserByEmail } from '../../../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

      if (!email || !password ) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Email, Password, Mobile are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }
    if (role !== "User") {
      return new Response(
        JSON.stringify({ status: 0, message: 'User Role Required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }
    // Check if the User already exists
    const user = await getUserByEmail(email);
    if (user) {
      return new Response(
        JSON.stringify({ status: 0, message: 'Email already in use' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }  }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create new User
    const userReqData = [email, hashedPassword, role];
    const res = await createUser(...userReqData);
    console.log(res);
    
    const resData = { email:email, role:role }
    
    // Generate JWT token
    const token = generateToken(email);

    return new Response(
      JSON.stringify({ message: 'Signup successful', user:{...resData, status: 1 }, token }),
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

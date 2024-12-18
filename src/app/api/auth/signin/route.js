// src/app/api/auth/signin/route.js

import { comparePasswords, generateToken, getUserByEmail } from '../../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 400 }
      );
    }

    // Compare the password
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = generateToken(email);

    return new Response(
      JSON.stringify({ message: 'Login successful', token }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Log error to the server console
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

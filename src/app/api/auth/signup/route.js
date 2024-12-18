// src/app/api/auth/signup/route.js

import { hashPassword, createUser, generateToken, getUserByEmail } from '../../../../../lib/auth';

export async function POST(req) {
  try {
    const {name, email, password, role } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // Check if the user already exists
    const user = await getUserByEmail(email);
    if (user) {
      return new Response(
        JSON.stringify({ message: 'Email already in use' }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    await createUser(name, email, hashedPassword, role);

    // Generate JWT token
    const token = generateToken(email);

    return new Response(
      JSON.stringify({ message: 'Signup successful', token }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error); // Log error to the server console
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

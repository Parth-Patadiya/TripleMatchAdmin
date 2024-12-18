// src/lib/auth.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb'; // Assuming your MongoDB client is in this file

// Function to hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Function to compare password
export async function comparePasswords(inputPassword, storedPassword) {
  return await bcrypt.compare(inputPassword, storedPassword);
}

// Function to generate JWT token
export function generateToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Function to connect to MongoDB
export async function getUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('users').findOne({ email });
}

export async function createUser(email, hashedPassword) {
  const client = await clientPromise;
  const db = client.db();
  const newUser = await db.collection('users').insertOne({ email, password: hashedPassword });
  return newUser;
}

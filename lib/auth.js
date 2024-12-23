import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import crypto from "crypto";
import nodemailer from "nodemailer";

const client = await clientPromise;
const db = client.db();

const transporter = nodemailer.createTransport({
  service: "Gmail", // Change to your email provider (e.g., 'SendGrid', 'Outlook')
  auth: {
    user: process.env.NODE_MAILER_EMAIL, // Replace with your email
    pass: process.env.NODE_MAILER_PASSWORD, // Replace with your email password or app-specific password
  },
});

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

// Admin
export async function getAdminByEmail(email) {
  return await db.collection('admin').findOne({ email });
}

export async function createAdmin(name, email, hashedPassword, role) {
  const newUser = await db.collection('admin').insertOne({ name, email, password: hashedPassword, role });
  return newUser;
}


// User
export async function getUserByEmail(email) {
  return await db.collection('users').findOne({ email });
}

export async function createUser(name, email, mobile, hashedPassword, role) {
  const newUser = await db.collection('users').insertOne({ name, email, mobile, password: hashedPassword, role });
  return newUser;
}

// Get All User

export async function getAllUsers() {
  try {
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Get Users Pagination

export async function getUsersByItemPerPage(itemsPerPage , pageNumber) {
  try {
    // const db = await connectToDatabase();
    const skip = (pageNumber - 1) * itemsPerPage; // Calculate how many documents to skip

    const users = await db
      .collection('users')
      .find({}, { projection: { password: 0 } }) // Exclude passwords for security
      .skip(skip) // Skip documents for pagination
      .limit(itemsPerPage) // Limit the number of documents returned
      .toArray();

    const totalUsers = await db.collection('users').countDocuments(); // Total user count
    const totalPages = Math.ceil(totalUsers / itemsPerPage); // Total number of pages

    return {
      users,
      totalUsers,
      totalPages,
      currentPage: pageNumber,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function deleteUserById(userId) {
  try {
    // Validate the user ID
    if (!ObjectId.isValid(userId)) {
      return {
        success: false,
        message: 'Invalid user ID format',
      };
    }

    // Convert the `userId` to an ObjectId
    const objectId = new ObjectId(userId);

    // Delete the user by `_id`
    const result = await db.collection('users').deleteOne({ _id: objectId });

    // Check if the user was deleted
    if (result.deletedCount === 0) {
      return {
        success: false,
        message: 'User not found or already deleted',
      };
    }

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
  }
}

export async function updateUserById(userId, updateData) {
  try {
    // Validate the user ID
    if (!ObjectId.isValid(userId)) {
      return {
        success: false,
        message: 'Invalid user ID format',
      };
    }

    // Convert the `userId` string to ObjectId
    const objectId = new ObjectId(userId);

    // Update the user by `_id`
    const result = await db.collection('users').updateOne(
      { _id: objectId },
      { $set: updateData } // Update the fields
    );

    // Check if the user was updated
    if (result.matchedCount === 0) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
  }
}

export async function handleForgotPassword(email) {
  try {
    if (!email) {
      return { success: false, message: "Email is required" };
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60; // 1 hour

    // Save the token in the database
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      }
    );

    // Create the reset link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.NODE_MAILER_EMAIL, // Replace with your email
      to: email,
      subject: "Password Reset Request",
      text: `Hello,\n\nPlease use the link below to reset your password. The link is valid for 1 Minute:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nThanks,\nYour App Team`,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Password reset email generated successfully",
      resetLink,
    };
  } catch (error) {
    console.error("Error in handleForgotPassword:", error);
    return { success: false, message: "Internal server error" };
  }
}


export async function updatePassword(email, token, newPassword) {
  try {
    // Validate inputs
    if (!email || !token || !newPassword) {
      return { success: false, message: 'All fields are required.' };
    }

    const user = await db.collection('users').findOne({ email: email });
    
    if (!user || !user.resetToken) {
      return res.status(404).json({ success: false, message: 'User not found or reset token missing.' });
    }

    const { resetToken } = user;
    // Verify the reset token
    if(token !== resetToken){
      return { success: false, message: 'Invalid token.' };
    }

    if (Date.now() > user.resetTokenExpiry) {
      return { success: false, message: 'Reset token has expired.' };
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password in the database
    const result = await db.collection('users').updateOne(
      { email: email }, // Match the user by ID
      { $set: { password: hashedPassword } } // Set the new hashed password
    );

    if (result.modifiedCount === 0) {
      return { success: false, message: 'User not found.' };
    }

    return { success: true, message: 'Password updated successfully.' };
  } catch (error) {
    console.error('Error in updatePassword:', error);
    throw new Error('An error occurred while updating the password.');
  }
}
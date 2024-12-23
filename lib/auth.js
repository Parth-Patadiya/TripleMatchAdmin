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

export async function getUsersByItemPerPage(itemsPerPage, pageNumber) {
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
    const resetLink = `http://localhost:3000/user/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.NODE_MAILER_EMAIL,
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

export async function validateResetToken(token) {
  try {
    if (!token) {
      return { success: false, message: "Token is required" };
    }

    // Find the user with the provided reset token
    const user = await db.collection("users").findOne({ resetToken: token });

    if (!user) {
      return { success: false, message: "Invalid reset token" };
    }

    // Check if the token has expired
    if (user.resetTokenExpiry < Date.now()) {
      return { success: false, message: "Reset token has expired" };
    }

    return { success: true, message: "Reset token is valid" };
  } catch (error) {
    console.error("Error in validateResetToken:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function updatePassword(token, newPassword) {
  try {
    // Validate inputs
    if (!token || !newPassword) {
      return { success: false, message: 'All fields are required.' };
    }

    const user = await db.collection('users').findOne({ resetToken: token });
    console.log(user);

    if (!user || !user.resetToken) {
      return { success: false, message: 'User not found or reset token missing.' };
    }

    const { resetToken } = user;
    // Verify the reset token
    if (token !== resetToken) {
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
      { resetToken: token }, // Match the user by token
      {
        $set: { password: hashedPassword }, // Set the new hashed password
        $unset: { resetToken: "", resetTokenExpiry: "" } // Remove the reset fields
      }
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

// Voucher APIs

// Create New Voucher

export async function createVoucher(title, description, image, validTill, amount) {
  try {
    // Input validation
    if (!title || !description || !image || !validTill || !amount) {
      throw new Error('All fields (title, description, image, validTill, amount) are required.');
    }

    // Insert into the database
    const newVoucher = await db.collection('vouchers').insertOne({
      title,
      description,
      image,
      validTill,
      amount,
      createdAt: new Date(), // Automatically store creation timestamp
    });

    return {
      success: true,
      data: newVoucher,
      message: 'Voucher created successfully.',
    };
  } catch (error) {
    console.error('Error creating voucher:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Get All Vouchers By Page Number

export async function getAllVouchersByPageNo( itemsPerPage, pageNumber) {
  try {
    // Calculate the skip value (how many documents to skip based on the page number)
    const skip = (pageNumber - 1) * itemsPerPage;

    // Fetch the vouchers from the database with pagination
    const vouchers = await db.collection('vouchers')
      .find({})
      .skip(skip)  // Skip documents based on the page number
      .limit(itemsPerPage)  // Limit the number of documents per page
      .toArray();

    if (!vouchers || vouchers.length === 0) {
      return { message: 'No vouchers found', data: [] };
    }

    // Get the total count of vouchers for pagination metadata
    const totalVouchers = await db.collection('vouchers').countDocuments();

    return {
      message: 'Vouchers retrieved successfully',
      data: vouchers,
      pagination: {
        currentPage: pageNumber,
        itemsPerPage,
        totalVouchers,
        totalPages: Math.ceil(totalVouchers / itemsPerPage),
      },
    };
  } catch (error) {
    console.error('Error fetching vouchers with pagination:', error);
    return { message: 'Internal server error', data: [] };
  }
}

// Update Voucher By Voucher Id

export async function updateVoucher(voucherId, updateData) {
  try {
    // Update the voucher in the database
    const result = await db.collection('vouchers').updateOne(
      { _id: new ObjectId(voucherId) }, // Use the voucherId to locate the document
      { $set: updateData } // Set the fields that need to be updated
    );

    if (result.matchedCount === 0) {
      return { message: 'Voucher not found' };
    }

    return { message: 'Voucher updated successfully' };
  } catch (error) {
    console.error('Error updating voucher:', error);
    return { message: 'Internal server error' };
  }
}

// Get Voucher By ID

export async function getVoucherById(voucherId) {
  try {
    const voucher = await db.collection('vouchers').findOne({ _id: new ObjectId(voucherId) });
    return voucher;
  } catch (error) {
    console.error('Error fetching voucher:', error);
    return null;
  }
}


// Delete Voucher

export async function deleteVoucher(voucherId) {
  try {
    const result = await db.collection('vouchers').deleteOne({ _id: new ObjectId(voucherId) });

    if (result.deletedCount === 0) {
      return { status: 0, message: 'Voucher not found' };
    }

    return { status: 1, message: 'Voucher deleted successfully' };
  } catch (error) {
    console.error('Error deleting voucher:', error);
    return { status: 0, message: 'Failed to delete voucher' };
  }
}

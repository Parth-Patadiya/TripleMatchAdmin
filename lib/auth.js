import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import crypto from "crypto";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';

// Encryption key and algorithm (must be kept secure!)
const algorithm = 'aes-256-cbc';
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

const client = await clientPromise;
const db = client.db();

const transporter = nodemailer.createTransport({
  service: "Gmail", // Change to your email provider (e.g., 'SendGrid', 'Outlook')
  auth: {
    user: process.env.NODE_MAILER_EMAIL, // Replace with your email
    pass: process.env.NODE_MAILER_PASSWORD, // Replace with your email password or app-specific password
  },
});

// Function to encrypt the password
export async function hashPassword(password) {
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt the password
export async function decryptPassword(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Function to compare password
export async function comparePasswords(inputPassword, storedPassword) {
  const password = await decryptPassword(storedPassword);
  return inputPassword === password
}

// Function to generate JWT token
export function generateToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// ------------------------------ ADMIN -----------------------------------

// Get Admin
export async function getAdminByEmail(email) {
  return await db.collection('admin').findOne({ email });
}

// Create Admin
export async function createAdmin(name, email, hashedPassword, role) {
  const newUser = await db.collection('admin').insertOne({ name, email, password: hashedPassword, role });
  return newUser;
}

// Get Admin By Id
export async function getAdminById(adminId) {
  if (!ObjectId.isValid(adminId)) {
    return {
      success: false,
      message: 'Invalid Admin ID format',
    };
  }
  const data = await db.collection('admin').findOne({ _id: new ObjectId(adminId) });
  return { success: true, ...data }
}

// Update Admin By Id
export async function updateAdminById(adminId, updateData) {
  try {
    // Validate the admin ID
    if (!ObjectId.isValid(adminId)) {
      return {
        success: false,
        message: 'Invalid admin ID format',
      };
    }

    // Convert the `adminId` string to ObjectId
    const objectId = new ObjectId(adminId);

    // Update the admin by `_id`
    const result = await db.collection('admin').updateOne(
      { _id: objectId },
      { $set: updateData } // Update the fields
    );

    // Check if the admin was updated
    if (result.matchedCount === 0) {
      return {
        success: false,
        message: 'Admin not found',
      };
    }

    return {
      success: true,
      message: 'Admin updated successfully',
    };
  } catch (error) {
    console.error('Error updating admin:', error);
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
  }
}

// ------------------------------ USER -----------------------------------

// Get User By Email
export async function getUserByEmail(email) {
  return await db.collection('users').findOne({ email });
}

// Get User By Id
export async function getUserById(userId) {
  if (!ObjectId.isValid(userId)) {
    return {
      success: false,
      message: 'Invalid user ID format',
    };
  }
  const data = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  
  if(data !== null) { return { success: true, ...data } }

  else return { success: false }
}

// Create User
  export async function createUser(email, hashedPassword, role) {
  const newUser = await db.collection('users').insertOne({ email, password: hashedPassword, role });
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
export async function getUsersByItemPerPage(
  itemsPerPage,
  pageNumber,
  searchQuery = "",
) {
  try {
    // Build the search criteria
    const searchCriteria = {
      $or: [
        // { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for name
        { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for email
        // { mobile: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for mobile
      ],
    };
    // Fetch total user count matching the search criteria
    const totalUsers = await db
      .collection("users")
      .countDocuments(searchQuery ? searchCriteria : {});
    if (totalUsers === 0 || totalUsers < 10) {
      pageNumber = 1;
    }
    // Calculate how many documents to skip
    const skip = (pageNumber - 1) * itemsPerPage;
    // Fetch users matching the search criteria with pagination
    const users = await db
      .collection("users")
      .find(searchQuery ? searchCriteria : {}) // Exclude passwords for security
      .sort({ _id: -1 }) // Sort documents in reverse order
      .skip(skip) // Skip documents for pagination
      .limit(itemsPerPage) // Limit the number of documents returned
      .toArray();

    const decryptedUsers = await Promise.all(users.map(async (user) => {
      if (user.password) {
        user.password = await decryptPassword(user.password); // Decrypt the password
      }
      return user;
    }));

    const totalPages = Math.ceil(totalUsers / itemsPerPage); // Total number of pages


    return {
      users: decryptedUsers,
      totalUsers,
      totalPages,
      currentPage: pageNumber,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Delete User By Id
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

// Update User By Id
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

// Forgot Password
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

// Validate Reset Token
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

// Update Password
export async function updatePassword(token, newPassword) {
  try {
    // Validate inputs
    if (!token || !newPassword) {
      return { success: false, message: 'All fields are required.' };
    }

    const user = await db.collection('users').findOne({ resetToken: token });

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

// ------------------------------ TOKEN -----------------------------------

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
export async function getAllVouchersByPageNo(
  itemsPerPage,
  pageNumber,
  searchQuery = "",
) {
  try {
    // Build the search criteria
    const searchCriteria = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for title
        { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for description
        { validTill: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for validTill
        { amount: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for amount
      ],
    };

    // Get the total count of vouchers matching the search criteria for pagination metadata
    const totalVouchers = await db
      .collection("vouchers")
      .countDocuments(searchQuery ? searchCriteria : {});
    if (totalVouchers === 0 || totalVouchers < 10) {
      pageNumber = 1;
    }

    // Calculate the skip value (how many documents to skip based on the page number)
    const skip = (pageNumber - 1) * itemsPerPage;

    // Fetch the vouchers from the database with pagination and search criteria
    const vouchers = await db
      .collection("vouchers")
      .find(searchQuery ? searchCriteria : {})
      .skip(skip) // Skip documents based on the page number
      .limit(itemsPerPage) // Limit the number of documents per page
      .toArray();

    if (!vouchers || vouchers.length === 0) {
      return { message: 'No vouchers found', data: [] };
    }

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

// Purchase Vouchers
export async function purchaseVouchers(userId, voucherIds, newSignOutActivity) {
  try {
    const user = await getUserById(userId);

    if (!user || !user.success) {
      return {
        status: 0,
        success: false,
        message: 'Invalid user. User not found.',
      };
    }

    // Fetch vouchers from the database based on the provided voucherIds
    const vouchers = await db.collection('vouchers').find({
      _id: { $in: voucherIds.map(id => new ObjectId(id)) }
    }).toArray();

    if (vouchers.length !== voucherIds.length) {
      return {
        status: 0,
        success: false,
        message: 'Some vouchers not found.',
      };
    }

    // Prepare the purchase data with the fetched vouchers
    const newPurchaseData = {
      vouchers: vouchers.map(v => ({
        userId,
        purchaseId: uuidv4(), // Unique purchase ID
        voucherId: v._id,
        title: v.title,
        amount: v.amount,
        validTill: v.validTill,
        status: 'Pending',
        purchaseDate: new Date(),
        deviceDetails: newSignOutActivity
      })),
    };

    // Check if this is the user's first purchase
    const userPurchaseHistory = await db
      .collection('voucherPurchaseHistory')
      .findOne({ userId: new ObjectId(userId) });

    if (!userPurchaseHistory) {
      // If this is the user's first purchase, insert new purchase data
      const result = await db.collection('voucherPurchaseHistory').insertOne({
        userId: new ObjectId(userId),
        purchases: newPurchaseData.vouchers,
      });

      return {
        success: true,
        message: 'First-time purchase history added successfully',
        details: result,
      };
    } else {
      // If the user already has a purchase history, update the purchases array
      const result = await db.collection('voucherPurchaseHistory').updateOne(
        { userId: new ObjectId(userId) }, // Match by userId
        { $push: { purchases: { $each: newPurchaseData.vouchers } } }, // Push new purchases
        { upsert: true } // Create a new document if no match is found
      );

      return {
        success: true,
        message: 'Purchase history updated successfully',
        details: result,
      };
    }
  } catch (error) {
    console.error('Error purchasing vouchers:', error);
    return { success: false, message: 'Failed to process purchase', error: error.message };
  }
}



// Update PurchaseStatus of Voucher by UserID
export async function updateVoucherPurchaseStatus(userId, purchaseId, newStatus) {
  try {
    // Update the status of the specific purchase
    const result = await db.collection('voucherPurchaseHistory').updateOne(
      {
        userId: new ObjectId(userId),
        "purchases.purchaseId": purchaseId, // Match the specific purchaseId
      },
      {
        $set: { "purchases.$.status": newStatus }, // Update the status field
      }
    );

    if (result.modifiedCount > 0) {
      return {
        success: true,
        message: `Purchase status updated to "${newStatus}" successfully.`,
      };
    }

    return {
      success: false,
      message: "No matching purchase found or no changes were made.",
    };
  } catch (error) {
    console.error('Error updating purchase status:', error.message);
    return { success: false, message: error.message };
  }
}

// Get Purchase History By Use ID
export async function getPurchaseByUserId(userId, itemsPerPage, pageNumber, searchQuery = "", status) {
  try {
    // Fetch all purchase history by userId without pagination for filtering
    let purchaseHistory = await db.collection('voucherPurchaseHistory')
      .aggregate([
        {
          $match: { 
            userId: new ObjectId(userId) 
          } // Match the userId in the collection
        },
        {
          $unwind: '$purchases' // Unwind purchases array to get each voucher purchase
        },
        {
          $lookup: {
            from: 'vouchers', // Lookup from the 'vouchers' collection
            localField: 'purchases.voucherId', // Match field in 'voucherPurchaseHistory'
            foreignField: '_id', // Match field in 'vouchers'
            as: 'voucherDetails' // Alias for the matched voucher details
          },
        },
        {
          $unwind: '$voucherDetails' // Unwind the voucher details
        },
        {
          $lookup: {
            from: 'users', // Lookup from the 'users' collection to get user details
            localField: 'userId', // Match userId field from voucherPurchaseHistory
            foreignField: '_id', // Match _id field in users collection
            as: 'userDetails' // Alias for the matched user data
          }
        },
        {
          $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } // Unwind user details
        },
        {
          $project: {
            purchaseId: '$purchases.purchaseId', // Include purchaseId
            title: '$voucherDetails.title', // Include voucher title
            amount: '$voucherDetails.amount', // Include voucher amount
            validTill: '$voucherDetails.validTill', // Include voucher validity
            purchaseDate: '$purchases.purchaseDate', // Include purchase date
            status: '$purchases.status', // Include purchase status
            // name: '$userDetails.name', // Include user name
            email: '$userDetails.email', // Include user email
            // mobile: '$userDetails.mobile', // Include user mobile
          },
        },
      ])
      .toArray(); // Convert the result to an array

    console.log(purchaseHistory);
    
    // Apply search functionality and status filter on the `purchaseHistory` data
    if (searchQuery && searchQuery.trim() !== "") {
      const lowercasedSearchQuery = searchQuery.toLowerCase();
      purchaseHistory = purchaseHistory.filter((history) => {
        // Filter for "Pending" status and apply search query
        if (history.status === status) {
          return (
            // (history.name && history.name.toLowerCase().includes(lowercasedSearchQuery)) ||
            (history.email && history.email.toLowerCase().includes(lowercasedSearchQuery)) ||
            // (history.mobile && history.mobile.toLowerCase().includes(lowercasedSearchQuery)) ||
            (history.title && history.title.toLowerCase().includes(lowercasedSearchQuery))
          );
        }
        return false; // If status is not "Pending", exclude it
      });
    } else {
      // If no search query is provided, only filter by "Pending" status
      purchaseHistory = purchaseHistory.filter(history => history.status === status);
    }

    // Calculate the total number of filtered records
    const totalRecords = purchaseHistory.length;

    // Calculate total pages based on filtered records
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    // Check if the requested page is greater than the total pages
    if (pageNumber > totalPages) {
      return {
        success: true, // Set success to true to indicate successful execution
        message: 'No records found for the given page number',
        data: [],
        pagination: {
          totalRecords: totalRecords,
          itemsPerPage,
          currentPage: pageNumber,
          totalPages,
        },
      };
    }

    // Apply pagination by slicing the filtered purchase history
    const paginatedPurchases = purchaseHistory.slice(
      (pageNumber - 1) * itemsPerPage,
      pageNumber * itemsPerPage
    );

    // Respond with the filtered and paginated purchase histories
    return {
      success: true,
      message: 'Fetched purchase history successfully',
      data: paginatedPurchases,
      pagination: {
        totalRecords: totalRecords,
        itemsPerPage,
        currentPage: pageNumber,
        totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching purchase history by userId:', error);
    return { success: false, message: 'Failed to fetch purchase history by userId', error: error.message };
  }
}

// Get All User's Purchase History 
export async function getAllPurchaseRequest(status) {
  try {
    // Fetch all purchase history records from the voucherPurchaseHistory collection with status filter
    const purchaseHistory = await db
      .collection('voucherPurchaseHistory')
      .aggregate([
        {
          $unwind: '$purchases', // Unwind the `purchases` array to get each voucher purchase
        },
        {
          $match: {
            'purchases.status': status,
          },
        },
        {
          $lookup: {
            from: 'vouchers', // Lookup from the `vouchers` collection to get voucher details
            localField: 'purchases.voucherId', // Field in `voucherPurchaseHistory` to match
            foreignField: '_id', // Field in `vouchers` to match
            as: 'voucherDetails', // Alias for the matched voucher data
          },
        },
        {
          $unwind: '$voucherDetails', // Unwind to get individual voucher details
        },
        {
          $project: {
            userId: 1, // Include userId
            purchaseId: '$purchases.purchaseId', // Include purchaseId
            title: '$voucherDetails.title', // Include voucher title
            amount: '$voucherDetails.amount', // Include voucher amount
            validTill: '$voucherDetails.validTill', // Include voucher validity
            purchaseDate: '$purchases.purchaseDate', // Include purchase date
            status: '$purchases.status', // Include purchase status
          },
        },
      ])
      .toArray(); // Convert the result to an array

    // Return the result with the purchase history data
    return {
      success: true,
      message: 'Fetched all voucher purchases successfully',
      data: purchaseHistory,
    };
  } catch (error) {
    console.error('Error fetching all voucher purchases:', error);
    return { success: false, message: 'Failed to fetch voucher purchases', error: error.message };
  }
}

// ------------------------------ User Activity -----------------------------------


// Update Activity
export async function updateUserActivity(email, activityType, activityDetails) {
  try {
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Define the default activity structure
    const defaultActivity = {
      signIn: [],
      signOut: [],
      playForFun: { win: [], lost: [], restart: [] },
      playForReal: {
        good: { win: [], lost: [], restart: [] },
        rare: { win: [], lost: [], restart: [] },
        epic: { win: [], lost: [], restart: [] },
      },
    };

    // Ensure defaultActivity is set in the database
    const mergedActivity = { ...defaultActivity, ...user.userActivity };
    await db.collection('users').updateOne(
      { email },
      { $set: { userActivity: mergedActivity } }
    );

    // Prepare the update data for `$push`
    const currentDate = new Date();
    let updateData;

    switch (activityType) {
      case 'signIn':
        updateData = {
          $push: { 'userActivity.signIn': { ...activityDetails, date: currentDate } },
        };
        break;
      case 'signOut':
        updateData = {
          $push: { 'userActivity.signOut': { ...activityDetails, date: currentDate } },
        };
        break;
      case 'playForFun':
        if (!['win', 'lost', 'restart'].includes(activityDetails.result)) {
          throw new Error('Invalid result for playForFun');
        }
        updateData = {
          $push: {
            [`userActivity.playForFun.${activityDetails.result}`]: {
              ...activityDetails,
              date: currentDate,
            },
          },
        };
        break;
      case 'playForReal':
        if (!['good', 'rare', 'epic'].includes(activityDetails.level)) {
          throw new Error('Invalid level for playForReal');
        }
        if (!['win', 'lost', 'restart'].includes(activityDetails.result)) {
          throw new Error('Invalid result for playForReal');
        }
        updateData = {
          $push: {
            [`userActivity.playForReal.${activityDetails.level}.${activityDetails.result}`]: {
              ...activityDetails,
              date: currentDate,
            },
          },
        };
        break;
      default:
        throw new Error('Unknown activity type');
    }

    // Push the new activity details
    const result = await db.collection('users').updateOne({ email }, updateData);

    if (result.modifiedCount === 1) {
      return { success: true, message: 'User activity added' };
    } else {
      return { success: false, message: 'No changes to user activity' };
    }
  } catch (error) {
    console.error('Error updating user activity:', error);
    return { success: false, message: 'Internal server error' };
  }
}

// Update Logout Count
export async function updateLogoutActivity(userId) {
  try {
    const user = await getUserById(userId);
    if (!user.userActivity) {
      user.userActivity = { signOut: [] };
    } else if (!user.userActivity.signOut) {
      user.userActivity.signOut = [];
    }

    // Update only the signinCount while keeping other userActivity values intact
    const newSignOutActivity = {
      deviceName: deviceDetails.deviceName,
      deviceModel: deviceDetails.deviceModel,
      operatingSystem: deviceDetails.operatingSystem,
      processorType: deviceDetails.processorType,
      appVersion: deviceDetails.appVersion,
      date: Date.now(), // Add current date and time
    };

    const updatedUserActivity = {
      ...user.userActivity,
      signOut: [...user.userActivity.signOut, newSignOutActivity], // Append to the existing signIn array
    };

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { 'userActivity.signoutCount': 1 } } // Increment field
    );

    if (result.matchedCount === 0) {
      return { message: 'User not found' };
    }

    return { message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating voucher:', error);
    return { message: 'Internal server error' };
  }
}
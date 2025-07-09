const User = require("../models/userModels");
const getNextSequence = require("../utils/autoIncrement");
const createCustomError = require("../utils/errorHelper");
const hashPassword = require("../utils/hashPassword");
const sendEmail = require("../utils/mailHelper");
const logEvent = require('../utils/logger');

const registration = async (req, res, next) => {
  try {
    const { firstName, lastName, email, age, address, phone, password } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !age ||
      !address ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        message:
          "firstName, lastName, age, address, email, phone and password are required",
      });
    }

    // Access uploaded file info in req.file
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // Save image path (relative or absolute) in DB
    const profileImagePath = `/uploads/${req.file.filename}`;

    // Check for duplicate email or phone
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or phone already registered" });
    }

    const hashedPassword = await hashPassword(password); // Use utils

    const { userId, customId } = await getNextSequence("userId", "STC");

    const user = await User.create({
      firstName,
      lastName,
      age: Number(age),
      address,
      email,
      phone,
      password: hashedPassword, // save hashed
      userId,
      customId,
      profileImage: profileImagePath,
    });

    // Try sending email
    try {
      await sendEmail(
        email,
        "🎉 Welcome to STC!",
        `Hello ${firstName},\n\nThank you for registering at STC platform.\nWe're glad to have you onboard!`
      );
    } catch (emailErr) {
      console.error("❌ Failed to send email:", emailErr.message);
      // Optional: log to DB or file for later retry
    }

    // console.log(user);
     logEvent(`User registered: ${email}`);  // Log successful registration
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    logEvent(`Registration failed: ${error.message}`);  // Log error details
    console.error("Error inserting user:", error.message);
    //   res.status(500).json({ message: "Failed to insert user", error });

    // Customize error message and status code
    // const customError = new Error("Failed to insert user");
    // customError.statusCode = 400;

    next(createCustomError("Failed to insert user", 500));
  }
};

const updateUserProfileImage = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      // Delete uploaded file if user not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Profile image file is required" });
    }

    // Optional: Delete old profile image file if exists
    if (user.profileImage) {
      const oldImagePath = path.resolve(user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save new profile image path
    user.profileImage = req.file.path;

    await user.save();

    res
      .status(200)
      .json({
        message: "Profile image updated successfully",
        profileImage: user.profileImage,
      });
  } catch (error) {
    console.error("Error updating profile image:", error);
    next(createCustomError("Server error", 500));
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    // console.log(req.params.id);

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    if (req.user.userId === id && role !== "admin") {
      return res
        .status(400)
        .json({ message: "Admins cannot demote themselves" });
    }

    const user = await User.findOneAndUpdate(
      { userId: id },
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(createCustomError("Server error", 500));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // current page
    const limit = parseInt(req.query.limit) || 10; // items per page
    const skip = (page - 1) * limit;

    // Sorting by age, firstName, address, createdAt
    // sortBy=firstName&order=desc
    // sortBy=address&order=asc

    const allowedSortFields = ["age", "firstName", "address", "createdAt"];
    const sortBy = req.query.sortBy || "createdAt";
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort field" });
    }

    const order = req.query.order === "asc" ? 1 : -1;

    // Build filter object dynamically based on query params
    const filter = {
        isDeleted: false  // default: only show active users
    };

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.age) {
      filter.age = Number(req.query.age);
    }

    if (req.query.firstName) {
      // For partial match, use regex, case-insensitive
      filter.firstName = { $regex: req.query.firstName, $options: "i" };
    }

    const totalUsers = await User.countDocuments(filter); // total users in DB

    const users = await User.find(filter, "-password") // exclude password
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Users fetched successfully",
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    next(createCustomError("Failed to fetch users", 500));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ userId: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    // res.status(500).json({ message: "Failed to fetch user", error });

    next(createCustomError("Failed to fetch user", 500));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.params.id);
    const { firstName, lastName, email, age, address, phone, password } =
      req.body;
    const user = await User.findOneAndUpdate(
      { userId: id },
      { firstName, lastName, email, age, address, phone, password },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    // res.status(500).json({ message: "Failed to update user", error });

    next(createCustomError("Failed to update user", 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find user by userId and update isDeleted
    const user = await User.findOneAndUpdate({ userId: id }, { isDeleted: true, deletedAt: new Date(),}, { new: true});
    if (!user || user.isDeleted===true) {
      return res.status(404).json({ message: "User not found or already deleted:" });
    }
    res.status(200).json({ message: "User soft-deleted successfully", user });
  } catch (error) {
    console.error("Error soft deleting user:", error.message);

    next(createCustomError("Failed to soft delete user", 500));
  }
};

const getDeletedUsers = async (req, res, next) => {
  try {
    const deletedUsers = await User.find({ isDeleted: true });

    res.status(200).json({
      message: "Soft-deleted users fetched successfully",
      users: deletedUsers,
    });
  } catch (error) {
    console.error("Error fetching deleted users:", error.message);
    next(createCustomError("Failed to fetch deleted users", 500));
  }
};

const restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;
        console.log(id);

    const user = await User.findOneAndUpdate(
      { userId: id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found or not deleted" });

    res.status(200).json({ message: "User restored successfully", user });
  } catch (error) {
    console.error("Error restoring user:", error.message);
    next(createCustomError("Failed to restore user", 500));
  }
};



module.exports = {
  registration,
  updateUserProfileImage,
  updateUserRole,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDeletedUsers,
  restoreUser,
};

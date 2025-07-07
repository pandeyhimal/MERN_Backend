const User = require("../models/userModels");
const getNextSequence = require("../utils/autoIncrement");

const registration = async (req, res) => {
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

    const { userId, customId } = await getNextSequence("userId", "STC");

    const user = await User.create({
      firstName,
      lastName,
      age,
      address,
      email,
      phone,
      password,
    });
    user.userId = userId;
    user.customId = customId;
    await user.save();
    console.log(user);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error inserting user:", error.message);
    //   res.status(500).json({ message: "Failed to insert user", error });

    // Optional: Customize error message and status code
    error.statusCode = 400; // or 500, based on the type of error
    error.message = "Failed to insert user";

    // Pass it to the centralized error handler
    next(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    // res.status(500).json({ message: "Failed to fetch users", error });

    error.statusCode = 500;
    error.message = "Failed to fetch users";
    next(error);
  }
};

const getUserById = async (req, res) => {
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

    error.statusCode = 500;
    error.message = "Failed to fetch user";
    next(error);
  }
};

const updateUser = async (req, res) => {
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

    error.statusCode = 500;
    error.message = "Failed to update user";
    next(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ userId: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    // res.status(500).json({ message: "Failed to delete user", error });

    error.statusCode = 500;
    error.message = "Failed to delete user";
    next(error);
  }
};

module.exports = {
  registration,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

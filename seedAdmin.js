// node seedAdmin.js


const mongoose = require("mongoose");
const hashPassword = require("./utils/hashPassword");
const dotenv = require("dotenv");
const User = require("./models/userModels");            // Adjust path if needed

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("❌ Admin already exists. Seeding skipped.");
      process.exit(0);
    }

    const hashedpassword = await hashPassword(process.env.Password);          //  Use secure env password for prod

    const adminUser = new User({
      firstName: process.env.FirstName,
      lastName: process.env.lastName,
      email: process.env.Email,
      password: hashedpassword,
      phone: process.env.Phone,
      address: process.env.Address,
      age: process.env.Age,
      role: "admin",
    });

    await adminUser.save();
    console.log(" First admin created successfully!");
    console.log(` Email: ${adminUser.email}`);
    console.log(` Password: ${process.env.Password}`);
    process.exit(0);
  } catch (err) {
    console.error(" Failed to create admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();

const express = require("express");
const dotenv = require("dotenv");
const User = require("./models/userModels");
const connectDB = require("./dbconfig/dbconnectivity");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/users", userRoutes);
app.use(errorHandler);

// app.post('/register', async (req, res) => {

//     try{

//     const {firstName, lastName, email, age, address, phone, password} = req.body;
//     // console.log(req.body);

//     if (!firstName || !lastName || !age || !address || !email || !phone || !password) {
//         return res.status(400).json({message: 'firstName, lastName, age, address, email, phone and password are required'})
//     }

//     const user = await User.create({
//         firstName, lastName, age, address, email, phone, password});

//         await user.save();
//         console.log(user);

//     res.status(201).json({message: 'User created successfully', user})
// } catch (error){
//     console.error("Error inserting user:", error.message);
//     res.status(500).json({message: "Failed to insert user", error});
// }
// })

app.listen(port, () => console.log(`Server listening on port ${port}!`));

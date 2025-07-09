const express = require('express');
const router = express.Router();
const {registration, updateUserProfileImage,  updateUserRole, getAllUsers, getUserById, updateUser, deleteUser, getDeletedUsers, restoreUser} = require('../controllers/userControllers');
const { login}= require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require("../middlewares/checkRole")
const upload = require("../middlewares/uploadMiddleware");


// public  routes
router.post("/login", login);                       // http://localhost:5000/login
router.post('/register', upload.single("profileImage"), registration );            // http://localhost:5000/register

// Or to update profile image
router.put("/updateuserimage/:id", upload.single("profileImage"), updateUserProfileImage);

// admin only routes
router.get('/getallusers', authenticateToken,checkRole(['admin']), getAllUsers);            // http://localhost:5000/users/getallusers
router.put('/updateuserrole/:id', authenticateToken, checkRole(['admin']), updateUserRole);
router.delete('/deleteuser/:id',authenticateToken, checkRole(['admin']), deleteUser);       // http://localhost:5000/users/deleteuser/id
router.get('/deleted-users', authenticateToken, checkRole('admin'), getDeletedUsers);       // http://localhost:5000/deleted-users
router.put('/restoreUsers/:id', authenticateToken, checkRole('admin'), restoreUser);             // http://localhost:5000/restoreUsers/id


router.get('/getuserbyid/:id', authenticateToken, getUserById);        // http://localhost:5000/users/getuserbyid/id
router.put('/updateuser/:id',authenticateToken, updateUser);          // http://localhost:5000/users/updateuser/id


module.exports = router;

const express = require('express');
const router = express.Router();
const {registration, getAllUsers, getUserById, updateUser, deleteUser} = require('../controllers/userControllers');
const { login}= require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');


router.post("/login", login); // public
router.post('/register', registration );            // http://localhost:5000/users/register

router.get('/getallusers', authenticateToken, getAllUsers);            // http://localhost:5000/users/getallusers
router.get('/getuserbyid/:id', authenticateToken, getUserById);        // http://localhost:5000/users/getuserbyid/id
router.put('/updateuser/:id',authenticateToken, updateUser);          // http://localhost:5000/users/updateuser/id
router.delete('/deleteuser/:id',authenticateToken, deleteUser);       // http://localhost:5000/users/deleteuser/id


module.exports = router;

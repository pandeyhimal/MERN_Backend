const express = require('express');
const router = express.Router();
const {registration, getAllUsers, getUserById, updateUser, deleteUser} = require('../controllers/userControllers');


router.post('/register', registration );            // http://localhost:5000/users/register
router.get('/getallusers', getAllUsers);            // http://localhost:5000/users/getallusers
router.get('/getuserbyid/:id', getUserById);        // http://localhost:5000/users/getuserbyid/id
router.put('/updateuser/:id', updateUser);          // http://localhost:5000/users/updateuser/id
router.delete('/deleteuser/:id', deleteUser);       // http://localhost:5000/users/deleteuser/id


module.exports = router;

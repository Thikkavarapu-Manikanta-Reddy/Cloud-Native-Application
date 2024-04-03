const {authenticate, authNotValid} = require('../middleware/checkAuth');
const express = require('express');
const router = express.Router();
const {getUserDetails, addUser, updateUser, verifyUser}=require('../controllers/user_controllers');
const { addUserValidation, updateUserValidation } = require('../helpers/validateData');
const checkBody = require('../middleware/checkBody');

router.get('/self', checkBody, authenticate, getUserDetails)

router.put('/self', updateUserValidation, authenticate, updateUser)

router.post('/', authNotValid, addUserValidation, addUser)

router.get('/verify', verifyUser)

router.all('/self', (req, res) => {
    return res.status(405).send('Method Not Allowed');
});

router.all('/', (req, res) => {
    return res.status(405).send('Method Not Allowed');
});

module.exports = router
const express = require('express')
// import {User} from '../models';
const { User } = require('../models')
const { createUser, getUserById, updateUser, verifyUser } = require('../controllers/userController')
const BasicAuth = require('../middleware/auth')

const UserRoute = express.Router();

UserRoute.get('/', async (req, res) => {
    const products = await User.findAll()
    res.json(products)
})

UserRoute.get("/:id", BasicAuth, getUserById);

UserRoute.post('/', createUser);

UserRoute.put('/:id', BasicAuth, updateUser);

UserRoute.post('/verify', verifyUser);

module.exports = UserRoute;
// export default UserRoute;
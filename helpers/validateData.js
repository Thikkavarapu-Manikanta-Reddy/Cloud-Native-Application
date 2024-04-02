/*
Reference documentation: https://express-validator.github.io/docs/guides/validation-chain
 */
const { body, validationResult } = require('express-validator');

addUserValidation = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('password').notEmpty().withMessage('Password must not be empty'),
    body('username').notEmpty().isEmail().withMessage('Username must be a valid email address'),
    body().custom(body => {
        const keys = Object.keys(body);
        const allowedKeys = ['first_name', 'last_name', 'password', 'username'];
        return keys.every(key => allowedKeys.includes(key));
    }).withMessage('Attempt to add invalid fields.'),
    (req,res,next)=>{
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json().send();
        }
        next();

    }
]

updateUserValidation = [
    body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
    body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('password').optional().notEmpty().withMessage('Password must not be empty'),
    body().custom(body => {
        const keys = Object.keys(body);
        const allowedKeys = ['first_name', 'last_name', 'password'];
        return keys.every(key => allowedKeys.includes(key));
    }).withMessage('Attempt to update invalid fields.'),
    (req,res,next)=>{
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json().send();
        }
        next();
    }
]

module.exports={addUserValidation, updateUserValidation}
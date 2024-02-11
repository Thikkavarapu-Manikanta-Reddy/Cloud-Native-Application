const { User } = require("../models");
const bcrypt = require("bcrypt");
const { setResponse, setServerError, setRequestError } = require("./utils");

const emailRegex =
    /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;

const createUser = async (req, res) => {

    try {
        
        // check if all required fields are present
        const fields = Object.keys(req.body);
        const requiredFields = ["username", "password", "first_name", "last_name"];
        const missingFields = requiredFields.filter(field => !fields.includes(field));
        if (missingFields.length > 0) {
            return setResponse({ msg: `Missing fields: ${missingFields.join(", ")}` },res,400);
        }

        
        // check if there are any extra fields
        const allowedFields = ["username", "password", "first_name", "last_name", "account_created", "account_updated"];
        const extraFields = fields.filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            return setResponse(
                { msg: `Extra fields: ${extraFields.join(", ")}` },res,400
            );
        }

        // check if username is a valid email address
        if (!emailRegex.test(req.body.username)) {
            return setResponse(
                { msg: "Invalid Email ID. Example ID: abc@xyz.com" },res,400);
        }


        // check if any of first_name, last_name, password are empty
        if (!req.body.first_name || !req.body.last_name || !req.body.password ) {
            return setResponse({ msg: "first_name, last_name, password can't be empty" },res,400);
        }

        // check if user already exists
        const duplicateUser = await User.findOne({
            where: {username: req.body.username}
        })
        if (duplicateUser) {
            return setResponse(
                { msg: "User already exists!,Please try a different email address" }, res, 400
            );
        }

        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(req.body.password, salt);
        const user = User.build({
            username: req.body.username,
            password: securedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
        });
        const savedUser = await user.save();
        // remove password from the res
        const returnUser = {
            id: savedUser.id,
            username: savedUser.username,
            first_name: savedUser.first_name,
            last_name: savedUser.last_name,
            account_created: savedUser.account_created,
            account_updated: savedUser.account_updated,
        };
        setResponse(returnUser, res, 201);
    
    } catch (error) {
        setResponse({msg: error.message}, res, 400);
    }
};


//update a User
const updateUser = async (req, res) => {
    try {
         // check if all required fields are present
        const requestFields = Object.keys(req.body);
        const requiredFields = ["username", "password", "first_name", "last_name"];
        const missingFields = requestFields.filter(field => !requiredFields.includes(field));
        if (missingFields.length > 0) {
            return setResponse({ msg: `Missing fields: ${missingFields.join(", ")}` },res,400);
        }

        
        // check if there are any extra fields
        const allowedFields = ["username", "password", "first_name", "last_name"];
        const extraFields = requestFields.filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            return setResponse(
                { msg: `Extra fields: ${extraFields.join(", ")}` },res,400
            );
        }

        
        // check if any of first_name, last_name, password from request are empty
        const nonEmptyFields = requestFields.filter(
            field => ["first_name", "last_name", "password"].includes(field)
        );
        const emptyFields = nonEmptyFields.filter(field => req.body[field] === "");
        if (emptyFields.length > 0) {
            return setResponse({ msg: "first_name, last_name, password can't be empty" },res,400);
        }

        const id = req.params.id;

        var DBUserObj = await User.findByPk(id);
        // check if username is present in the request body
        // if present, verify it matches the username in the db
        if (DBUserObj.username !== req.body.username) {
            return setResponse({ msg: "Username can't be updated" }, res, 400);
        }

        // // check if id is present in the request body and if it matches the id in the request
        // if (req.body.id) {
        //     if (DBUserObj.id !== req.body.id) {
        //         return setResponse({ msg: "Id can't be updated" }, res, 400);
        //     }
        // }

        var securedPassword = DBUserObj.password;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            securedPassword = await bcrypt.hash(req.body.password, salt);
        }
        const userObj = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: securedPassword,
        };

        // update the user object in the db
        const savedUserObj = await User.update(userObj, { where: { id } });
        // console.log("savedUserObj", savedUserObj);
        if (!savedUserObj) {
            return setRequestError(
                {
                    msg: "Could not update the user",
                },
                res
            );
        }
        return setResponse({ msg: "Updated Successfully" }, res, 204);
    } catch (error) {
        setResponse({ msg: error.message }, res, 400);
    }
};


const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const userObj = await User.findByPk(userId);
        if (!userObj) {
            return setRequestError(
                {
                    msg: "Could not get the user",
                },
                res
            );
        }
        // remove password from the response
        const user = {
            id: userObj.id,
            username: userObj.username,
            first_name: userObj.first_name,
            last_name: userObj.last_name,
            account_created: userObj.account_created,
            account_updated: userObj.account_updated,
        };
        return setResponse(user, res);
    } catch (error) {
        // console.log(error);
        return setServerError(
            {
                msg: "Internal server error",
            },
            res
        );
    }
};

module.exports = {
    createUser,
    updateUser,
    getUserById,
};

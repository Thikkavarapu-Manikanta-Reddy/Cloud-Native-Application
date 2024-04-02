const { User } = require("../models");
const bcrypt = require("bcrypt");
const { setResponse} = require("../controllers/utils");

const decodeEmailPassword = (req) => {
    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    return [email, password];
}


const BasicAuth = async (req, res, next) => {
    // check if authorization header is present
    if (
        !req.headers.authorization ||
        req.headers.authorization.indexOf("Basic ") === -1
    ) {
        return setResponse({msg: "Missing Authorization Header"}, res, 401);
    }
    
    const [email, password] = decodeEmailPassword(req);

    // if email and password are null
    if (email == "" || password == "") {
        return setResponse({msg: 'Bad Request'}, res, 400);
    }

    //get user with emailid
    const user = await User.findOne({ where: { username: email } });
    if (!user) {
        return setResponse({msg: "User not found"}, res, 401);
    }

    // verify password
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
        return setResponse({msg: "Password not matching"}, res, 401);
    }

    // verify if user is trying to access his own account
    if (req.params.id) {
        if (user.id != req.params.id) {
            return setResponse({msg: "Forbidden Resource"}, res, 403);
        }
    }

    if(process.env.NODE_ENV != 'development') {
        if (user.emailVerified) {
            next();
        }
    
        return setResponse({msg: "User email not verified"}, res, 403);
    }
    else {
        next();
    }
};

module.exports = BasicAuth;

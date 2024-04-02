const User = require('../models/User');
const bcrypt = require('bcrypt');

const authenticate = async(req,res,next)=>{
    const header = req.headers['authorization'] || '';
    const [type, payload] = header.split(' ');

    if (type === 'Basic') {
        const decodedPayload = Buffer.from(payload, 'base64').toString();
        const [email, password] = decodedPayload.split(':');

        try {
            const user = await User.findOne({ where: { username: email } });
            if (!user) return res.status(401).json().send();

            const match = await bcrypt.compare(password, user.password);
            if (match && user.emailVerified) {
                req.user = user;
                return next();
            }
        } catch (error) {
            return res.status(503).json().send();
        }
    }

    return res.status(403).json({msg :"Email is not verified"}).send();

}

const authNotValid =async(req,res,next)=>{
    if(req.headers['authorization']){
        return res.status(400).json().send();
    }
    next();
}

module.exports={authenticate, authNotValid}
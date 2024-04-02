const User = require('../models/User');
const EmailLog = require('../models/EmailLog');
const passwordGenerator = require('../helpers/passwordGenerator');
const logger = require('../util/logger');
const publishMessageToPubSub = require('../helpers/gcpPubMsg');
const crypto = require('crypto');

const getUserDetails = async(req, res)=>{
    try {
        
        if (req.user) {
            const result = req.user.toJSON();
            delete result.password;
            logger.info("User details fetched");
            return res.status(200).json(result).send();
        } else {
            logger.error("User doesnt exist");
            return res.status(404).json().send();
        }
    } catch (error) {
        logger.error("Cannot fetch user details")
        return res.status(400).json().send();
    }
}

const updateUser = async(req,res) =>{
    const userData = req.body;
    try {
        if(userData.password){
            userData.password = await passwordGenerator(userData.password)
        }
        const [updated] = await User.update(userData, {
            where: { id: req.user.id }
        });
        if (updated) {
            logger.info("User updated successfully")
            return res.status(204).json().end();
        } else if(!updated) {
            logger.error("User couldnt be updated")
            res.status(404).json().send();
        }
    } catch (error) {

        logger.error("Bad request")
        res.status(400).json().send();
    }

}

const addUser = async(req, res) =>{
    const {username, password} = req.body;

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            logger.error("User already exists")
            return res.status(409).json().send();
        }
        const generatedPassword = await passwordGenerator(password)
        const verificationCode = crypto.randomBytes(6).toString('hex');

        const user = await User.create({
            ...req.body,
            password: generatedPassword,
            verifyCode :verificationCode
        });
        await user.save();
        const result = user.toJSON();
        delete result.password;
        if(process.env.NODE_ENV!="test"){
            await publishMessageToPubSub(username, verificationCode);
        }
        logger.info("User creation successful")
        return res.status(201).json(result).send();
    } catch (error) {
        logger.error("Bad request")
        return res.status(400).json().send();
    }

}

const verifyUser = async(req,res)=>{
    const { email, token } = req.query;

    try {

        const user = await User.findOne({ where: { username: email, verifyCode: token , emailVerified: false} });
        const maillog = await EmailLog.findOne({where:{email}})

        if (!user) {
        return res.status(400).send('Invalid verification code or email.');
        }

        const expirationTime = new Date(maillog.email_sent);
        expirationTime.setMinutes(expirationTime.getMinutes() + 2);
        if (Date.now() > expirationTime) {

            const newVerificationCode = crypto.randomBytes(6).toString('hex');
            user.verifyCode = newVerificationCode;
            maillog.email_sent = Date.now();
            await user.save();
            await maillog.save();
            const result = user.toJSON();
            delete result.password;

            await publishMessageToPubSub(email, newVerificationCode);

            return res.status(400).send('Verification code has expired. A new verification email has been sent.');
        }

        // Mark the user as verified
        user.emailVerified = true;
        await user.save();

        res.status(200).send('Verification successful. You can now access your account.');
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).send('Error verifying user.');
    }
}


module.exports={getUserDetails, updateUser, addUser, verifyUser}
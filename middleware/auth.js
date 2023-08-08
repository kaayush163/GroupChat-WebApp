const jwt = require("jsonwebtoken");
const User = require('../models/signup');

const authenticate = async(req, res, next) => { 

    try {
        const token = req.header('Authorization') ; 
        //console.log(token);
        const user = jwt.verify(token,process.env.JWT_TOKEN); //in verify we have to decrypt userid with help of secret key THIS IS DECRYPTION
        console.log('userId>>>>>',user.userId);       ///1,2,3 this userId we created on controller signin same userId name should be written here
        if(!user.userId){
            throw new Error('Invalid user id');
        }
        await User.findByPk(user.userId).then(user=>{
            console.log(JSON.stringify(user));
            req.user=user;
            next();
        }).catch(err=>{
            throw new Error(err);
        })
    } 
    catch (err) 
    {
        //console.log(err);
        return res.status(401).json({ error:"problem in auth.js", success: false });
    }
};

module.exports = { authenticate };

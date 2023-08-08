const User = require('../models/signup');
const bcrypt = require('bcrypt')   
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const generateAccessToken = (id,name) => {          
    return jwt.sign({userId : id, name: name}, process.env.JWT_TOKEN);  
  }

function isEmpty(a){
    if(a == undefined || a.length === 0){
        return true;
    }
    else{
        return false;
    }
}

exports.signUp = async(req,res) => {
    try{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phoneno = req.body.phoneno;
    const ifuserExist = await User.findAll({ where:{ email:email }});

    console.log("See if user already present>>>",ifuserExist)
    if(isEmpty(name) || isEmpty(email) || isEmpty(phoneno) || isEmpty(password)){
        return res.status(400).json({message: "Please fill the details Completely"});
    }
    else if(ifuserExist && ifuserExist.length){
        return res.status(404).json({message: "User Already exists.Please go to Login Page"});
    }
    else{
        bcrypt.hash(password, 10, async (err, hash) => {     
            if (err) {
              res.json({ message: "Unable to create new user" });
            }else{
              await User.create({ 
               name:name, 
               email:email,
               phoneno: phoneno,
               password: hash
               
              })
              return res.status(201).json({ message: "User Signup successful",success:true});
            } 
          })
        }
    }
    catch(err) {
        return res.status(500).json({success:false, message:"Couldn't create user"});
    }
}


exports.signIn = async(req,res) => {

    try{
        const { email, password} = req.body;

        if(isEmpty(email) || isEmpty(password)){
            return res.status(400).json({err: "You haven't fill the data properly.Something is missing!!!"});
          }
        else{
        const ifuserExist = await User.findAll({where : { email }});
          console.log('CHECK IF USER EXIST>>>>',ifuserExist[0].dataValues.name);
          if(ifuserExist){
            bcrypt.compare(password, ifuserExist[0].dataValues.password, (err, result) => {
                if(err) {
                    throw new Error("Something went WRONG!!!");
                }
                if(result) {
                    return res.status(201).json({
                        message:"User Logged-In successfully",
                        success: true,
                        token: generateAccessToken(ifuserExist[0].dataValues.id, ifuserExist[0].dataValues.name)     
                    });
                } else {
                    return res.status(401).json({message:"Please enter the correct Password", success:false});
                }
            })
        } else if(!ifuserExist){
            return res.status(404).json({error: "User doesn't exist. Try with different email",
              success: false, 
              message: "User doen't exist"
            });
           }
      }
    }

    catch(err) {
        return res.status(500).json({success:false, message:"Some Internal Problem has occured"});
    }
}


exports.getUsers = async(req,res) => {

    try{
        const all = await User.findAll({
            where:{
                id:{
                    [Op.ne]: req.user.id
                }
            }
        });
        console.log(all);

        return res.status(201).json(all);
    }
    catch (err) {
        console.log(err, "not able to get details of users");
        return res.status(500).json(err);
    }
}
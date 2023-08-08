const express=require('express');
const router=express.Router();

const controller=require('../controllers/signupController');
const userAuthenticate=require('../middleware/auth');

router.post('/signup',controller.signUp);
router.post('/signin',controller.signIn);
router.get('/get-users',userAuthenticate.authenticate,controller.getUsers)

module.exports=router;
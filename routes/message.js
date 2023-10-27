const express= require('express');
const routes=express.Router();
const multer=require('multer')

const userAuthenticate=require('../middleware/auth')
const Userchat=require('../controllers/messageController');
const upload=multer();
//for uploading files use multer 

routes.post('/sendmessage',userAuthenticate.authenticate,Userchat.addMessage);
routes.get('/:groupId',userAuthenticate.authenticate,Userchat.getMessages);
routes.post('/upload/:groupId',userAuthenticate.authenticate,upload.single('file'),Userchat.uploadFile)

module.exports=routes;

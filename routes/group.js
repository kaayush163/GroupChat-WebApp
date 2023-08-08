const express= require('express');
const routes=express.Router();

const userAuthenticate=require('../middleware/auth');
const Groupcontroller=require('../controllers/groupController');

routes.post('/groups',userAuthenticate.authenticate,Groupcontroller.createGroup);
routes.get('/groups',userAuthenticate.authenticate,Groupcontroller.getAllGroups);
routes.post('/groups/addmembers',userAuthenticate.authenticate,Groupcontroller.addUserToGroup);
routes.post('/groups/removemembers',userAuthenticate.authenticate,Groupcontroller.removeUserFromGroup);
routes.patch('/groups/changeAdmin',userAuthenticate.authenticate,Groupcontroller.changeGroupAdmin);
routes.delete('/groups/deletegroup/:id',userAuthenticate.authenticate,Groupcontroller.deletGroup)

module.exports=routes;
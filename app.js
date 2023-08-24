const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const app = express();
const httpServer = require("http").createServer(app);
require('dotenv').config();


const sequelize=require('./util/database')

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const socketio = require("socket.io")
const io = socketio(httpServer,{cors:{origin:'*'}});

io.on('connection', socket => {
  socket.on('message',(msg,userName,groupId,userId) => {
    socket.broadcast.emit('message', msg,userName,groupId,userId)
  });
  socket.on("file",(message,userName,groupId,userId)=>{
    socket.broadcast.emit("file",message,userName,groupId,userId)
  })
});

app.use(cors({origin:'*'}));

const userRouter = require('./routes/signup');
const messageRouter=require('./routes/message');
const groupRouter=require('./routes/group');

app.use('/users',userRouter);
app.use('/chat',messageRouter);
app.use(groupRouter);

const User=require('./models/signup');
const Message=require('./models/message');
const Group = require('./models/group')
const GroupMember = require('./models/groupmember');

User.hasMany(Message);
Message.belongsTo(User);


User.belongsToMany(Group,{through:GroupMember});
Group.belongsToMany(User,{through:GroupMember});

Group.hasMany(Message);
Message.belongsTo(Group);



sequelize.sync()
.then(()=>{
      console.log('sync');

      httpServer.listen(5000, (err) => {
        if (err){
            console.log(err);
        } 
        console.log("Server is listening for requests");
      });

    //   app.listen(5000);
  }).catch((err)=>console.log(err,'error in app.js file'));

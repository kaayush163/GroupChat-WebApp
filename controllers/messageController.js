
const Message=require('../models/message');
const AWS = require('aws-sdk');
        
const addMessage=async (req,res)=>{
    try{
        const {message,groupId}=req.body;
        await Message.create({ message,name:req.user.name,userId:req.user.id,groupId,type:'text' });
        const newMessage={message,name:req.user.name,userId:req.user.id}
        res.status(200).json({newMessage,msg:'Message Sent Successfully',success:true})    
    }catch(error){
        res.status(500).json({error})
    }
}

const getMessages=async(req,res)=>{       
   try {
      const groupId=req.params.groupId;
      const data=await Message.findAll({where:{groupId}});
      res.status(202).json({allGroupMessages:data,success:true})
   } catch(error) {
      res.status(500).json({msg:'Sorry! Something went Wrong',error})
   }
}

const uploadFile=async(req,res,next)=>{
    // console.log('requests',req);
    // const file=req.file;
    // console.log('file info>>>>',file);
    // console.log('file buffer>>',file.buffer);
    
    // console.log('user id:::::',userId);
      try{
          // const filename=`images/${new Date()}.jpg`;
          const {groupId}=req.params;
          const userId=req.user.id;
          const userName=req.user.name;
          const filename=req.file.originalname;
          console.log('filename>>>',filename);

          const fileUrl=await uploadToS3(req.file.buffer,filename);
          await Message.create({
            groupId,
            userId,
            message:fileUrl,
            name:userName,
            type:'file'
          })
          const userFile={
            message:fileUrl,
            name:userName,
            userId
          }
          return res.status(200).json({userFile,success:true});
      }catch(err){
          console.log(err)
          res.status(400).json({message:'failed to upload'})
      }
}


const uploadToS3 =async (data, filename) => {
    const BUCKET_NAME = process.env.S3_BUCKET_NAME;
   const IAM_USER_KEY = process.env.S3_ACCESS_KEY;
     const IAM_USER_SECRET = process.env.S3_SECRET_KEY;
  
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });
    
    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read'
    };
  
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, response) => {
        if (err) {
          console.log('Something went wrong with uploading data to S3:', err);
          reject(err);
        } else {
          console.log('Successfully uploaded to S3:', response);
          resolve(response.Location);
        }
      });
    });
  };

module.exports={addMessage,getMessages,uploadToS3,uploadFile}
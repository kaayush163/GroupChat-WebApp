const User=require('../models/signup');
const Message=require('../models/message');
const Group = require('../models/group');
const GroupMember = require('../models/groupmember');
const sequelize = require('../util/database');     ///for rollback commit transaction delete group     

async function createGroup(req,res){
    try {
        const {groupname}=req.body;
        const group=await Group.create({groupname,admin:req.user.id} );
        await GroupMember.create({groupname,admin:req.user.id,groupId:group.id,userId:req.user.id});

        res.status(201).json({msg:`Successfully Created group ${groupname}`}) 
    } catch (error) {
        res.status(500).json({msg:"No Group created",error})    
    }
}

async function getAllGroups(req,res){
    try 
    {
        const groups=await GroupMember.findAll({
          where: {
              userId: req.user.id
          }
      })
      console.log('groupmember>>>',groups);
      res.status(201).json({groups,success:true})
        
    } 
    catch (error) 
    {
        res.status(500).json({msg:'Cannot Get Groups',error})
        
    }
}

async function addUserToGroup(req,res){   
  try 
  {
    const email=req.body.memberEmail;
    const groupId=req.body.groupid
    const user=await User.findOne({where: {email}});
    const group=await Group.findOne({where:{id:groupId}})
      if(!user)   
      return res.status(404).json({msg:"No user Registered with that email",success:false});
      
      const member=await GroupMember.findOne({where:{groupId,userId:user.id}})
      if(member) 
      return res.status(404).json({msg:"User Already present in the group",success:false})
       
      await GroupMember.create({groupname:group.groupname,admin:0,groupId,userId:user.id});
      res.status(201).json({msg:"User Added Successfully",success:true})
  } 
  catch (error) 
  {
      res.status(500).json({msg:"Error ,Please try again",success:false,error})
    
  }
}

async function removeUserFromGroup(req,res){
  try 
  {
    const email=req.body.memberEmail;
    const groupId=req.body.groupid
    const user=await User.findOne({where: {email}});
    if(!user)   
      return res.status(404).json({msg:"No user Registered with that email",success:false});
      
    const member=await GroupMember.findOne({where:{groupId,userId:user.id}})
    if(!member) 
      return res.status(404).json({msg:"User, not a Member in the group",success:false})
       
    await GroupMember.destroy({where:{groupId,userId:user.id}} );
    return res.status(201).json({msg:"Member Removed Successfully",success:true})
  } 
  catch(error) 
  {
      res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})  
  }
}


//make group admin
async function changeGroupAdmin(req,res){
  try 
  {
    const email=req.body.memberEmail;
    const groupId=req.body.groupid;
    const user=await User.findOne({where: {email}});
      if(!user)   
      return res.status(404).json({msg:"No user Registered with that email",success:false});
      
      const member=await GroupMember.findOne({where:{groupId,userId:user.id}})
      if(!member) 
      return res.status(404).json({msg:"User not a Member in the group",success:false})
       
      // await Group.update({admin:user.id},{where:{id:groupId}});
      console.log('checkadmin',member.admin);
      if(member.admin)
      return res.status(404).json({msg:"User is already an admin",success:false})
    
      await GroupMember.update({admin:user.id},{where:{groupId,userId:user.id}});

      res.status(201).json({msg:"Admin Change Successfull",success:true})
  } 
  catch (error) 
  {
      res.status(500).json({msg:"Error ,Please try again",success:false,error})
    
  }
}

async function deletGroup(req,res){
    // transactions
    const t = await sequelize.transaction();
    try {
        const {id}=req.params;
        await Group.destroy({where:{id}},{transaction : t});
    
        await GroupMember.destroy({where:{groupId:id}});
        
        await Message.destroy({where:{groupId:id}});
        await t.commit();
        res.status(201).json({msg:"Group Deleted Successsfully"})
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})   
    }

}
module.exports={createGroup,getAllGroups,addUserToGroup,removeUserFromGroup,changeGroupAdmin,deletGroup}

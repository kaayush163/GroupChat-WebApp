
const socket = io.connect("http://localhost:5000");
socket.on("message",(msg,userName,groupId,userId) =>{
     if(localStorage.getItem('currentGroupId')){
      let grpId=localStorage.getItem('currentGroupId');
      let token = localStorage.getItem('token')
      let currentUser=parseJwt(token)

      if(groupId == grpId){
        const chats=document.getElementById('chat-messages');
        const newPara = document.createElement('li');
        newPara.innerText = `${userName}: ${msg}`;
        chats.appendChild(newPara);
      }
     }
});


socket.on("file",(message,userName,groupId,userId) => {
  if(localStorage.getItem('currentGroupId')){
    let grpId=localStorage.getItem('currentGroupId');
    const token = localStorage.getItem('token')
    let currentuser=parseJwt(token);
    const chats=document.getElementById('chat-messages'); 

    if(groupId == grpId){
        let newpara=document.createElement('li');
        let fileLink = document.createElement('a');
        fileLink.href=message;
        fileLink.innerText="click to see(download)";

        newpara.appendChild(document.createTextNode(`${userName}:`))
        newpara.appendChild(fileLink);
        chats.appendChild(newpara)
    }  
  }
})

//domcontent
window.addEventListener('DOMContentLoaded',async()=>{
    displayGroupLeft();
    loadchats();
  
})

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

async function createGroup(){
        const groupname=prompt("Enter the New Group Name:")
        console.log(groupname);
        try {
        if(groupname){
            const token=localStorage.getItem('token');
            const res=await axios.post('http://localhost:5000/groups',{groupname},{headers:{"Authorization":token}})
            console.log(res.data.msg);
            showMessageDiv(res.data.msg);   ///come from backend
            displayGroupLeft();
            }
            
            if(groupname==null){
                console.log('no groupcreated')
                showMessageDiv('no groupcreated')
            }
        } catch (error) {
           console.log(error);
            showMessageDiv(error.response.data.msg) 
        }
}

function showMessageDiv(msg){
    alert(`${msg}`);
}

async function getAllgroups(){
  try {
    const token =localStorage.getItem('token');
    const res=await axios.get('http://localhost:5000/groups',{headers:{"Authorization":token}})
    console.log(res.data);
    return res.data.groups;
  } catch (error) {
    // alert('Go back to Login Page');
    document.body.innerHTML+=`<div style="color: red;text-align: center;">
                                   <h3>${error}</h3>
                              </div>`
  }
}

async function displayGroupLeft(){
  try {
    console.log(parseJwt(localStorage.getItem('token')));  //it return an object contain iat, userId, name
        const userId=parseJwt(localStorage.getItem('token')).userId;
        const groups=await getAllgroups();   ///store as an array of objects of group list for a particular user authentiacated
        console.log(groups);
        let ul=document.createElement('ul')
        for(let i in groups)      ///i=0 to groups length this is also the way of writing for(let i=0;i<groups.length;i++)
        {
            let li =document.createElement('li');
            let line = document.createElement('li');
            li.setAttribute('groupId',groups[i].groupId);
            li.setAttribute('admin',groups[i].admin);
            if(groups[i].admin===userId) console.log(true);
            // li.textContent=groups[i].groupname;
            let openChatbutton=document.createElement('button');
            openChatbutton.className='btn-same'
            openChatbutton.textContent=groups[i].groupname;
            openChatbutton.style.backgroundColor ="black"
            openChatbutton.style.padding = '3px';
            openChatbutton.style.width = '20%'
            openChatbutton.style.color = "white"
            openChatbutton.addEventListener('click',groupchatpage)
            li.appendChild(openChatbutton);
            if(groups[i].admin===userId)    ////if group admin matches with userId then only to show the buttons of rem,add, del,makethis admin comes from backend getAllgroups we ares etting admin to user id then only we can know the users is a groups admin of a particular group or not
            {
                let addButton = addMemButton();
                let delButton = remMemButton(); 
                let adminButton = makeAdminButton();
                let delGrpButton = delGroupButton();
                
                li.appendChild(addButton);
                li.appendChild(delButton);
                li.appendChild(adminButton);
                li.appendChild(delGrpButton);   ///li is list or row to store all the buttons
            }  
                ul.appendChild(li);
                ul.appendChild(line);   
            }      
            document.getElementById('allgrouplist').innerHTML='';
            document.getElementById('allgrouplist').appendChild(ul);
    
    } catch (error) {
        // document.body.innerHTML+=`<div style="color: red;text-align: center;">
        //                         <h3>${error}</h3>
        //                         </div>`
        document.body.innerHTML+=`<div style="color: red;text-align: center;">
                                <h3>UnAuthorized User Go back to Login Page!!!</h3>
                                </div>`
       window.location.href = "../Login/login.html";
    }
}

function addMemButton(){
  let addButton=document.createElement('button');
  addButton.className="btn-same";
  addButton.textContent="Add-User";
  addButton.addEventListener('click',addMembers);

 return addButton;

}

async function addMembers(e){
  e.preventDefault();
  console.log(e.target.parentElement);
  const memberEmail=prompt('Enter Member Email')
  
  try {
    let data={
      groupid:e.target.parentElement.getAttribute('groupId'),
      memberEmail
    }
    if(memberEmail){
      let token=localStorage.getItem('token');
      const res=await axios.post('http://localhost:5000/groups/addmembers',data,{headers:{"Authorization":token}})
      showMessageDiv(res.data.msg)
    }
    else{
      console.log('Not want to add right now')
      // showMessageDiv('Please Enter Email Try again !!')
    }
    
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }
}

function remMemButton(){
  let delButton=document.createElement('button');
  delButton.textContent="Rem-User";
  delButton.className="btn-same";  ///for css design
  delButton.addEventListener('click',RemoveMember);

  return delButton;
}

async function RemoveMember(e){
  e.preventDefault();
  const memberEmail=prompt('Enter Member Email You want to remove')
  console.log(e.target.parentElement);
  try {
    let data={
      groupid:e.target.parentElement.getAttribute('groupId'),
      memberEmail
    }
    if(memberEmail){
      let token=localStorage.getItem('token');
      const res=await axios.post('http://localhost:5000/groups/removemembers',data,{headers:{"Authorization":token}})
      showMessageDiv(res.data.msg)
    }
    else{
      console.log("no memeber");
      // showMessageDiv('Please Enter Email Try again !!')
    }
    
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }
}

function makeAdminButton(){
  let adminButton=document.createElement('button');
  adminButton.className="btn-same"
  adminButton.textContent="Make-Admin";
  adminButton.addEventListener('click',changeAdmin);

  return adminButton;
}

async function changeAdmin(e){
  e.preventDefault();
  const memberEmail=prompt('Now, Who will be the new admin of this Group? Type his/her Email below')
  try {
    let data={
      groupid:e.target.parentElement.getAttribute('groupId'),
      memberEmail
    }
    if(memberEmail){
      let token=localStorage.getItem('token');
      const res=await axios.patch('http://localhost:5000/groups/changeAdmin',data,{headers:{"Authorization":token}})
      showMessageDiv(res.data.msg)
      displayGroupLeft();
    }
    else{
      console.log("no memeber");
      // showMessageDiv('Please Enter Email Try again !!')
    }
    
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }
}

function delGroupButton(){
  let delGroupButton=document.createElement('button');
  delGroupButton.className="btn-same";
  delGroupButton.textContent="Del-Grp";
  delGroupButton.addEventListener('click',removeGroup)

  return delGroupButton;
}
async function removeGroup(e){
  e.preventDefault();
  try {
    if(confirm('You sure want to delete this group?')){
      const groupid=e.target.parentElement.getAttribute('groupId');
  
      let token=localStorage.getItem('token');
      const res=await axios.delete(`http://localhost:5000/groups/deletegroup/${groupid}`,{headers:{"Authorization":token}})
      displayGroupLeft();
      showMessageDiv(res.data.msg)
    }
    else{
      console.log('Group Not deleted');
    }
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }
}


async function groupchatpage(e){
    e.preventDefault();
    let groupId=e.target.parentElement.getAttribute('groupId');
    document.getElementById('chat-messages').style.visibility="visible";
    document.getElementById('user-input').style.visibility='visible';
    localStorage.setItem('currentGroupId',groupId);
    loadchats();
    filesend();

}


async function loadchats(){
    const token = localStorage.getItem('token');
    const groupId=localStorage.getItem('currentGroupId');
    try {
        const res=await axios.get(`http://localhost:5000/chat/${groupId}`,{headers:{"Authorization":token}}); 
        console.log(res.data.allGroupMessages);
        displayChats(res.data.allGroupMessages);

    } catch (error) {
        
        // showMessageDiv(error.response.data.msg)
    
        console.log(error);
    }

}


async function displayChats(allgroupchats){
  try {
        const token = localStorage.getItem('token');
        const currentUser = parseJwt(token);
        const chats = document.getElementById('chat-messages');
        chats.innerHTML = '';
        
        console.log(allgroupchats);

        if(allgroupchats.length>10){
        allgroupchats=allgroupchats.slice(allgroupchats.length-10)
        }  
        for (const chat of allgroupchats) {
            const newPara = document.createElement('li');
           if(chat.type == 'text'){
            if (chat.userId === currentUser.userId) {
                newPara.innerText = `You: ${chat.message}`;
            } else {
                newPara.innerText = `${chat.name}: ${chat.message}`;
              }

            }
            else{
            let fileLink = document.createElement('a');
            fileLink.href=chat.message;
            fileLink.innerText="click to see(download)";
            
            if(chat.userId == currentUser.userId){
                newPara.appendChild(document.createTextNode(`You:`))
            }
            else{
                newPara.appendChild(document.createTextNode(`${chat.name}:`))
            } 
            newPara.appendChild(fileLink);
        }
        
        chats.appendChild(newPara);
        }  
    } catch (error) {
        console.log(error);
        showMessageDiv(error.response.data.msg)
    }
}

async function userMessagestore(event){
  event.preventDefault();
  try {
        const msg=document.getElementById('message-input').value;
        document.getElementById('message-input').value='';
        const token = localStorage.getItem('token');
        const groupId=localStorage.getItem('currentGroupId');
        const data={message:msg,groupId}
        const res=await axios.post(`http://localhost:5000/chat/sendmessage`,data,{headers:{"Authorization":token}}); 
        const groupMsg=res.data.newMessage;
        showpostmsg(res.data.newMessage)
        socket.emit("message",msg,groupMsg.name,groupId,groupMsg.userId); 
    } catch (error) {
        console.log(error);
    }
}

function showfilelink(userFile){
    const token = localStorage.getItem('token')
    let currentuser=parseJwt(token);
    const chats=document.getElementById('chat-messages'); 
    let newpara=document.createElement('li');
    let fileLink = document.createElement('a');

    fileLink.href=userFile.message;
    fileLink.innerText="click to see(download)";

    if(userFile.userId == currentuser.userId){
        newpara.appendChild(document.createTextNode(`You:`))
    }
    else{
        newpara.appendChild(document.createTextNode(`${userFile.name}:`))
    }
    newpara.appendChild(fileLink);
    chats.appendChild(newpara)
}

function showpostmsg(newMsg){
    console.log(newMsg);
    const token = localStorage.getItem('token');
    const  currentUser=parseJwt(token);
    const chats=document.getElementById('chat-messages');
    const newPara = document.createElement('li');
    if (newMsg.userId === currentUser.userId) {
        newPara.innerText = `You: ${newMsg.message}`;
    } else {
        newPara.innerText = `${newMsg.name}: ${newMsg.message}`;
    }
    chats.appendChild(newPara);
}

async function filesend(){
  try{
      const fileInput = document.getElementById('sendAttachmentButton');     
      fileInput.addEventListener('change', async (e) => {
          e.preventDefault();
          const Selected_file = fileInput.files[0];
          console.log(Selected_file);
          // const attachment = document.getElementById('file');
          // const file = attachment.files[0];
  
          if (Selected_file) {
          const token = localStorage.getItem('token');
          const groupId=localStorage.getItem('currentGroupId');
          console.log(groupId);

          const formData = new FormData();
          console.log(formData);
          // formData.append('file', file);
          formData.append('file', Selected_file);
          console.log(formData)
  
          const res = await axios.post(`http://localhost:5000/chat/upload/${groupId}`,formData,{headers:
          {'Content-Type': 'multipart/form-data',
          'Authorization': token
           }
          })
          console.log(res);
          showfilelink(res.data.userFile);   //this userFile we are getting from backend where we have send url to database and we created object userFile
          socket.emit("file",res.data.userFile.message,res.data.userFile.name,groupId,res.data.userFile.userId) 
          }
      });
  }
  catch(err){
      throw new Error;
  }
}

function userdetails(){
  window.location.href = '../UserDetail/userdetail.html';
}

const logout = document.getElementById("logout");
 logout.addEventListener("click",() => {
   let nothing="";
   localStorage.setItem('token',nothing);
   window.location.href = "../Login/login.html";
 })
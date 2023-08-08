let ID;
let url = "http://localhost:5000/users";
const myForm = document.getElementById("my-form");
const UserName = document.getElementById("name");
const PassWord = document.getElementById("password");
const Email = document.getElementById("email");
const Phone = document.getElementById("phoneno");

myForm.addEventListener("submit", onSubmit);
async function onSubmit(e) {
try{
   e.preventDefault();
    const name = UserName.value;
    const password = PassWord.value;
    const email = Email.value;
    const phoneno = Phone.value;
    UserName.value = "";
    PassWord.value = "";
    Email.value = "";
    Phone.value = "";

    let myObj = {
      name:name,
      email:email,
      phoneno:phoneno,
      password:password
    };

    let res = await axios.post(`${url}/signup`, myObj)
    console.log(res);
     if(res.status === 201){
        alert(res.data.message);
        window.location.href = "./Login/login.html"
    }
    else{
         throw new Error('Failed to Sign up');
    }
}
catch(err){
    console.log(err.response);
  
  if(err.response.status === 400 && t == 0){
    t++;
    //console.log(err.response.data.err);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.message}</div>`;
      fillprop.appendChild(ele);
  }
  else if(err.response.status === 404 && t == 0){
    t++;
    //console.log(err.response);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.message}</div>`;
      fillprop.appendChild(ele);
  }
    
  else if(err.response.status === 500 && t == 0){
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.message}</div>`;
      fillprop.appendChild(ele);
    document.body.innerHTML += `<div style = 'color:red;'>${err}</div>`;
  }
    
    }
}

let t= 0;
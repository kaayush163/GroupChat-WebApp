let url = "http://localhost:5000/users";
const myForm = document.getElementById("my-form");
const PassWord = document.getElementById("password");
const Email = document.getElementById("email");

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
try{
   e.preventDefault();
    const password = PassWord.value;
    const email = Email.value;
    PassWord.value = "";
    Email.value = "";

    let myObj = {
      email:email,
      password:password,
    };

    let res = await axios.post(`${url}/signin`, myObj)
      console.log(res);
      if(res.status === 201){
        alert(res.data.message);
        localStorage.setItem('token', res.data.token);   
        window.location.href = "../Chatapp/chat.html";
      }
      else{
        throw new Error;
      }
      
      
}
catch(err){
  console.log(err.response.status);
  
  if(err.response.status === 400 && t == 0){
    t++;
    console.log(err.response.data.err);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      fillprop.appendChild(ele);
  }
  else if(err.response.status === 401 && t == 0){
    t++;
    console.log(err.response.data.message);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.message}</div>`;
      fillprop.appendChild(ele);
  }

  else if(err.response.status === 404 && t == 0){
    t++;
    console.log(err.response.data.message);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.message}</div>`;
      fillprop.appendChild(ele);
  }
  
 }
}

let t= 0;

// function forgotpassword() {
//   window.location.href = "./ForgotPassword/index.html"
// }
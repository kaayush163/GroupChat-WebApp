let url="http://localhost:5000/users";
let token = localStorage.getItem('token');
console.log(token);

window.addEventListener('DOMContentLoaded', async() => {   //on loading screen
    let x;
    try{
      x=await axios.get(`${url}/get-users`,{headers:{'Authorization':token}});
      console.log(x);
    }
    catch{
     console.log('ERROR');
    }

    let [a] = await Promise.all([x]);    // a is an object which stores array of object values in it
    console.log(a);
    for(let i=0;i<a.data.length;i++){
      insertNewRecord(a.data[i])
     }
})




function insertNewRecord(data) {
    console.log(data.id);
    var table = document.getElementById("storeList").getElementsByTagName('tbody')[0];
    //console.log(table);
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.id;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.name;
    cell3 = newRow.insertCell(2);
	cell3.innerHTML = data.email;
    cell4 = newRow.insertCell(3);
	cell4.innerHTML = data.phoneno;
    // cell4 = newRow.insertCell(4);

    console.log(newRow);
};
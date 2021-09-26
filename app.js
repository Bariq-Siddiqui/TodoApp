const signUp=()=>{
    let username=document.getElementById("username").value;
    let email=document.getElementById("email").value;
    let password=document.getElementById("password").value;
    if(username.length <= 0){
        alert("Enter Name")
    }
    if(email.length <= 6 || (email.indexOf('.com')<=0) || (email.indexOf('@')<=0)){
        alert("Enter Valid email")
    }
    if(password.length <= 5){
        alert("Enter Password")
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((res) => {
      let user = {
        username: username,
        email: email,
        password: password
    }
    firebase.database().ref(`users/${res.user.uid}`).set(user)
    .then(()=>{
      window.location.href="signIn.html";
    })
  })
  .catch((error) => {
    console.log(error.message);
  });
}
const onLogin=()=>{
  let email=document.getElementById("email").value;
  let password=document.getElementById("password").value;
  if(email.length <= 6 || (email.indexOf('.com')<=0) || (email.indexOf('@')<=0)){
    alert("Enter Valid email")
  }
  if(password.length <= 5){
    alert("Ente Correct Password")
  }
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((res) => {
    firebase.database().ref(`users/${res.user.uid}`).once("value",(data)=>{
      localStorage.setItem("userBio",data.val().username);
    })
    .then(()=>{
      window.location.href="todoApp.html";
    })
  })
  .catch((error) => {
    console.log(error.message);
  });
}
// index todo app
const data=()=>{
  let list=document.getElementById("list");
  document.getElementById("name").innerHTML=localStorage.getItem("userBio");
  firebase.database().ref(`TodoList`).on('child_added',(data)=>{
    let li=document.createElement("li");
    let liText=document.createTextNode(data.val().todo_item);
    li.appendChild(liText);
    // Edit button
    let edtBtn=document.createElement("i");
    edtBtn.setAttribute("class","fas1 fas fa-edit");
    edtBtn.setAttribute("id",data.val().key);
    edtBtn.setAttribute("onclick","edtItem(this)");
    li.appendChild(edtBtn)
    // Delete button
    let dltBtn=document.createElement("i");
    dltBtn.setAttribute("class","fas fa-trash-alt");
    dltBtn.setAttribute("onclick","dltItem(this)");
    dltBtn.setAttribute("id",data.val().key);
    li.appendChild(dltBtn);
    li.setAttribute("class","liApp");
    list.appendChild(li);
  })
}
const addItem=()=>{
  let todo_item=document.getElementById("todo_item");
  if(todo_item.value.length<=0){
    alert("Enter Todo Item")
  }else{
    var key=firebase.database().ref('TodoList').push().key;
    var todoList={
        todo_item:todo_item.value,
        key:key
    }
    firebase.database().ref(`TodoList/${key}`).set(todoList);
    todo_item.value="";
  }
}
const signOut=()=>{
  localStorage.removeItem("userBio");
  firebase.auth().signOut()
  .then(()=>{
      window.location="signIn.html"
  })
  .catch(()=>{

  })
}
const deleteAll=()=>{
  list.innerHTML="";
  firebase.database().ref(`TodoList`).remove(); 
}
const edtItem=(e)=>{
  var val =prompt("Enter update value",e.parentNode.firstChild.nodeValue);
    var editTodo={
      todo_item:val,
        key:e.id
    }
    firebase.database().ref("TodoList").child(e.id).set(editTodo)
    e.parentNode.firstChild.nodeValue=val;
}
const dltItem=(e)=>{
  firebase.database().ref(`TodoList`).child(e.id).remove();
  e.parentNode.remove();
}












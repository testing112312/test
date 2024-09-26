
// Ajax request for navigation 
/*
    **str=>url from link
    using XMLHttpReqest() library to 
*/
function nav(str)
{
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState === 4 && xhttp.status === 200) { //checks if a user loged in
            document.getElementById('contentB').innerHTML = xhttp.responseText;
            // console.log(xhttp.responseText);
        }
    };
    xhttp.open("GET", str, true); //logcheck get function
    xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttp.send();
}

/*Home view function*/
// function Home(){
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         let session = xhttp.responseText;
//         //console.log(session);
//         let id="";
//         if (session=="yes") { //checks if a user loged in
//             signout.style.display ="block";
//             logH.style.display ="none";
            
//         }
           
//                 showHome.style.display ="block";
//                 showForum.style.display ="none";
//                 showLog.style.display ="none";
//                 showSign.style.display ="none";
//                 showUser.style.display ="none";
//                 posts(id);

//     };

//     xhttp.open("GET", "/logcheck", true); //logcheck get function
//     xhttp.send();
// }

// /*forum view function*/
// function forum(id){
    
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         let session = xhttp.responseText;
//         //console.log(session);

//         if (session=="yes") {//checks if a user loged in
//             signout.style.display ="block";
//             logH.style.display ="none";
//         }
//             showHome.style.display ="none";
//             showForum.style.display ="block";
//             showLog.style.display ="none";
//             showSign.style.display ="none";
//             showUser.style.display ="none";
                           
//     };
//     Blobs(id);
//     posts(id);
//     xhttp.open("GET", "/logcheck", true);
//     xhttp.send();

// }

// /*posts Create function*/
// function PostCreate() {
//     let cap = document.getElementById("caption").value;
//     let file = document.getElementById("imgInputs").files;
//     let postButton=document.getElementById("post-b").name;
//     //console.log(postButton);
//     //Put file inside FormData object
//     const formData = new FormData();
//     formData.append('myFile', file[0]);
//     if(cap!=""&& file[0]!=0){
//         document.getElementById("caption").style.borderColor="green";
//         document.getElementById("imgInputs").style.borderColor="green";

//         let Post = {
//             forumID:postButton,
//             caption: cap,
//             imgUrl:'./static/images/'+file[0].name
//         }

//         //Set up XMLHttpRequest
//         let xhttp = new XMLHttpRequest();

//         xhttp.onreadystatechange = () => {//Called when data returns from server
//             //console.log(xhttp.status);
            
//             if (xhttp.readyState == 4 &&xhttp.status == 200) {
                
//                 document.getElementById("caption").style.borderColor="green";
//                 document.getElementById("imgInputs").style.color="green";
//                 xhttp.open("POST", "/uploads");
//                 xhttp.send(formData);
//                 document.getElementById("caption").innerHTML="";
//                 document.getElementById("imgInputs").innerHTML="";
//                 document.getElementById("blobImg").src="";
//                 forum(postButton);
//                 post_close();
                
//             }
//             if (xhttp.readyState == 4 &&xhttp.status == 401) {
//                 document.getElementById("Blog-name").style.borderColor="red";
//             }
//         };  
//         xhttp.open("POST", "/createpost",true);
//         xhttp.setRequestHeader("Content-type", "application/json");
//         xhttp.send(JSON.stringify(Post));
//     }
//     else{
//         document.getElementById("caption").style.borderColor="red";
//         document.getElementById("imgInputs").style.color="red";
//     }
// }
  
/*Login view function*/
// function log(){
    
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         let session = xhttp.responseText;
//         if (session=="yes") {
//             Home();
//             signout.style.display ="block";
//             logH.style.display ="none";
//         }
//         if(session=="no"){
//             showHome.style.display ="none";
//             showForum.style.display ="none";
//             showLog.style.display ="block";
//             showSign.style.display ="none";
//             showUser.style.display ="none";
//         }
//     };
//         xhttp.open("GET", "/logcheck", true);
//         xhttp.send();
// }

// /*Rgister view function*/
// function reg(){
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         let session = xhttp.responseText;
//         if (session=="yes") {//checks if a user loged in
//             log();
//             signout.style.display ="block";
//             logH.style.display ="none";
//         }
//         if(session=="no"){
//             showHome.style.display ="none";
//             showForum.style.display ="none";
//             showLog.style.display ="none";
//             showSign.style.display ="block";
//             showUser.style.display ="none";
//         }
//     };
//     xhttp.open("GET", "/logcheck", true);
//     xhttp.send();
// }

// /*User settings view function*/
//  function usr(){
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         let session = xhttp.responseText;
//         if (session=="yes") {//checks if a user loged in
//             loadusr(); //loads user details           
//             signout.style.display ="block";
//             logH.style.display ="none";
//             showHome.style.display ="none";
//             showForum.style.display ="none";
//             showLog.style.display ="none";
//             showSign.style.display ="none";
//             showUser.style.display ="block";
//         }
//         if(session=="no"){
//             Home();
//         }      
//     };
//     xhttp.open("GET", "/logcheck", true);
//     xhttp.send();
// }




// /*Loading usersettings view function*/

// function loadusr(){
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         if (xhttp.readyState == 4 && xhttp.status == 200) {
//             //Convert JSON to a JavaScript object
//            let userArr=JSON.parse(xhttp.responseText);
//             // console.log(userArr);
//            document.getElementById("Uname").value=userArr[0].user_Id;
//            document.getElementById("Udob").value=userArr[0].DOB;
//            document.getElementById("Uemail").value=userArr[0].email;
//            document.getElementById("Upassword").value=userArr[0].password;
//         }
//     };
//     //Request data for all posts
//     xhttp.open("GET", "/userDetail", true);
//     xhttp.send();
// }


// /*Search bar function*/

// function search(){
//     let searchInput= document.getElementById("myInput").value
//     let searchlist= document.getElementById("Searcher").style.display ="block";
//     let div=document.querySelector("#content");
//     let xhttp = new XMLHttpRequest();
//     let getHtml=``;
//     let status="no";
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         if (xhttp.readyState == 4 && xhttp.status == 200) {
//             //Convert JSON to a JavaScript object
//             let blobArr =JSON.parse(xhttp.responseText);
            
//                 for(let key in blobArr){
//                     if(blobArr[key].forum_Id==searchInput){
//                         status="yes";
//                         getHtml+=`  <li><button class="sButton" onclick="forum('`+blobArr[key].forum_Id+`')">`+blobArr[key].forum_Id+`</button></li>`;
//                     }                         
//                      document.getElementById("Searcher").innerHTML=getHtml;

//                 }
//                  if(status=="no"){
//                     getHtml+=`  <li><button class="sButton">NO BLOB FOUND</button></li>`;
//                     document.getElementById("Searcher").innerHTML=getHtml;
//                  }   
//                  div.addEventListener("click", e =>{
//                     document.getElementById("Searcher").style.display ="none";
//                  })                            
//         }
//     };
//      //Request data for all forums
//      xhttp.open("GET", "/blob", true);
//      xhttp.send();

// }




// /* Logout  function*/


// function logout(){
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         let session = xhttp.responseText;
//         if (session=="no") {    //checks if a user loged in
//             signout.style.display ="none";
//             logH.style.display ="block";
//             Home();
//         }   
//     };

//     xhttp.open("POST", "/logout", true);
//     xhttp.send();

// }


/*calling Home onload*/

// window.onload=Home();

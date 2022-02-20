import React, { useState } from "react";
import { getDatabase, ref as fireRef, set } from "firebase/database";
import { Navigation } from "./"
import { AuthProvider } from "../Auth.js";
import { getAuth } from "firebase/auth";
import { withRouter } from "react-router-dom";
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";



const Post = ({ history }) => {
  const [pending, setPending] = useState(false);

  const storage1 = getDatabase();

  const [postTitle, setPostTitle] = useState("");
  const [price, setPrice] = useState("");
  const [room, setRoom] = useState("");
  const [file, setFile] = useState("");
  const [imageAttached, setImageAttached] = useState("");
  
  const [description, setDescription] = useState("");
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  
  function uploadImage(fileImage) {
  
  var canvas = document.getElementById('imgCanvas');
  var ctx = canvas.getContext('2d');
  var reader = new FileReader();
  reader.onload = function(event) {
    var img = new Image();
    img.onload = function() {
      var hRatio = canvas.width / img.width    ;
      var vRatio =  canvas.height / img.height  ;
      var ratio  = Math.min ( hRatio, vRatio );
      var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.drawImage(img, 0,0, img.width, img.height, centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(setFile(blob),
          console.log(file));
        });
      });      
    }
    img.src = event.target.result;
    setImageAttached(true);
  }
  reader.readAsDataURL(fileImage);
  
}


    
    
  
  
  const handleSubmit = (e) => {
    
      
      e.preventDefault();
      setPending(true);
      const date = new Date();
      const postTime = Date.now()

      const metadata = {
        contentType: 'image/jpg'
      };

      // Create a root reference
      const db = getDatabase();

      const storage = getDatabase();


    
    const storageRef = ref(storage, "images/" + postTime + "/" + getAuth().currentUser.uid);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    

    // Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
(snapshot) => {
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  switch (snapshot.state) {
    case 'paused':
      console.log('Upload is paused');
      break;
    case 'running':
      console.log('Upload is running');
      break;
  }
}, 
(error) => {
  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;
    case 'storage/canceled':
      // User canceled the upload
      break;

    // ...

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, 
() => {
  // Upload completed successfully, now we can get the download URL
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    console.log('File available at', downloadURL);
    var shortDesc = String(description).substr(0, 47);

    if(imageAttached == false) {
      downloadURL = "";
    }
    
    set(fireRef(db, 'posts/' + postTime), {
      postTitle: String(postTitle),
      email: getAuth().currentUser.email,
      price: String(price),
      description: String(description),
      userid: getAuth().currentUser.uid,
      room: String(room),
      postTime: String(postTime),
      date: monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear(),
      downloadURL: downloadURL,
      shortDesc: shortDesc,
      idSelector: "#a" + String(postTime),
      initials: getAuth().currentUser.displayName.charAt(0) + getAuth().currentUser.displayName.split(" ")[1].charAt(0) + " '" + getAuth().currentUser.email.charAt(1) + getAuth().currentUser.email.charAt(2)
    }).then(() => {
      
      history.push("/home");
      setPending(false);
    })
    .catch((error) => {
    alert(error);
    setPending(false);
  });

  });
}
);

        
   
  };

  

  
 

  
  
  
 if (pending){
  return <><h3>Loading... (this may take a sec)</h3></>

 } 
  return (
    
    <div className="about">
      <AuthProvider>
      <Navigation /> 
      <div class="container">
      <div class="row align-items-center my-5">
          
          <div class="col-md-6 offset-md-3">

            <form onSubmit={handleSubmit}>
            
                <div class="mb-3">
                    <label for="posttitle" class="form-label"><h5>Post Title</h5></label>
                    <input type="text" class="form-control" id="postTitleID" maxLength="30" name="postTitle" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required/>
                    <small id="price" class="form-text text-muted">
                    {30 - postTitle.length} characters remaining
                    </small>
                </div>
                
                <div class="mb-3">
                    <label for="price" class="form-label"><h5>Price</h5></label>
                    <input type="number" min="1" step="1" class="form-control" max="9999" id="price" step="1" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                    <small id="price" class="form-text text-muted">
                    The price must be a whole number
                    </small>
                </div>
                <div class="mb-3">
                    <label for="room" class="form-label"><h5>Room Number</h5></label>
                    <input maxLength="4" pattern="[0-9]{4}" type="number" min="1001" max="8499" step="1" class="form-control" id="room" step="1" value={room} onChange={(e) => setRoom(e.target.value)} required/>
                    <small id="room" class="form-text text-muted">
                    Enter your four-digit Bancroft room number
                    </small>
                </div>
                <div class="mb-3">
                    <label for="postingDescription" class="form-label"><h5>Description</h5></label>
                    <textarea class="form-control" maxLength="150" id="postingDescription" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    <small id="price" class="form-text text-muted">
                    {150 - description.length} characters remaining
                    </small>
                    <div class="form-check mb-3">
          
          <div class="mt-3">
          <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required></input>
          <label class="form-check-label" for="invalidCheck">
         I agree to the</label> <a class="text-decoration-none" data-toggle="collapse" data-bs-toggle="collapse" data-bs-target="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"> terms and conditions</a>
          
          </div>
          <div class="invalid-feedback">
            You must agree before submitting.
          </div>
          
        </div>

        <div class="collapse mt-3" id="collapseExample">
        <div class="card card-body">
            <p>
              You are responsible for anything you post. If it is bad we will take it down and you'll be held responsible. 
            </p>
        </div>
        </div>
                <div class="mt-4">
                
                  <input type="file" id="imgLoader" onChange={(e) => {uploadImage(e.target.files[0])}} />
                  <button type="submit" class="btn btn-primary" disabled={pending}>Submit</button></div>
                </div>
                
                <div><canvas id='imgCanvas' class="bg-primary"></canvas></div>
                
                
            </form>
          </div>
        </div>
      </div>
      </AuthProvider>
    </div>
  );
 }

 


export default withRouter(Post);
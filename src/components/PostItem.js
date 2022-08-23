import React, { useState } from "react";
import { getDatabase, ref as fireRef, set } from "firebase/database";
import { Navigation } from "."
import { AuthProvider } from "../Auth.js";
import { getAuth } from "firebase/auth";
import { withRouter } from "react-router-dom";
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { doc, getFirestore, setDoc } from "firebase/firestore"; 
const Compress = require('compress.js')





const Post = ({ history }) => {

  function resizeImageFn(file) {
    const compress = new Compress()

    const resizedImage = compress.compress([file], {
      size: 0.25, // the max size in MB, defaults to 2MB
      quality: 1, // the quality of the image, max is 1,
      maxWidth: 300, // the max width of the output image, defaults to 1920px
      maxHeight: 300, // the max height of the output image, defaults to 1920px
      resize: true // defaults to true, set false if you do not want to resize the image width and height
    })
    const img = resizedImage[0];
    const base64str = img.data
    const imgExt = img.ext
    const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
    return resizedFiile;
  }


  const [pending, setPending] = useState(false);

  const storage1 = getDatabase();

  const [postTitle, setPostTitle] = useState("");
  const [price, setPrice] = useState("");
  const [room, setRoom] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [file, setFile] = useState("");
  const [imageAttached, setImageAttached] = useState(false);
  
  const [description, setDescription] = useState("");
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState(0);




  const handleChange = e => {
    if (e.target.files[0]) {
      showOnCanvas(e.target.files[0], true)
      setImageAttached(true);

      setImage(e.target.files[0]);
    }

    else {
      showOnCanvas(e.target.files[0], false)
      console.log(e.target.files[0]);
      setImageAttached(false);

    }
  };






  



// This takes the uploaded image and displays it to the canvas so the 
  // user knows what they are uploading
  function showOnCanvas(fileImage, filePresent) {
  
    var canvas = document.getElementById('imgCanvas');
    var ctx = canvas.getContext('2d');
    var reader = new FileReader();
  
    if(filePresent){
      
      
    reader.onload = function(event) {
      var img = new Image();
      img.onload = function() {
        var hRatio = canvas.width / img.width    ;
        var vRatio =  canvas.height / img.height  ;
        var ratio  = Math.min ( hRatio, vRatio );
        var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
        var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(img, 0,0, img.width, img.height,0, 0,img.width*ratio, img.height*ratio);
        
  
        
       
       
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(
            console.log(file));
          });
        });      
      }
  
      
      img.src = event.target.result;
    }
  
      if(fileImage && fileImage.type.match('image.*')){
        reader.readAsDataURL(fileImage);
      }
  
      else  {
      }
    }
  
  
      else {
        ctx.clearRect(0,0,canvas.width, canvas.height);
  
  
      }
  
      }
      
    
  
      
    
  


  
  const handleSubmit = (e) => {
    
      
      e.preventDefault();
      setPending(true);
      const date = new Date();
      const postTime = Date.now()

      const metadata = {
        contentType: 'image/jpeg'
      };

      // Create a root reference
      const db = getFirestore();

      const storage = getStorage();


    
    const storageRef = ref(storage, "images/" + postTime + getAuth().currentUser.uid +".jpeg");
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);

    

    // Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
(snapshot) => {
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  setProgress(progress);
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
    
    const postDescArray = description.toLowerCase().split(" ")
    const postTitleSplit = postTitle.toLowerCase().split(" ");
    const priceNum = parseFloat(price)
     console.log(postTitleSplit +" " + postDescArray)
     setDoc(doc(db, 'posts/' + postTime), {
      postTitle: String(postTitle),
      email: getAuth().currentUser.email,
      price: price,
      priceNum: priceNum,
      description: String(description),
      userid: getAuth().currentUser.uid,
      room: String(room),
      postTime: postTime,
      phoneNumber: phoneNumber,
      date: monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear(),
      downloadURL: downloadURL,
      imageTitle: postTime + getAuth().currentUser.uid +"_600x600.jpeg",
      shortDesc: shortDesc,
      idSelector: "#a" + String(postTime),
      initials: getAuth().currentUser.displayName.charAt(0) + getAuth().currentUser.displayName.split(" ")[1].charAt(0) + " '" + getAuth().currentUser.email.charAt(1) + getAuth().currentUser.email.charAt(2),
      category: category,
      postDescCombined: postDescArray.concat(postTitle.toLowerCase().split(" "))
    }).then(() => {

      history.push("/");
      window.location.reload(false);

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
  return <><h3>Loading... (this may take 20-30 seconds, depending on the image size)</h3></>

 } 
  return (

    <div>
      
    <div class="btn-group w-100 mb-3" role="group">
            <a href="/post-item" class={`btn ${
                  (window.location.pathname === "/post-item") ? "btn-primary" : "btn-outline-primary"
                }`}>
               Post Item</a>
              
            <a href="/request-item" class={`btn ${
                  (window.location.pathname === "/request-item") ? "btn-primary" : "btn-outline-primary"
                }`}>
               Request Item</a>
               </div>
               
            
          

            <form onSubmit={handleSubmit}>
            
                <div class="mb-3">
                    <label for="posttitle" class="form-label"><h5>Post Title</h5></label>
                    <input type="text" class="form-control" id="postTitleID" maxLength="30" name="postTitle" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required/>
                    <small id="price" class="form-text text-muted">
                    {30 - postTitle.length} characters remaining
                    </small>
                </div>

                

               
                <select required class="form-select form-select-md mb-3"  onChange={(e) => setCategory(e.target.value)} id="inputGroupSelect01" >
                  <option selected>Category...</option>
                  <option value="1">Books</option>
                  <option value="2">Electronics</option>
                  <option value="3">Apparel</option>
                  <option value="4">Room Items</option>
                  <option value="5">Other</option>


                </select>
              
                
                <div class="mb-3">
                    <label for="price" class="form-label"><h5>Price</h5></label>
                    <input type="number" min="0"  class="form-control" max="9999" id="price" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                    <small id="price" class="form-text text-muted">
                    Enter 0 for a free item
                    </small>
                </div>
                
                <div class="mb-3">
                    <label for="room" class="form-label"><h5>Room Number</h5></label>
                    <input maxLength="4" pattern="[0-9]{4}" type="number" min="1001" max="8499" step="1" class="form-control" id="room"  value={room} onChange={(e) => setRoom(e.target.value)} required/>
                    <small id="room" class="form-text text-muted">
                    Enter your four-digit Bancroft room number
                    </small>
                </div>
                <div class="mb-3">
                    <label for="room" class="form-label"><h5>Phone Number</h5></label>
                    <input   class="form-control" id="room"  maxLength="10" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    <small id="phoneNumber" class="form-text text-muted">
                    (Optional) Enter your phone number so buyers can easily contact you (no dashes)
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
         I agree to the</label> <a class="text-decoration-none" target="_blank" href="/terms-of-use"> terms of use</a>
          
          </div>
          <div class="invalid-feedback">
            You must agree before submitting.
          </div>

          <div class="mt-3">
          <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required></input>
          <label class="form-check-label" for="invalidCheck">
          This is not a U.S. Military uniform item
  
         </label>
         
          </div>
          
          <div class="invalid-feedback">
            You must agree before submitting.
          </div>
          
        </div>
       

        

      
        
        <div>
      
      <input type="file" onChange={handleChange} />
     
    </div>
                </div>
                <div class="btn-group w-100 " role="group">
                <button type="submit" class="btn btn-primary mt-2 btn-large btn-block" disabled={pending}>Submit</button>
                </div> 
                <small id="room" class="form-text text-muted">
                    Please make sure to delete your post once your item has sold
                    </small>

                <div class="w-100 mt-4"><canvas height="200" width="150" id='imgCanvas'></canvas></div>
            </form></div>
          
       
     
  );
 }

 


export default withRouter(Post);
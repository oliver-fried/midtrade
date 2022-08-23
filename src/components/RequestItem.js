import React, { useState } from "react";
import { getDatabase, ref as fireRef, set } from "firebase/database";
import { Navigation } from "."
import { AuthProvider } from "../Auth.js";
import { getAuth } from "firebase/auth";
import { withRouter } from "react-router-dom";
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { doc, getFirestore, setDoc } from "firebase/firestore"; 
const Compress = require('compress.js')





const RequestItem = ({ history }) => {

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


  const db = getFirestore()

 






  
  const handleSubmit = (e) => {
    e.preventDefault();

    const postTime = Date.now();
   
    const postDescArray = description.toLowerCase().split(" ")
    const postTitleSplit = postTitle.toLowerCase().split(" ");
    const priceNum = parseFloat(price)
        setDoc(doc(db, 'requests/' + postTime), {
            postTitle: postTitle,
            description: description,
            initials: getAuth().currentUser.displayName.charAt(0) + getAuth().currentUser.displayName.split(" ")[1].charAt(0) + " '" + getAuth().currentUser.email.charAt(1) + getAuth().currentUser.email.charAt(2),
            userid: getAuth().currentUser.uid,
            postTime: postTime,
            phoneNumber: phoneNumber,
            priceNum: priceNum,
            postDescCombined: postDescArray.concat(postTitle.toLowerCase().split(" ")),
            price: -1,
            idSelector: "#a" + String(postTime),
            email: getAuth().currentUser.email,


            

        }).then(() => {

            history.push("/wanted");
            window.location.reload(false);
      
            setPending(false);
          })
          .catch((error) => {
          alert(error);
          setPending(false);
        });




    

}
  

  
 

  
  
  
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
                    <label for="posttitle" class="form-label"><h5>Requested Item</h5></label>
                    <input type="text" class="form-control" id="postTitleID" maxLength="30" name="postTitle" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required/>
                    <small id="price" class="form-text text-muted">
                    {30 - postTitle.length} characters remaining
                    </small>
                </div>

                

               
               
              
           
                
             
                <div class="mb-3">
                    <label for="room" class="form-label"><h5>Phone Number</h5></label>
                    <input   class="form-control" id="room"  maxLength="10" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required/>
                    <small id="phoneNumber" class="form-text text-muted">
                     Enter your phone number so sellers can easily contact you (no dashes)
                    </small>
                </div>
                <div class="mb-3">
                    <label for="postingDescription" class="form-label"><h5>Description of Requested Item</h5></label>
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

       
          
        
          
        </div>
       

        

      
        
        <div>
      
     
    </div>
                </div>
                <div class="btn-group w-100 " role="group">
                <button type="submit" class="btn btn-primary mt-2 btn-large btn-block" disabled={pending}>Submit</button>
                </div> 
                <small id="room" class="form-text text-muted">
                    Please make sure to delete your request once it's been fufilled
                    </small>

                <div class="w-100 mt-4"><canvas height="200" width="150" id='imgCanvas'></canvas></div>
            </form></div>
          
       
     
  );
 }

 


export default withRouter(RequestItem);
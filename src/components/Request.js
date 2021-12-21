import React, { useState } from "react";
import { getDatabase, ref as fireRef, set } from "firebase/database";
import { Navigation } from "./"
import { AuthProvider } from "../Auth.js";
import { getAuth } from "firebase/auth";
import { withRouter } from "react-router-dom";


const Requests = ({ history }) => {
  const [pending, setPending] = useState(false);


  const [postTitle, setPostTitle] = useState("");
  const [price, setPrice] = useState("");
  const [room, setRoom] = useState("");
  const [file, setFile] = useState("");
  const [imageAttached, setImageAttached] = useState("");
  
  const [description, setDescription] = useState("");
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  


    
    
  
  
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



    
    
    

    // Listen for state changes, errors, and completion of the upload.


    
    set(fireRef(db, 'requests/' + postTime), {
      postTitle: String(postTitle),
      email: getAuth().currentUser.email,
      price: String(price),
      description: String(description),
      userid: getAuth().currentUser.uid,
      room: String(room),
      postTime: String(postTime),
      date: monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear(),
    }).then(() => {
      
      history.push("/home");
      setPending(false);
    })
    .catch((error) => {
    alert(error);
    setPending(false);
  });

        
   
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
         I agree to the <a href="/terms-and-conditions" class="text-decoration-none"> terms and conditions</a>
          </label>
          </div>
          <div class="invalid-feedback">
            You must agree before submitting.
          </div>
        </div>
                <div class="mt-4">
                  
                  <button type="submit" class="btn btn-primary" disabled={pending}>Submit</button></div>
                </div>
                
                
                
                
            </form>
          </div>
        </div>
      </div>
      </AuthProvider>
    </div>
  );
 }

 


export default withRouter(Requests);
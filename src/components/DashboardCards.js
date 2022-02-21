
import React, { useState, Redirect, useEffect } from "react";
import { AuthProvider } from "../Auth";
import { getAuth, signOut } from "firebase/auth"

import { getDatabase, query, limitToLast, ref as fireRef, onValue, set, orderByKey, endBefore } from "firebase/database";
import { withRouter } from "react-router-dom";
import { getStorage, deleteObject, ref as storRef } from "firebase/storage";
import { Navigation } from "."
import { Modal, Button } from "react-bootstrap";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";




const DashboardCards = () => {


  const [posts, setPosts] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextPosts_loading, setNextPostsLoading] = useState(false);
  const [endOfData, setEndOfData] = useState(false);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [pending, setPending] = useState(false);


  const [price, setPrice] = useState("");
  const [room, setRoom] = useState("");
  const [file, setFile] = useState("");
  const [imageAttached, setImageAttached] = useState(false);
  
  const [description, setDescription] = useState("");
  

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  


  
  const db = getDatabase(); 
  const userID = getAuth().currentUser.uid;

  useEffect(() => {

    // get the first 5 posts
    const batch = query(fireRef(db, 'posts/'), limitToLast(10));

    onValue(batch, (snapshot) => {
        let postsSnapshot = [];
        let lastKeySnapshot = "";
        var isFirstPost = true;
        const data = snapshot.val();
        for (let id in data) {
          if(data[id].userid === userID ){
            postsSnapshot.push(data[id]);
          }

            if(isFirstPost) {
                isFirstPost = false;
                lastKeySnapshot = id;
            }

        }
        setPosts(postsSnapshot.reverse())
        setLastKey(lastKeySnapshot)
    })
}, []);



const fetchMorePosts = (key) => {

  // get the first 5 posts
  const batch = query(fireRef(db, 'posts/'), orderByKey(), limitToLast(10), endBefore(key));
  onValue(batch, (snapshot) => {

      let postsSnapshot = [];
      let lastKeySnapshot = "";
      var isFirstPost = true;

      const data = snapshot.val();
      if(data == null) {
          setEndOfData(true);
      }

      for (let id in data) {
        if(data[id].userid === userID ){
          postsSnapshot.push(data[id]);
        }
          if(isFirstPost) {
          isFirstPost = false;
          lastKeySnapshot = id;
          }
      }

      setPosts(posts.concat(postsSnapshot.reverse()))
      setLastKey(lastKeySnapshot)

   })
  }



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


  function pricePrinting(givenPrice) {
    if(givenPrice == 0) {
        return <>Free</>
    }

    else {
        return <>${givenPrice}</>
    }
}





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















      const saveChanges = (givenPost) => {
    
    
  
        const metadata = {
          contentType: 'image/jpg'
        };
  
        // Create a root reference
        const db = getDatabase();
  
        const storage = getStorage();
  
  
      
      const storageRef = ref(storage, "images/" + givenPost.postTime + "/" + getAuth().currentUser.uid);
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);
  
      
  
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
    console.log(givenPost.postTime);
      set(fireRef(db, 'posts/' + givenPost.postTime), {
        postTitle: String(postTitle),
        email: givenPost.email,
        price: String(price),
        description: String(description),
        userid: givenPost.userid,
        room: String(room),
        postTime: String(givenPost.postTime),
        date: givenPost.date,
        downloadURL: downloadURL,
        shortDesc: shortDesc,
        idSelector: givenPost.idSelector,
        initials: givenPost.initials
      }).then(() => {
        
        
      })
      .catch((error) => {
      alert(error);
    });
  
    });
  }
  );
  
          
     
    };

    






  const handleCommentSubmit = (postID, URL) => {

    const commentTime = Date.now();

    if(comment){
    set(fireRef(db, 'posts/' + postID + "/comments/" + commentTime), {
      time: commentTime,
      userID: getAuth().currentUser.uid,
      userProPicURL: URL,
      initials: getAuth().currentUser.displayName.charAt(0) + getAuth().currentUser.displayName.split(" ")[1].charAt(0) + " '" + getAuth().currentUser.email.charAt(1) + getAuth().currentUser.email.charAt(2),
      comment: comment
    
    });
}

    setComment("");
 }

    // ----------------------------------
    //         HELPER FUNCTIONS
    // ----------------------------------

    // This gets more posts on each button click
    function loadMoreButton(displayBool) {
      if(!displayBool) {
          return(
              <div class="btn-group w-100 mb-3" role="group">
              <button type="submit" class="btn btn-primary" onClick={() => fetchMorePosts(lastKey)}>Load more</button>
          </div>

          )
      }
      else {
          return(
          <div class="text-center">
              <h5>You've reached the end!</h5></div>
          )
      }
  }

  function modalEditDisplay(givenPostCard) {




    return (

        <div>           
             {console.log(givenPostCard.postTime)}
        
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                                    
                <form >
                
                    <div class="mb-3">
                        <label for="posttitle" class="form-label"><h5>Post Title</h5></label>
                        <input type="text" class="form-control" id="postTitleID" maxLength="30"  name="postTitle" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required />
                        <small id="price" class="form-text text-muted">
                        {30 - postTitle.length} characters remaining
                        </small>
                    </div>
                    
                    <div class="mb-3">
                        <label for="price" class="form-label"><h5>Price</h5></label>
                        <input type="number" min="1" step="1" class="form-control" max="9999" id="price"  step="1" value={price} placeHolder={givenPostCard.price} onChange={(e) => setPrice(e.target.value)} required/>
                        <small id="price" class="form-text text-muted">
                        The price must be a whole number
                        </small>
                    </div>
                    <div class="mb-3">
                        <label for="room" class="form-label"><h5>Room Number</h5></label>
                        <input maxLength="4" pattern="[0-9]{4}" type="number" min="1001" max="8499" step="1" class="form-control" id="room" step="1" placeHolder={givenPostCard.room} value={room} onChange={(e) => setRoom(e.target.value)} required/>
                        <small id="room" class="form-text text-muted">
                        Enter your four-digit Bancroft room number
                        </small>
                    </div>
                    <div class="mb-3">
                        <label for="postingDescription" class="form-label"><h5>Description</h5></label>
                        <textarea class="form-control" maxLength="150" id="postingDescription" rows="3" placeHolder={givenPostCard.description}  value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        <small id="price" class="form-text text-muted">
                        {150 - description.length} characters remaining
                        </small>
                        <div class="form-check mb-3">
            
                            <div class="invalid-feedback">
                            You must agree before submitting.
                            </div>
                        </div>
        
                        <div>
    
                            <input type="file" onChange={handleChange} />
    
                        </div>
                    </div>
                
                

                    <div class="w-100 mt-4"><canvas height="400" width="300" id='imgCanvas'></canvas></div>
                </form>

            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {console.log(givenPostCard.postTime)}}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </div>

    )
  }



  function commentsDisplay(postCardID, postComments) {
    if(!postComments) {
        return <div></div>
    }

    else {
        let postCommentsArray = [];
        for (let comment in postComments) {
            postCommentsArray.push(postComments[comment]);

        }
        return (
            <div>
                {posts ? postCommentsArray.map((comment) => <div>
                    <div class="row">
                    <div class="col-auto me-auto">
                    <p>
                        <img class="rounded-circle" alt="10x10" style={proPicStyle} src={comment.userProPicURL} />
                        {comment.comment}
                        </p>
                        </div>
                        <div class="col-auto">
                        {comment.userID == getAuth().currentUser.uid ? <h5><a class="text-danger" onClick={() => {deleteComment(postCardID, comment.time)}}><i class="bi bi-trash "></i></a></h5> : <div></div>}
                        </div>

                        
                        </div>
                </div>) : <div></div>}
                
            </div>
        );
    }
}
    
    function imageDec(url) {
      if(url != "") {
          return <img class="mt-0 mb-0" src={url} />
      }
      else {
          return <></>
      }
    }
    
    const deletePost = (postTime) => {
      const db = getDatabase();
      const storageVar = getStorage()
      const storageRef = storRef(storageVar, 'images/' + postTime + "/" + getAuth().currentUser.uid);
      deleteObject(storageRef);
      set(fireRef(db, "posts/" + postTime), {
        
      })      
      }

      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      const deleteComment = (postCardID, commentID) => {
        const db = getDatabase();
        
        set(fireRef(db, "posts/" + postCardID + "/comments/" + commentID), {
          
        })      
        }


        function imageDec(url) {
            if (url != "") {
                return <div class="" style={imageClass}><img src={url} class="img-fluid w-100" /> </div>
            }
            else {
                return <></>
            }
        }
    
      

    // This function takes the initial post time and calculates a realtime 
    // time since post to be displayed on the card header
    function timePrinting(postTime, date, room, initials) {

        if ((Date.now() - postTime) <= 60000) {
            return <p><i class="bi bi-clock mr-1"></i> moments ago<i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"> </i>{room}<i class="bi bi-dot mr-1"></i> {initials}</p>
        }

        else if ((Date.now() - postTime) < 3600000) {
            return <p><i class="bi bi-clock ml-3"></i> {Math.ceil((Date.now() - postTime) / 60000)} minutes ago <i class="bi bi-dot mr-1"> </i><i class="bi bi-geo-alt"> </i>{room} <i class="bi bi-dot mr-1"></i> {initials}</p>
        }

        else if ((Date.now() - postTime) < 36000000) {
            return <p><i class="bi bi-clock mr-1"></i> {Math.floor((Date.now() - postTime) / 3600000)} hrs ago <i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"> </i>{room}<i class="bi bi-dot mr-1"></i> {initials}</p>
        }

        else {
            return <p><i class="bi bi-clock mr-1"></i> {date}<i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"> </i>{room}<i class="bi bi-dot mr-1"></i> {initials}</p>
        }
    }
    
    



    //--------------------------
    //       CSS STYLES      
    //--------------------------

    // CSS Style that prevents a linked HTML element from having
    // that stupid blue underline 
    const noStyle = {
      textDecoration: "inherit",
      color: "inherit"
    }

  // CSS Style that makes the images look nice
  const imageClass = { paddingLeft: "0px", paddingRight: "0px" }
  const proPicStyle = {height: "5vw", maxHeight: "30px", marginRight: "8px"}

  



  return (
    <div>



<div class="input-group mb-2 mt-4">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">

    <i class="bi bi-search "></i>


    </span>
  </div>
  <input type="text" class="form-control mb-3" id="searchID" maxLength="100" name="search" placeholder="Search all posts" aria-describedby="basic-addon1" onChange={(e) => setSearch(e.target.value)} required/></div>






            
        {posts ? posts.map((post, i) =>
            <div>

                {search ? <div>

                    {(post.postTitle.toLowerCase().includes(search.toLowerCase()) || post.description.toLowerCase().includes(search.toLowerCase()) )  ? <div>

                    <div class="card mb-4" key={i}>
                        <a data-bs-toggle="collapse" href={post.idSelector} style={noStyle} role="button" aria-expanded="false" aria-controls="collapseExample">
                        <div class="card-header">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-auto me-auto">
                                            <h3>{post.postTitle}</h3>
                                        </div>
                                        <div class="col-auto">
                                        
                                            <h3 class=" text-success">{pricePrinting(post.price)}</h3>
                                            
                                        </div>

                                        <div class="col-1">
                                            
                                            <h3 class="text-danger">
                                                <a onClick={() => {deletePost(post.postTime)}}><i class="bi bi-trash "></i></a></h3>
                                        </div>

                                        



                                        


                                    </div>
                                </div>
                            </div>

                            <div class="card-body w-100">
                                <p class="card-text text-muted">{timePrinting(post.postTime, post.date, post.room, post.initials)}</p>
                                {imageDec(post.downloadURL)}
                            </div>
                        </a>

                        <div class="collapse" aria-expanded="true" id={"a" + post.postTime}>
                            <ul class="list-group list-group-flush">
                            <a data-bs-toggle="collapse"  href={post.idSelector} style={noStyle} role="button" aria-expanded="true" aria-controls="collapseExample">
                                <li class="list-group-item">
                                <label for="posttitle" class="form-label"><h6>Description</h6></label>

                                    <p class="lead">{post.description}</p> 
                                </li>
                                </a>
                                <li class="list-group-item">


                        
                        

                        <div class="mb-3">
                        <label for="posttitle" class="form-label"><h6>Comments</h6></label>
                        {commentsDisplay(post.postTime, post.comments)}
                        <div class="input-group mt-3" >
                            <input type="text" class="form-control" id="commentID" maxLength="100" name="comment" placeholder="Comment publicly" value={comment} onChange={(e) => setComment(e.target.value)} required/>
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit" onClick={() => handleCommentSubmit(post.postTime, getAuth().currentUser.photoURL)}>Post</button>
                            </div>
                        </div>
                        <small id="price" class="form-text text-muted">
                        {100 - comment.length} characters remaining
                        </small>

                        
                    </div>

                    
                                </li>
                            </ul>
                        </div>
                    </div>


                    </div> : <div></div>}

                </div> : <div>


                    <div class="card mb-4" key={i}>
                        <a data-bs-toggle="collapse" href={post.idSelector} style={noStyle} role="button" aria-expanded="true" aria-controls="collapseExample">
                        <div class="card-header">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-auto me-auto">
                                            <h3>{post.postTitle}</h3>
                                        </div>
                                        <div class="col-auto">
                                        
                                            <h3 class=" text-success">{pricePrinting(post.price)}</h3>
                                            
                                        </div>

                                        <div class="col-1">
                                            
                                            <h3 class="text-danger">
                                                <a onClick={() => {deletePost(post.postTime)}}><i class="bi bi-trash "></i></a></h3>
                                        </div>

                                       




                                        


                                    </div>
                                </div>
                            </div>

                            <div class="card-body w-100">
                                <p class="card-text text-muted">{timePrinting(post.postTime, post.date, post.room, post.initials)}</p>
                                
                                {post.downloadURL ? imageDec(post.downloadURL) : <div></div>}
                            </div>
                        </a>
                        
                        <div class="collapse" id={"a" + post.postTime}>
                            <ul class="list-group list-group-flush">
                            <a data-bs-toggle="collapse"  href={post.idSelector} style={noStyle} role="button" aria-expanded="true" aria-controls="collapseExample">
                                <li class="list-group-item">
                                <label for="posttitle" class="form-label"><h6>Description</h6></label>

                                    <p class="lead">{post.description}</p> 
                                </li>
                                </a>
                                <li class="list-group-item">


                        
                        

                        <div class="mb-3">
                        <label for="posttitle" class="form-label"><h6>Comments</h6></label>

                        
                        {commentsDisplay(post.postTime, post.comments)}
                        <div class="input-group mt-3" >
                            <input type="text" class="form-control" id="commentID" maxLength="100" name="comment" placeholder="Comment publicly" value={comment} onChange={(e) => setComment(e.target.value)} required/>
                            
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit" onClick={() => handleCommentSubmit(post.postTime, getAuth().currentUser.photoURL)}>Post</button>
                            </div>
                        </div>
                        
                        <small id="price" class="form-text text-muted">
                        {100 - comment.length} characters remaining
                        </small>

                        
                    </div>

                    






                                </li>
                            </ul>
                        </div>
                    
                    </div>
                    
                     
                    </div>}


            </div>
            ) : <div>No posts</div>}
            {loadMoreButton(endOfData)}
        
        </div>
)
}


/*










































  return (
    
    <div className="home">
    <AuthProvider>
      <Navigation />
      <div class="container">
         <div class="row align-items-center mt-3">
          
          <div class="col-md-6 offset-md-3 text-center">
            <h1>Dashboard</h1>
            
            
            <button class='btn btn-primary btn-block w-100 mb-4 mt-3' onClick={handleSignOut}>Sign out</button>
            <div>
            
            {reversedPostList ? reversedPostList.map((post) => 
            
                <div class="card mb-3">
                    <div class="card-header">
                        <div class="container">
                            <div class="row">
                            <div class="col-8">
                                    <h3>{post.postTitle}</h3>
                                </div>
                                <div class="col-4">
                                    <h3 class="text-right text-success">${post.price}</h3>
                                </div>
                                <div class="col">
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <p class="card-text text-muted">{timePrinting(post.postTime, post.date, post.room)}</p>
                        <h5 class="card-text font-weight-normal">{post.description}</h5>
                        <>{imageDec(post.downloadURL)}</>
                        
                        
                        <div class="row">
                            <div class="col-9">
                      
                                </div>
                                <div class="col-1">
                                    <h3 class="text-right">
                                    </h3>
                                </div>
                                <div class="col-2">
                                    <h3 class="text-right text-danger">
                                    <a onClick={() => {deletePost(post.postTime)}}><i class="bi bi-trash "></i></a></h3>
                                </div>
                                <div class="col">
                                </div>
                                
                            </div>
                    </div>
                </div>

            ) : "" }
        </div> 
          <div class="col-lg-5">
            
          </div>
        </div>
      </div>
      </div>
      </AuthProvider>
    </div>
  );
}*/

export default (DashboardCards);


/*
INCLUDE IF ADDING BUYING PAGE
<div class="btn-group btn-block mb-3" role="group" aria-label="Basic example">
            <a href="/dashboard" class={`btn ${
                  (props.location.pathname === "/dashboard" | props.location.pathname === "/dashboard-posts") ? "btn-primary" : "btn-outline-dark"
                }`}>
               Selling</a>
              

            <a href="/dashboard-requests" class={`btn ${
                  (props.location.pathname === "/dashboard-requests") ? "btn-primary" : "btn-outline-primary"
                }`}>
               Buying</a>
               </div>

*/

import React, { useState, Redirect, useEffect } from "react";
import { AuthProvider } from "../Auth";
import { getAuth, signOut } from "firebase/auth"
import { getDatabase, query, limitToLast, ref, onValue, set, orderByKey, endBefore } from "firebase/database";
import { withRouter } from "react-router-dom";
import { getStorage, deleteObject, ref as storRef } from "firebase/storage";
import { Navigation } from "."
import { registerVersion } from "@firebase/app";


const DashboardCards = () => {


  const [posts, setPosts] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextPosts_loading, setNextPostsLoading] = useState(false);
  const [endOfData, setEndOfData] = useState(false);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");

  
  const db = getDatabase(); 
  const userID = getAuth().currentUser.uid;

  useEffect(() => {

    // get the first 5 posts
    const batch = query(ref(db, 'posts/'), limitToLast(10));

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
  const batch = query(ref(db, 'posts/'), orderByKey(), limitToLast(10), endBefore(key));
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



  const handleCommentSubmit = (postID, URL) => {

    const commentTime = Date.now();

    if(comment){
    set(ref(db, 'posts/' + postID + "/comments/" + commentTime), {
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
      set(ref(db, "posts/" + postTime), {
        
      })      
      }

      const deleteComment = (postCardID, commentID) => {
        const db = getDatabase();
        
        set(ref(db, "posts/" + postCardID + "/comments/" + commentID), {
          
        })      
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

            
            <div class="input-group" >
                <input type="text" class="form-control mb-3" id="searchID" maxLength="100" name="search" placeholder="Search your posts" value={search} onChange={(e) => setSearch(e.target.value)} required/>    
            </div>
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
                                    
                                        <h3 class=" text-success">${post.price}</h3>
                                        
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

                        <div class="collapse" aria-expanded="false" id={"a" + post.postTime}>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <p class="lead">{post.description}</p>
                                </li>
                                <li class="list-group-item">


                        
                        

                        <div class="mb-3">
                        <label for="posttitle" class="form-label"><h6>Comments</h6></label>
                        {commentsDisplay(post.postTime, post.comments)}
                        <div class="input-group" >
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
                                    
                                        <h3 class=" text-success">${post.price}</h3>
                                        
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
                                <li class="list-group-item">
                                    <p class="lead">{post.description}</p>
                                </li>
                                <li class="list-group-item">


                        
                        

                        <div class="mb-3">
                        <label for="posttitle" class="form-label"><h6>Comments</h6></label>
                        {commentsDisplay(post.postTime, post.comments)}
                        <div class="input-group" >
                            <input type="text" class="form-control" id="commentID" maxLength="100" name="comment" placeholder="Comment publicaly" value={comment} onChange={(e) => setComment(e.target.value)} required/>
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

export default DashboardCards;


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
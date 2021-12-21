
import React, { useState, Redirect, useEffect } from "react";
import { AuthProvider } from "../Auth";
import { getAuth, signOut } from "firebase/auth"
import { getDatabase, query, limitToLast, ref, onValue, set } from "firebase/database";
import { withRouter } from "react-router-dom";
import { getStorage, deleteObject, ref as storRef } from "firebase/storage";



import { Navigation } from "./"
import { registerVersion } from "@firebase/app";

function Dashboard(props) {



  const [postList, setPostList] = useState("");
  const [reversedPostList, setReversedPostList] = useState("");
    
    

    useEffect(() => {
    const db = getDatabase();
    const postTitleRef = query(ref(db, 'posts/'), limitToLast(50));
    onValue(postTitleRef, (snapshot) => {
    const data = snapshot.val();
    const postList = [];
    for (let id in data) {
      if(data[id].userid === getAuth().currentUser.uid ){
        postList.push(data[id]);
    }}

    setPostList(postList);
    setReversedPostList(postList.reverse());
    

})
    
    
}); 
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
      

    function timePrinting(postTime, date, room) {
       
        if((Date.now() - postTime) <= 60000) {
            return <p><i class="bi bi-clock mr-1"></i>moments ago <i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"></i>{room}</p>
        }
        
        else if((Date.now() - postTime) < 3600000) {
            return <p><i class="bi bi-clock mr-1"></i>{Math.ceil((Date.now() - postTime) / 60000)} minutes ago <i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"></i>{room}</p>
        }

        else if((Date.now() - postTime) < 36000000) {
            return <p><i class="bi bi-clock mr-1"></i>{Math.floor((Date.now() - postTime) / 3600000)} hrs ago <i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"></i>{room}</p>
        }
        
        else {
            return <p><i class="bi bi-clock mr-1"></i>{date}<i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"></i>{room}</p>
        }  
    }
    

    const handleSignOut = () => {
        signOut(getAuth()).then(() => {
          window.location.assign('https://accounts.google.com/Logout');
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
      }

  return (
    
    <div className="home">
    <AuthProvider>
      <Navigation />
      <div class="container">
         <div class="row align-items-center my-5">
          
          <div class="col-md-6 offset-md-3">
            <h1>Dashboard</h1>
            
            
            <button class='btn btn-primary btn-block mb-4 mt-3' onClick={handleSignOut}>Sign out</button>
            <div>
            <h3 class="mb-3">My posts</h3>
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
}

export default withRouter(Dashboard);
// --------------------------------------------------------
// This file takes all the post data from firebase and 
// displays them on post cards. It queries 10 posts initially
// and allows the user to query 10 more on each "Load more" 
// button click. 
//
// Oliver Fried, January 2022

import React, { useState, Redirect, useEffect } from "react";
import { getDatabase, query, limitToLast, ref, onValue, startAfter, orderByKey, startAt, limitToFirst, limit, endAt, endBefore } from "firebase/database";
import PostComments from "./PostComments";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getAuth, signOut } from "firebase/auth";
import { ref as fireRef, set } from "firebase/database";



const PostCards = () => {

    const [posts, setPosts] = useState([]);
    const [lastKey, setLastKey] = useState("");
    const [nextPosts_loading, setNextPostsLoading] = useState(false);
    const [endOfData, setEndOfData] = useState(false);
    const [comment, setComment] = useState("");
    const [search, setSearch] = useState("");

    const db = getDatabase(); 

    useEffect(() => {

        // get the first 5 posts
        const batch = query(ref(db, 'posts/'), limitToLast(50));

        onValue(batch, (snapshot) => {
            let postsSnapshot = [];
            let lastKeySnapshot = "";
            var isFirstPost = true;
            const data = snapshot.val();
            for (let id in data) {
                postsSnapshot.push(data[id]);
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
        const batch = query(ref(db, 'posts/'), orderByKey(), limitToLast(50), endBefore(key));
        onValue(batch, (snapshot) => {

            let postsSnapshot = [];
            let lastKeySnapshot = "";
            var isFirstPost = true;

            const data = snapshot.val();
            if(data == null) {
                setEndOfData(true);
            }

            for (let id in data) {
                postsSnapshot.push(data[id]);

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


    const deleteComment = (postCardID, commentID) => {
        const db = getDatabase();
        
        set(ref(db, "posts/" + postCardID + "/comments/" + commentID), {
          
        })      
        }


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
                    {posts ? postCommentsArray.map((comment) => <div class="">
                        <div class="row mb-3">
                            <div class="col-1" style={collumnStyle}>
                            

                            
                            <span class="align-middle"><img class="rounded-circle img-responsive"  style={proPicStyle} src={comment.userProPicURL} /></span>
                            

                            
                            </div>


                        <div class="col-9">
                        <span class="align-middle">{comment.comment}</span>

                            <p class="text-center"></p>
                            
                            
                            </div>

                            <div class="col-1">
                            {comment.userID == getAuth().currentUser.uid ? <h5><a class="text-danger" onClick={() => {deleteComment(postCardID, comment.time)}}><i class="bi bi-trash "></i></a></h5> : <div></div>}

                            </div>

                            
                            </div>
                    </div>) : <div></div>}
                    
                </div>
            );
        }
    }

    // this function handles getting the post photo
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

    const collumnStyle = { gap:"100px"}
    const proPicStyle = {height: "5vw", maxHeight: "40px", minHeight:"40px"}


    // CSS Style that makes the images look nice
    const imageClass = { paddingLeft: "0px", marginRight: "px"}

    return (
        <div>

            
            <div class="input-group" >
                <input type="text" class="form-control mb-3" id="searchID" maxLength="100" name="search" placeholder="Search all posts" value={search} onChange={(e) => setSearch(e.target.value)} required/>    
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
                                            <h3 class="text-right text-success">${post.price}</h3>
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
                                <li class="list-group-item">
                                    <p class="lead">{post.description}</p>
                                </li>
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
                                            <h3 class="text-right text-success">${post.price}</h3>
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

export default PostCards;


// -------------------------------------------------------------
// OLD CODE THAT IS NOT BEING USED. MAY BE USEFUL LATER. 
// -------------------------------------------------------------

/*
        console.log("Key passed to call: " + key)
        if (key.length > 0) {
            setNextPostsLoading(true);
            PostUtils.postsNextBatch(key)
                .then((res) => {
                    setLastKey(res.lastKey);
                    setPosts(posts.concat(res.posts));
                    console.log(res.posts);
                    console.log(posts);
                    setNextPostsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setNextPostsLoading(false);
                });
        }
    };*/

     /*
    
        function loadmore() {
            console.log(postList);
            console.log(reversedPostList);
            console.log(index);
            const postTitleRef = query(ref(db, 'posts/'), limitToLast(10));
            console.log(postTitleRef);
            onValue(postTitleRef, (snapshot) => {
            const data = snapshot.val();
            
            for (let id in data) {
                
                postList.push(data[id]);
                setIndex(id);
            }
    
            
            console.log(postList);
            setReversedPostList(postList.reverse());
            
    
        })
            
    
            
        }*/


        /* useEffect(() => {
         if(isInitRender){
         setIsInitRender(false);
         postsFirstBatch().then((res) => {
             setPosts(res.tmpposts);
             setLastKey(res.lastKey);
             console.log(res.tmpposts);
         })
         .catch((err) => {
             console.log(err);
         });}
     }, []);
 
     
 
 
 
 
 
 
 
 
 
     async function fetchMorePosts (key) {
         if (key.length > 0) {
           setNextPostsLoading(true);
           postsNextBatch(key)
             .then((res) => {
               setLastKey(res.lastKey);
               // add new posts to old posts
               setPosts(posts.concat(res.posts));
               setNextPostsLoading(false);
             })
             .catch((err) => {
               console.log(err);
               setNextPostsLoading(false);
             });
         }
       }
 
 
 
             
            /* 
             setPostList(tempPostList);
             setReversedPostList(tempPostList.reverse());
             
             })
 
 
 
 
             const data = await db
                 .collection("posts")
                 .orderBy("createdAt", "desc")
                 .limit(5)
               .get();
       
             
             data.forEach((doc) => {
               posts.push({
                 postId: doc.id,
                 postContent: doc.data().postContent
               });
               lastKey = doc.data().createdAt;
             });
       
             return { posts, lastKey };
           } catch (e) {
             console.log(e);
           }
     })
 
     
 
 
             const postTitleRef = query(ref(db, 'posts/'), limitToLast(10));
             onValue(firstBatch, (snapshot) => {
             const data = snapshot.val();
             const tempPostList = [];
             var idCounter = 0;
             for (let id in data) {
                 idCounter = idCounter + 1;
                 tempPostList.push(data[id]);
 
 
                 //if(idCounter == 1) {
                     setIndex(id);
                 //};
                 
 
             }
             
             setPostList(tempPostList);
             setReversedPostList(tempPostList.reverse());
             
             })
 
             
         }
     }, [index, reversedPostList, postList]);
 
 
     
 
     const firstBatch = query(ref(db, 'posts/'), limitToLast(10));
     const nextBatch = query(ref(db, 'posts/'), startAfter(index), limitToLast(10));
 
     */

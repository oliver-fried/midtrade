import React, { useState, Redirect, useEffect } from "react";
import { getDatabase, query, limitToLast, ref, onValue, startAfter, orderByKey, startAt, limitToFirst, limit, endAt, endBefore } from "firebase/database";


import PostComments from "./PostComments";


import "bootstrap-icons/font/bootstrap-icons.css";



const PostCards = () => {



    const [posts, setPosts] = useState([]);
    const [lastKey, setLastKey] = useState("");
    const [nextPosts_loading, setNextPostsLoading] = useState(false);


    const db = getDatabase(); 


    useEffect(() => {


        // get the first 5 posts
        const batch = query(ref(db, 'posts/'), limitToLast(10));

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
                console.log(data[id])

            }
            setPosts(postsSnapshot.reverse())
            setLastKey(lastKeySnapshot)
        })
    }, []);

    const fetchMorePosts = (key) => {

        console.log(key);
        // get the first 5 posts
         const batch = query(ref(db, 'posts/'), orderByKey(), limitToLast(10), endAt(key));
         onValue(batch, (snapshot) => {
            console.log(snapshot)

             let postsSnapshot = [];
             let lastKeySnapshot = "";
             var isFirstPost = true;

             const data = snapshot.val();
             console.log(data);

             for (let id in data) {
                 postsSnapshot.push(data[id]);

                 if(isFirstPost) {
                    isFirstPost = false;
                    lastKeySnapshot = id;
                }

                 console.log(data[id])
 
             }
             setPosts(posts.concat(postsSnapshot.reverse()))
             setLastKey(lastKeySnapshot)
         })
     }
     
     
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


    const allPosts = (
        <div>
            {posts.map((post) => {
                return (
                    <div key={post.postId}>
                        <p>{post.postContent}</p>
                    </div>
                );
            })}
        </div>
    );




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






    const imageClass = { paddingLeft: "0px", paddingRight: "0px" }


    function imageDec(url) {
        if (url != "") {
            return <div class="" style={imageClass}><img src={url} class="img-fluid w-100" /> </div>

        }
        else {
            return <></>
        }
    }

    function handleDescription(desc, shortDesc) {
        if (shortDesc == desc) {
            return <>{desc}</>
        }

        else {
            return <>{shortDesc}...</>
        }
    }

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



    const proPicStyle = {
        textDecoration: "inherit",
        color: "inherit"
    }

    const descriptionStyle = { fontWeight: "light" }

    const noStyle = {
        textDecoration: "inherit",
        color: "inherit"
    }


    console.log(posts);

    return (

        <div>
            {posts ? posts.map((post, i) =>


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
                    <div class="collapse" id={"a" + post.postTime}>


                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <p class="lead">{post.description}</p>
                            </li>
                            <li class="list-group-item">



                            </li>


                        </ul>
                    </div>




                </div>



            ) : <div>adfadsf</div>}
            <div class="btn-group w-100 mb-3" role="group">
                <button type="submit" class="btn btn-primary" onClick={() => fetchMorePosts(lastKey)}>Load more</button>
            </div>

        </div>


    )



}

export default PostCards;

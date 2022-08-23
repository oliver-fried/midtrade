// --------------------------------------------------------
// This file takes all the post data from firebase and 
// displays them on post cards. It queries 10 posts initially
// and allows the user to query 10 more on each "Load more" 
// button click. 
//
// Oliver Fried, January 2022

import React, { useState, Redirect, useEffect } from "react";

import { getDatabase, limitToLast, ref, onValue, orderByKey, startAt, limitToFirst, endAt } from "firebase/database";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getAuth, signOut } from "firebase/auth";
import { ref as fireRef, set } from "firebase/database";
import { doc, FieldValue, getDocFromServer, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { collection, where, query, orderBy, startAfter, limit, getDocs, getFirestore, endBefore, setDoc } from "firebase/firestore";
import { getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createPortal } from "react-dom";
import DashboardCard from "./DashboardCard";


const DashboardCards = () => {

    const [posts, setPosts] = useState([]);
    const [lastKey, setLastKey] = useState("");
    const [nextPosts_loading, setNextPostsLoading] = useState(false);
    const [endOfData, setEndOfData] = useState(false);
    const [comment, setComment] = useState("");
    const [search, setSearch] = useState("");
    const [postedItemCardsViewing, setPostedItemCardsViewing] = useState(true);

    const db = getFirestore();

    useEffect(() => {

      
      var batch = query(collection(db, "posts/"), orderBy("postTime", "desc"), limit(5), where("userid", "==", getAuth().currentUser.uid));
      if(getAuth().currentUser.uid === "O43rYBlmIWPUvfme7TOy7iG4DtA3") {
         batch = query(collection(db, "posts/"), orderBy("postTime", "desc"), limit(5));
      }
        // get the first 5 posts

        const dbSnapshot = onSnapshot(batch, (querySnapshot) => {
            const postsSnapshot = [];
            let lastKeySnapshot = "";
            querySnapshot.forEach((doc) => {



                postsSnapshot.push(doc.data());


                lastKeySnapshot = doc.data().postTime;



            })

            setPosts(posts.concat(postsSnapshot));


            setLastKey(lastKeySnapshot);

        }

        )



    }, []);




    const fetchMorePosts = (key) => {
        var batch = null
        if(postedItemCardsViewing) {
             batch = query(collection(db, "posts/"), limit(20), orderBy("postTime", "desc"), startAfter(key), where("userid", "==", getAuth().currentUser.uid));
        }

        else {
                 batch = query(collection(db, "requests/"), limit(5), orderBy("postTime", "desc"), startAfter(key), where("userid", "==", getAuth().currentUser.uid));
        }
      

      if(batch === null ) {
          setEndOfData(true);
      }

      else {

      
      const dbSnapshot = onSnapshot(batch, (querySnapshot) => {

          console.log(querySnapshot);

          if (querySnapshot.empty === true) {
              setEndOfData(true);
          }

          
          const postsSnapshot = [];
          let lastKeySnapshot = "";
          querySnapshot.forEach((doc) => {




                  postsSnapshot.push(doc.data());


              lastKeySnapshot = doc.data().postTime;



          })


          setPosts(posts.concat(postsSnapshot));

          setLastKey(lastKeySnapshot);
      


      })}




  }


  const requestItemQuery = () => {
    setEndOfData(false)

      setPostedItemCardsViewing(false);


      var batch = query(collection(db, "requests/"), orderBy("postTime", "desc"), limit(5), where("userid", "==", getAuth().currentUser.uid));
      if(getAuth().currentUser.uid === "O43rYBlmIWPUvfme7TOy7iG4DtA3") {
         batch = query(collection(db, "requests/"), orderBy("postTime", "desc"), limit(5));
      }
        // get the first 5 posts

        const dbSnapshot = onSnapshot(batch, (querySnapshot) => {
            const postsSnapshot = [];
            let lastKeySnapshot = "";
            querySnapshot.forEach((doc) => {



                postsSnapshot.push(doc.data());


                lastKeySnapshot = doc.data().postTime;



            })

            setPosts(postsSnapshot);


            setLastKey(lastKeySnapshot);

        }

        )



  }

  const postedItemQuery = () => {
    setEndOfData(false)

      setPostedItemCardsViewing(true);


      var batch = query(collection(db, "posts/"), orderBy("postTime", "desc"), limit(20), where("userid", "==", getAuth().currentUser.uid));
      if(getAuth().currentUser.uid === "O43rYBlmIWPUvfme7TOy7iG4DtA3") {
         batch = query(collection(db, "posts/"), orderBy("postTime", "desc"), limit(20));
      }
        // get the first 5 posts

        const dbSnapshot = onSnapshot(batch, (querySnapshot) => {
            const postsSnapshot = [];
            let lastKeySnapshot = "";
            querySnapshot.forEach((doc) => {



                postsSnapshot.push(doc.data());


                lastKeySnapshot = doc.data().postTime;



            })

            setPosts(postsSnapshot);


            setLastKey(lastKeySnapshot);

        }

        )



  }


    const handleCommentSubmit = (postID, URL) => {

        const commentTime = Date.now();

        if (comment) {

            setDoc(doc(db, 'posts/' + postID + "/comments/" + commentTime), {
                comment: comment,
                initials: getAuth().currentUser.displayName.charAt(0) + getAuth().currentUser.displayName.split(" ")[1].charAt(0) + " '" + getAuth().currentUser.email.charAt(1) + getAuth().currentUser.email.charAt(2),
                userProPicURL: URL,
                userID: getAuth().currentUser.uid,
                time: commentTime

            });





        }

        setComment("");
    }


    // ----------------------------------
    //         HELPER FUNCTIONS
    // ----------------------------------


    


    // This gets more posts on each button click
    function loadMoreButton(displayBool) {
        if (!displayBool) {
            return (
                <div class="btn-group w-100 mb-3" role="group">
                    <button type="submit" class="btn btn-primary" onClick={() => fetchMorePosts(lastKey)}>Load more</button>
                </div>

            )
        }
        else {
            return (
                <div class="text-center">
                    <h5>You've reached the end!</h5></div>
            )
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

    function pricePrinting(givenPrice) {

        if (givenPrice != -1) {
        if (givenPrice == 0) {
            return <>Free</>
        }

        else {
            return <>${givenPrice}</>
        }
    }

    else {
        return <></>
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

    const collumnStyle = { gap: "100px" }
    const proPicStyle = { height: "5vw", maxHeight: "40px", minHeight: "40px" }

    // CSS Style that makes the images look nice
    const imageClass = { paddingLeft: "0px", marginRight: "px" }


    const onSeachChange = (e) => {
      setSearch(e.target.value);
  }



    return (
        <div>
            <div class="px-0">
                        <h1 >My Posts</h1>
                        </div>

<div class="btn-group w-100 mb-3 mt-2" role="group">
            <a onClick={() => postedItemQuery()} class={`btn ${
                  (postedItemCardsViewing) ? "btn-primary" : "btn-outline-primary"
                }`}>
               Posted Items</a>
              
            <a onClick={() => requestItemQuery()} class={`btn ${
                 (!postedItemCardsViewing) ? "btn-primary" : "btn-outline-primary"
                }`}>
               Requested Items</a>
               </div>

           


            {posts ? posts.map((post, i) =>
                <React.Fragment key={i}>
                    <DashboardCard post={post} search={search} noStyle={noStyle} pricePrinting={pricePrinting} imageDec={imageDec} setComment={setComment} timePrinting={timePrinting} comment={comment} handleCommentSubmit={handleCommentSubmit} postedItemCardsViewing={postedItemCardsViewing} />
                </React.Fragment>
            ) : <div>No posts</div>}
            {loadMoreButton(endOfData)}

        </div>
    )
}

export default DashboardCards;

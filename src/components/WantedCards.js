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
import { getStorage, uploadBytesResumable, getDownloadURL, ref as storageRef } from "firebase/storage";
import { createPortal } from "react-dom";
import PostCard from "./PostCard";


const WantedCards = () => {

    const [posts, setPosts] = useState([]);
    const [lastKey, setLastKey] = useState("");
    const [nextPosts_loading, setNextPostsLoading] = useState(false);
    const [endOfData, setEndOfData] = useState(false);
    const [comment, setComment] = useState("");
    const [search, setSearch] = useState("");
    const [searchedLast, setSearchedLast] = useState(false);
    const [searchByTime, setSearchByTime] = useState(true);

    const db = getFirestore();

    useEffect(() => {

        // get the first 5 posts
        const batch = query(collection(db, "requests/"), orderBy("postTime", "desc"), limit(7));

        const dbSnapshot = onSnapshot(batch, (querySnapshot) => {
            const postsSnapshot = [];
            let lastKeySnapshot = "";
            querySnapshot.forEach((doc) => {





               
                    postsSnapshot.push(doc.data());

                

                




                lastKeySnapshot = doc.data().postTime;



            })

            setPosts(posts.concat(postsSnapshot));
            setSearchedLast(false);


            setLastKey(lastKeySnapshot);

        }

        )



    }, []);

    const searchPrice = () => {

        setEndOfData(false)

        const batch = query(collection(db, "requests/"), orderBy("priceNum"), limit(7), where("priceNum", "!=", 0));

        const dbSnapshot = onSnapshot(batch, (querySnapshot) => {
            const postsSnapshot = [];
            let lastKeySnapshot = "";
            querySnapshot.forEach((doc) => {





               

                    postsSnapshot.push(doc.data());

                

               





                lastKeySnapshot = doc.data().postTime;



            })

            setPosts(postsSnapshot);
            setSearchedLast(false);
            setSearchByTime(false)
            setLastKey(lastKeySnapshot);

        })
    }

     const searchTime = () => {
        setEndOfData(false)

        const batch = query(collection(db, "requests/"), orderBy("postTime", "desc"), limit(7));

        const dbSnapshot = onSnapshot(batch, (querySnapshot) => {
            const postsSnapshot = [];
            let lastKeySnapshot = "";
            querySnapshot.forEach((doc) => {





                

                    postsSnapshot.push(doc.data());

                

               



                lastKeySnapshot = doc.data().postTime;



            })

            setPosts(postsSnapshot);
            setSearchedLast(false);
            setSearchByTime(true)

            setLastKey(lastKeySnapshot);

        })

    }
    const handleSearch = (e) => {
        setEndOfData(false)

        if(searchByTime) {
            var batch = query(collection(db, "requests/"), orderBy("postTime"), limit(7), where("postDescCombined", "array-contains", search));
        }
        if(!searchByTime) {
            batch = query(collection(db, "requests/"), orderBy("priceNum"), limit(7), where("postDescCombined", "array-contains", search), where("priceNum", "!=", 0));
        }


        const dbSnapshot = onSnapshot(batch, (querySnapshot) => {
            const postsSnapshot = [];
            let lastKeySnapshot = "";
            querySnapshot.forEach((doc) => {



            
                    postsSnapshot.push(doc.data());

                

                lastKeySnapshot = doc.data().postTime;



            })

            setPosts(postsSnapshot);
            setSearchedLast(true);

            setLastKey(lastKeySnapshot);

        })

    }


   

    const fetchMorePosts = (key) => {
        
       
        
        var batch = null; 

        if(searchedLast && searchByTime) {
             batch = query(collection(db, "requests/"), orderBy("postTime"), limit(7), startAfter(key), where("postDescCombined", "array-contains", search));
        }

        else if(searchedLast && !searchByTime) {
             batch = query(collection(db, "requests/"), orderBy("priceNum"), limit(7), startAfter(key), where("postDescCombined", "array-contains", search), where("priceNum", "!=", 0));
        }

        else if(!searchedLast && !searchByTime) {
             batch = query(collection(db, "requests/"), limit(7), orderBy("priceNum"), startAfter(key), where("priceNum", "!=", 0));
        }

        else if(!searchedLast && searchByTime){
             batch = query(collection(db, "requests/"), limit(7), orderBy("postTime", "desc"), startAfter(key));
        }




        if(batch === null ) {
            setEndOfData(true);
        }

        else {

        
        const dbSnapshot = onSnapshot(batch, (querySnapshot) => {


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


    
    const handleCommentSubmit = (postID, URL, postTitle, postOwnerEmail) => {

        const commentTime = Date.now();
        if (comment) {

            setDoc(doc(db, 'posts/' + postID + "/comments/" + commentTime), {
                comment: comment,
                initials: getAuth().currentUser.displayName.charAt(0) + getAuth().currentUser.displayName.split(" ")[1].charAt(0) + " '" + getAuth().currentUser.email.charAt(1) + getAuth().currentUser.email.charAt(2),
                userProPicURL: URL,
                userID: getAuth().currentUser.uid,
                time: commentTime

            });

            
            setDoc(doc(db, "mail/" + commentTime), {
                to: postOwnerEmail,
                message: {
                  subject: 'New comment on post "' + postTitle +'"',
                  html: getAuth().currentUser.displayName.charAt(0) + getAuth().currentUser.displayName.split(" ")[1].charAt(0) + " '" + getAuth().currentUser.email.charAt(1) + getAuth().currentUser.email.charAt(2) + ' just commented "' + comment +'" on your post titled "' + postTitle +'".<br><br><a href="Midtrade.us/dashboard">Midtrade.us/dashboard</a>',
                },
            })




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
    function imageDec(givenURL, imageTitle) {

            
            //var url = getDownloadURL(storageRef(getStorage(), "images/" + imageTitle))
        
            if(givenURL != "") {
                return <div class="" style={imageClass}><img src={givenURL} class="img-fluid w-100" /> </div>
            }
            else {
                return <></>
            }

        }
        

         
    

    // This function takes the initial post time and calculates a realtime 
    // time since post to be displayed on the card header
    function timePrinting(postTime, date, room, initials, phoneNumber) {

        phoneNumber ? (phoneNumber = "" + phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, 10)) : phoneNumber = phoneNumber

        if ((Date.now() - postTime) <= 60000) {
            return <p><i class="bi bi-clock mr-1"></i> moments ago<i class="bi bi-dot mr-1"></i> {initials} {phoneNumber ? (<><i class="bi bi-dot mr-2"></i> <i class="bi bi-telephone"></i> {phoneNumber}</>) : <></>}
            </p>
        }

        else if ((Date.now() - postTime) < 3600000) {
            return <p><i class="bi bi-clock ml-3"></i> {Math.ceil((Date.now() - postTime) / 60000)} minutes ago  <i class="bi bi-dot mr-2"></i> {initials} {phoneNumber ? (<><i class="bi bi-dot mr-2"></i> <i class="mr-1 bi bi-telephone"></i> {phoneNumber}</>) : <></>}</p>
        }

        else if ((Date.now() - postTime) < 36000000) {
            return <p><i class="bi bi-clock mr-1"></i> {Math.floor((Date.now() - postTime) / 3600000)} hrs ago <i class="bi bi-dot mr-2"></i> {initials} {phoneNumber ? (<><i class="bi bi-dot mr-2"></i> <i class=" mr-1 bi bi-telephone"></i> {phoneNumber}</>) : <></>}</p>
        }

        else {
            return <p><i class="bi bi-clock mr-1"></i> {date}<i class="bi bi-dot mr-1"></i> {initials}{phoneNumber ? (<><i class="bi bi-dot mr-2"></i> <i class="bi bi-telephone mr-1"></i>{phoneNumber}</>) : <></>}</p>
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

    window.onload=function(){

    var field = document.querySelector('[name="search"]');

    field.addEventListener('keypress', function ( event ) {  
       var key = event.keyCode;
        if (key === 32) {
          event.preventDefault();
        }
    });}

    const onSeachChange = (e) => {
        setSearch(e.target.value);
    }

    return (
        <div>
            
            <div class="px-1">
                        <h1 >Wanted</h1>
                        </div>
 
            
            <div class="mb-3">
            <div class="input-group">
            <input type="text" class="form-control mb-0"  id="searchID" pattern="[1-5A-CNO]" maxLength="100"  name="search"  placeholder="Search..." aria-describedby="basic-addon1" onChange={onSeachChange} required />  <div class="input-group-append">
            
    <button class="btn btn-primary" type="button"  onClick={() => handleSearch()}><i class="bi bi-search "></i></button>
    
  </div>
  
                </div>
                <small id="room" class="form-text text-muted mb-3">
                    One-word queries are only supported at this time.
                    </small></div>

                    


            {posts ? posts.map((post, i) =>
                <React.Fragment key={i}>
                    <PostCard post={post} search={search} noStyle={noStyle} pricePrinting={pricePrinting} imageDec={imageDec} setComment={setComment} timePrinting={timePrinting} comment={comment} handleCommentSubmit={handleCommentSubmit} />
                </React.Fragment>
            ) : <div>No posts</div>}
            {loadMoreButton(endOfData)}

        </div>
    )
}

export default WantedCards;
import React, { useState, Redirect, useEffect } from "react";

import { getDatabase, query, limitToLast, ref, onValue, set} from "firebase/database";
import { getStorage, ref as refStorage, getDownloadURL } from "firebase/storage";
import PostComments from "./PostComments";
import { getAuth } from "firebase/auth";


import "bootstrap-icons/font/bootstrap-icons.css";



const PostCards = () => {
    const [postList, setPostList] = useState("");
    const [reversedPostList, setReversedPostList] = useState("");
    const [postCardURL, setPostCardURL] = useState("")
    const [imageURL, setImageURL] = useState("");
    const storage = getStorage();
    const [comment, setComment] = useState("");
    const db = getDatabase();
    const [amountOfPosts, setAmountOfPosts] = useState("");


    

    useEffect(() => {

    const postTitleRef = query(ref(db, 'posts/'), limitToLast(9999));
    onValue(postTitleRef, (snapshot) => {
    const data = snapshot.val();
    const postList = [];

    for (let id in data) {

        postList.push(data[id]);
    }

    setPostList(postList);
    setReversedPostList(postList.reverse());
    

})
    
    
});

    const imageClass = {paddingLeft: "0px", paddingRight: "0px"}

    
    function imageDec(url) {
        if(url != "") {
            return  <div class="" style={imageClass}><img src={url} class="img-fluid w-100"/> </div>

        }
        else {
            return <></>
        }
    }

    function handleDescription(desc, shortDesc) {
        if(shortDesc == desc){
            return <>{desc}</>
        }

        else {
            return <>{shortDesc}...</>
        }
    }

    function timePrinting(postTime, date, room, initials) {
       
        if((Date.now() - postTime) <= 60000) {
            return <p><i class="bi bi-clock mr-1"></i> moments ago<i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"> </i>{room}<i class="bi bi-dot mr-1"></i> {initials}</p>
        }
        
        else if((Date.now() - postTime) < 3600000) {
            return <p><i class="bi bi-clock ml-3"></i> {Math.ceil((Date.now() - postTime) / 60000)} minutes ago <i class="bi bi-dot mr-1"> </i><i class="bi bi-geo-alt"> </i>{room} <i class="bi bi-dot mr-1"></i> {initials}</p>
        }

        else if((Date.now() - postTime) < 36000000) {
            return <p><i class="bi bi-clock mr-1"></i> {Math.floor((Date.now() - postTime) / 3600000)} hrs ago <i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"> </i>{room}<i class="bi bi-dot mr-1"></i> {initials}</p>
        }
        
        else {
            return <p><i class="bi bi-clock mr-1"></i> {date}<i class="bi bi-dot mr-1"></i><i class="bi bi-geo-alt"> </i>{room}<i class="bi bi-dot mr-1"></i> {initials}</p>
        }  
    }
    
    

    const proPicStyle = {textDecoration: "inherit",
                        color: "inherit"}

    const descriptionStyle = {fontWeight: "light"}

    const noStyle = {textDecoration: "inherit",
    color: "inherit"}
     

    return(
    
        <div>
            {reversedPostList ? reversedPostList.map((post) => 
                

                <div class="card mb-4">
                    <a  data-bs-toggle="collapse" href={post.idSelector} style={noStyle} role="button" aria-expanded="false" aria-controls="collapseExample">
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
                


            ) : "" }

        </div>  
        
    )
}

export default PostCards;

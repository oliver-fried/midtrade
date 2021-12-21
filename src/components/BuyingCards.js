import React, { useState, Redirect, useEffect } from "react";

import { getDatabase, query, limitToLast, ref, onValue} from "firebase/database";

import "bootstrap-icons/font/bootstrap-icons.css";



function BuyingCards() {
    const [postList, setPostList] = useState("");
    const [reversedPostList, setReversedPostList] = useState("");
    const [postCardURL, setPostCardURL] = useState("")
    const [imageURL, setImageURL] = useState("");


    
    
    
    


    useEffect(() => {

        
        

    const db = getDatabase();
    
    
    const postTitleRef = query(ref(db, 'requests/'), limitToLast(50));
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
    
    

    const proPicStyle = {textDecoration: "inherit",
                        color: "inherit"}

    
    return(
    
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
                        <h5 class="card-text font-weight-normal mb-0">{post.description}</h5>
                        
                        
                    </div>
                </div>

            ) : "" }
        </div>  
        
    )
}

export default BuyingCards;

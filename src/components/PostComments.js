import React, { useCallback, Redirect, useContext, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthProvider } from "../Auth";
import { getDatabase, query, limitToLast, ref, onValue, set} from "firebase/database";




const PostComments = ({postID, initials}) => {
    const [comment, setComment] = useState("");
    const [postTitle, setPostTitle] = useState("");

    function placeHolder(initials) {
        return "Comment as " + initials;
    }

    function getComments(postID) {
        
    }


    function handleSubmit(postID, commentMessage) {
        const db = getDatabase();

        const commentTime = Date.now();
        set(ref(db, 'posts/' + postID + "/comments/" + commentTime), {
          time: commentTime,
          userID: getAuth().currentUser.uid,
          initials: getAuth().currentUser.displayName.charAt(0) + getAuth().currentUser.displayName.split(" ")[1].charAt(0) + " '" + getAuth().currentUser.email.charAt(1) + getAuth().currentUser.email.charAt(2),
          comment: commentMessage
        
        });
      }



    return (
        <AuthProvider>

            <form onSubmit={handleSubmit(postID, comment)}>
                <div class="input-group mb-3">
                <input type="text" class="form-control" id="formGroupExampleInput" placeholder={placeHolder(initials)} value={comment} onChange={(e) => setComment(e.target.value)} required/>
                    <div class="input-group-append">
                        <button class="btn btn-outline-primary" type="button">Post</button>
                    </div>
                </div>
            </form>
            <h5>Comments</h5>
                                
            
            
 

        </AuthProvider>
    )
}

export default PostComments;
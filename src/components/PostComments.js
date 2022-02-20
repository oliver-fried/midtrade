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

            
               
        
            <h5>Commentsasdfdsa</h5>
                                
            
            
 

        </AuthProvider>
    )
}

export default PostComments;
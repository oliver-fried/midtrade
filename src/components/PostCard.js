import "bootstrap-icons/font/bootstrap-icons.css";
import { getAuth } from "firebase/auth";
import React, { useState, Redirect, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { collection, where, query, orderBy, startAfter, limit, getDocs, deleteDoc, getFirestore, doc, endBefore, setDoc } from "firebase/firestore";

const collumnStyle = { gap: "100px" }
const proPicStyle = { height: "5vw", maxHeight: "40px", minHeight: "40px" }

const deleteComment = (postCardID, commentID) => {

    const db = getFirestore();
    deleteDoc(doc(db, 'posts/' + postCardID + "/comments/", `${commentID}`))
}


const CommentsDisplay = ( {postTime, postCommentsArray} ) => {
    if (!postCommentsArray) {
        return <div></div>
    }

    else {
        return (
            <div>
                {postCommentsArray.map((comment) =>
                    <div  >


                        <div class="d-block d-xs-block d-sm-none">
                            <div class="row mb-3">
                                <div class="col-2 m-0" style={collumnStyle}>
                                    <span class="align-middle">
                                        <img class="rounded-circle img-responsive" style={proPicStyle} src={comment.userProPicURL} />
                                    </span>
                                </div>
                                <div class="col-8 m-0">
                                    <span class="align-middle">{comment.comment}</span>
                                    <p class="text-center"></p>
                                </div>
                                <div class="col-1 m-0">
                                    {comment.userID == getAuth().currentUser.uid ? <h5><a class="text-danger" onClick={() => deleteComment(postTime, comment.time)}><i class="bi bi-trash "></i></a></h5> : <div></div>}
                                </div>
                            </div>
                        </div>

                        <div class="d-none d-xs-none d-sm-block d-xl-none">
                            <div class="row mb-3">
                                <div class="col-2 m-0" style={collumnStyle}>
                                    <span class="align-middle">
                                        <img class="rounded-circle img-responsive" style={proPicStyle} src={comment.userProPicURL} />
                                    </span>
                                </div>
                                <div class="col-8 m-0">
                                    <span class="align-middle">{comment.comment}</span>
                                    <p class="text-center"></p>
                                </div>
                                <div class="col-1 m-0">
                                    {comment.userID == getAuth().currentUser.uid ? <h5><a class="text-danger" onClick={() => deleteComment(postTime, comment.time)}><i class="bi bi-trash "></i></a></h5> : <div></div>}
                                </div>
                            </div>
                        </div>

                        <div class="d-none d-lg-none d-xl-block">
                            <div class="row mb-3">
                                <div class="col-1 m-1" style={collumnStyle}>
                                    <span class="align-middle">
                                        <img class="rounded-circle img-responsive" style={proPicStyle} src={comment.userProPicURL} />
                                    </span>
                                </div>
                                <div class="col-9 m-1">
                                    <span class="align-middle">{comment.comment}</span>
                                    <p class="text-center"></p>
                                </div>
                                <div class="col-1 m-0">
                                    {comment.userID == getAuth().currentUser.uid ? <h5><a class="text-danger" onClick={() => deleteComment(postTime, comment.time)}><i class="bi bi-trash "></i></a></h5> : <div></div>}
                                </div>
                            </div>
                        </div>



                    </div>)}

            </div>
        );
    }

}

const PostCard = ({ post, search, noStyle, pricePrinting, imageDec, setComment, timePrinting, comment, handleCommentSubmit, }) => {
    const [comments, setComments] = useState([])
    useEffect(() => onSnapshot(query(collection(getFirestore(), "posts/" + post.postTime + "/comments/")),
        commentsSnapshot => setComments(commentsSnapshot.docs.map(doc => doc.data()))), [])

    return <div>
         <div>







            <div class="card mb-4">
                <a data-bs-toggle="collapse" href={post.idSelector} style={noStyle} role="button" aria-expanded="true" aria-controls="collapseExample">
                    <div class="card-header">
                            <div class="row no-gutters">
                                <div class="col-8 ">
                                    <h3>{post.postTitle}</h3>
                                </div>
                                <div class="col text-end ">
                                    <h3 class="text-right text-success">{pricePrinting(post.price)}</h3>

                                   

                                </div>


                        </div>
                    </div>

                    <div class="card-body w-100">
                        <p class="card-text text-muted">{timePrinting(post.postTime, post.date, post.room, post.initials)}</p>
                    {post.phoneNumber ? <h6 class="card-text text-muted">{post.phoneNumber}</h6> : <></>}
                        {post.downloadURL ? imageDec(post.downloadURL) : <div></div>}
                    </div>
                </a>

                <div class="collapse" id={"a" + post.postTime}>
                    <ul class="list-group list-group-flush">
                        <a data-bs-toggle="collapse" href={post.idSelector} style={noStyle} role="button" aria-expanded="true" aria-controls="collapseExample">
                            <li class="list-group-item">
                                <label for="posttitle" class="form-label"><h6>Description</h6></label>

                                <p class="lead">{post.description}</p>
                            </li>
                        </a>
                        <li class="list-group-item">


                            <div class="mb-3">
                                <label for="posttitle" class="form-label"><h6>Comments</h6></label>
                                <CommentsDisplay postTime={post.postTime} postCommentsArray={comments} />
                                <div class="input-group mt-3" >
                                    <input type="text" class="form-control" id="commentID" maxLength="100" name="comment" placeholder="Comment publicly" value={comment} onChange={(e) => setComment(e.target.value)} required />

                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="submit" onClick={() => handleCommentSubmit(post.postTime, getAuth().currentUser.photoURL, post.postTitle, post.email)}>Post</button>
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


        </div>


    </div>
}

export default PostCard
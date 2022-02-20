import { getDefaultNormalizer } from "@testing-library/react";
import { getDatabase, query, limitToLast, ref, onValue, startAfter, orderByChild, orderByKey, startAt, limitToFirst, limit, endAt, endBefore } from "firebase/database";


export default {
  /**
   * this function will be fired when the app is first time run,
   * and it will fetch first 5 posts, here i retrieve them in desc order,
   * until show last added post first.
   */



    postsFirstBatch: async () => {
    
       const db = getDatabase();
      const batch = query(ref(db, 'posts/'), limitToLast(10));

      let posts = [];
      let lastKey = "";        


      onValue(batch, (snapshot) => {
        const data = snapshot.val();
        for (let id in data) {
            posts.push(data[id]);

            lastKey = id;
            console.log(data[id])

        }
        //console.log(posts);
    })
        
    

    return { posts, lastKey };
    
  },

  /**
   * this function will be fired each time the user click on 'More Posts' button,
   * it receive key of last post in previous batch, then fetch next 5 posts
   * starting after last fetched post.  
   */
  postsNextBatch: async (key) => {
    try {

      console.log("Key passed: " + key);
      const db = getDatabase();
      const batch = query(ref(db, 'posts/'), orderByKey(), endAt(key), limitToLast(10));

      let posts = [];
      let lastKey = "d";        


      onValue(batch, (snapshot) => {
        const data = snapshot.val();
        
        var isFirstPost = true;
        console.log("Data retrieved from query: ")
        console.log(data)
        for (let id in data) {
          console.log(isFirstPost);
          if(isFirstPost) {
            isFirstPost = false;
            lastKey = id;
            console.log(lastKey)

          }
            posts.push(data[id]);

            

        }

        console.log("post retrieved: ")
        console.log(posts);
    })
        
    posts.reverse();

    return { posts, lastKey };
    } catch (e) {
      console.log(e);
    }
}
};

import {friendsActions} from "./friends-slice";

export const fetchFriends = () => {
   return async (dispatch) => {
      try {
         const response = await fetch("http://localhost:5000/Friends/list-friends", {credentials: 'include'});
         const data = await response.json();

         if (data.error) {
            throw new Error(data.error);
         }

         dispatch(friendsActions.setFriends({friends: data, error: null}));
      } catch (err) {
         dispatch(friendsActions.setFriends({friends: null, error: err.message}));
      }
   }
}

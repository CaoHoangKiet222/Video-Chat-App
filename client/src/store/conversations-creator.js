import {conversationActions} from "./conversations-slice";
import {userActions} from "./user-slice";

export const fetchConversation = () => {
   return async (dispatch) => {
      try {
         const response = await fetch("http://localhost:5000/Chats/conversation", {credentials: 'include'});
         const data = await response.json();

         if (data.error) {
            throw new Error(data.error);
         }

         dispatch(conversationActions.setConversation({conversation: data, error: null}));

         dispatch(userActions.login({user: data.user}));
      } catch (err) {
         console.log(err);
         dispatch(conversationActions.setConversation({conversation: null, error: err.message}));
      }
   }
}

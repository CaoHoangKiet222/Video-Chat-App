import { callsActions } from "./calls-slice";

export const fetchCalls = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT_SERVER}/get-calls`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch(callsActions.setCalls({ calls: data, error: null }));
    } catch (err) {
      dispatch(callsActions.setCalls({ calls: null, error: err.message }));
    }
  };
};

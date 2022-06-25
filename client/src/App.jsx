import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import MeetingRoom from "./components/Friends/MeetingRoom/MeetingRoom";
import Login from "./components/Login/Login";
import MeetingGroupRoom from "./components/MeetingGroup/MeetingGroupRoom/MeetingGroupRoom";
import { authActions } from "./store/auth-slice";

function App() {
  console.log("App running");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signupRef = useRef(false);

  useEffect(() => {
    if (signupRef.current) {
      return;
    }

    const isAuth = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT_SERVER}/isAuth`,
        { credentials: "include" }
      );

      const data = await response.json();
      console.log(data);

      if (!data.isAuth) {
        return navigate("/login");
      }

      dispatch(authActions.setAuth({ auth: true }));
    };

    isAuth();
  }, [navigate, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <Login
            title="Sign Into "
            formType="login"
            isSignUp={false}
            formCheck="Remember me"
            button="Login"
            paraph="Don't have an account? "
            link="Register here"
            linkTo="signup"
            signupRef={signupRef}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <Login
            title="Sign Up "
            formType="signup"
            isSignUp={true}
            formCheck="I agree to the terms of service"
            button="Register"
            paraph="Already a member? "
            link="Login here"
            linkTo="login"
            signupRef={signupRef}
          />
        }
      />
      <Route path="/video-chat/*" element={<Chat />} />
      <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
      <Route path="/meeting-group/:meetingId" element={<MeetingGroupRoom />} />
    </Routes>
  );
}

export default App;

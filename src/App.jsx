import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Chat from "./components/Chat/Chat";
import MeetingRoom from "./components/Friends/MeetingRoom/MeetingRoom";
import Login from "./components/Login/Login";
import MeetingGroupRoom from "./components/MeetingGroup/MeetingGroupRoom/MeetingGroupRoom";
import { authActions } from "./store/auth-slice";
import { userActions } from "./store/user-slice";

function App() {
  console.log("App running");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signupRef = useRef(false);
  const passResetRef = useRef(false);
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    try {
      if (signupRef.current || passResetRef.current) {
        return;
      }

      const checkCookieExpiration = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/isExpiredCookie`,
          { credentials: "include" }
        );

        const data = await response.json();
        console.log(data);

        if (data.expireCookie) {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            html: "Session cookie had been expired, please login again!!!",
            showConfirmButton: true,
            allowOutsideClick: false,
          }).then(() => {
            dispatch(userActions.logout());
            navigate("/login");
          });
        }
        if (!data.isAuth) {
          dispatch(authActions.setAuth({ auth: false }));
          return navigate("/login");
        }

        dispatch(authActions.setAuth({ auth: true }));
      };
      checkCookieExpiration();
    } catch (error) {
      console.log(error);
    }
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
            isResetPass={false}
            formCheck="Remember me"
            button="Login"
            paraph="Don't have an account? "
            link="Register here"
            linkTo="signup"
            signupRef={signupRef}
            passResetRef={passResetRef}
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
            isResetPass={false}
            formCheck="I agree to the terms of service"
            button="Register"
            paraph="Already a member? "
            link="Login here"
            linkTo="login"
            signupRef={signupRef}
            passResetRef={passResetRef}
          />
        }
      />
      <Route
        path="/reset-password"
        element={
          <Login
            title="Email To Reset "
            formType="password-reset"
            isSignUp={false}
            isResetPass={true}
            formCheck="I agree to the terms of service"
            button="Send Reset Link"
            paraph="Already a member? "
            link="Login here"
            linkTo="login"
            signupRef={signupRef}
            passResetRef={passResetRef}
          />
        }
      />
      <Route
        path="/reset-password/new-pass"
        element={
          <Login
            title="New Password For "
            formType="new-password"
            isSignUp={false}
            isResetPass={true}
            button="Submit"
            paraph="Already remember? "
            link="Login here"
            linkTo="login"
            signupRef={signupRef}
            passResetRef={passResetRef}
          />
        }
      />
      <Route path="/video-chat/*" element={auth && <Chat />} />
      <Route path="/meeting/:meetingId" element={auth && <MeetingRoom />} />
      <Route
        path="/meeting-group/:meetingId"
        element={auth && <MeetingGroupRoom />}
      />
    </Routes>
  );
}

export default App;

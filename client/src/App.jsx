import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Login from "./components/Login/Login";

function App() {
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
          />
        }
      />
      <Route path="/video-chat/*" element={<Chat />} />
    </Routes>
  );
}

export default App;

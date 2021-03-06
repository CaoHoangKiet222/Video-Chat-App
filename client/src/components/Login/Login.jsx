import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Content,
  FormContainer,
  FormSection,
  Logo,
  MainTitle,
  Form,
  FormGroup,
  FormCheck,
  CheckBox,
  LoginButton,
  SocialList,
  List,
  ExtraLogin,
  Circle,
} from "./Login.styled";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "../UI/Loading";
import { FiFacebook } from "react-icons/fi";
import { IoLogoGoogle } from "react-icons/io5";
import { fetchLogin, fetchLoginByFirebase } from "../../store/user-creator";
import { Fade, Flip } from "react-awesome-reveal";
import Swal from "sweetalert2";
import { userActions } from "../../store/user-slice";
import { signInWithPopup } from "firebase/auth";
import {
  authFirebase,
  googleProvider,
  facebookProvider,
  githubProvider,
} from "../../utilities/firebase";
import { VscGithubInverted } from "react-icons/vsc";

const Login = (props) => {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [isTermsService, setIsTermService] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const resetAllUseState = useCallback(() => {
    setEmail("");
    setPassword("");
    setConfirmPass("");
    setIsRemember(false);
    setIsTermService(false);
  }, []);

  useEffect(() => {
    if (!props.isSignUp) {
      // userState.error === null important statement
      // if ((userState.error === null && userState.user) || auth) {
      //   navigate("/video-chat/Chats");
      // }
      if (auth) {
        navigate("/video-chat/Chats");
      }
    }
  }, [userState, navigate, props.isSignUp, props, auth]);

  useEffect(() => {
    if (props.isSignUp) {
      navigate("/signup");
      props.signupRef.current = true;
    } else {
      props.signupRef.current = false;
    }

    if (props.isResetPass) {
      props.passResetRef.current = true;
    } else {
      props.passResetRef.current = false;
    }
    resetAllUseState();
  }, [
    props.isSignUp,
    navigate,
    dispatch,
    props.signupRef,
    props.passResetRef,
    props.isResetPass,
    resetAllUseState,
  ]);

  useEffect(() => {
    userState.error &&
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: userState.error,
        showConfirmButton: true,
        allowOutsideClick: false,
      }).then(() => {
        dispatch(
          userActions.login({
            user: null,
            isFetch: false,
            error: null,
          })
        );
      });
  }, [userState.error, dispatch]);

  const submitHandle = (e) => {
    e.preventDefault();

    dispatch(
      fetchLogin(
        `${process.env.REACT_APP_ENDPOINT_SERVER}/${
          props.formType === "new-password"
            ? props.formType +
              "/" +
              new URLSearchParams(window.location.search).get("token")
            : props.formType
        }`,
        {
          email,
          password,
          confirmPass,
        },
        props.formType,
        navigate,
        props.signupRef,
        props.passResetRef,
        resetAllUseState
      )
    );
  };

  const loginWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(authFirebase, googleProvider);
      if (!user.email) {
        throw new Error("Login fail due to unspecific email!!");
      }
      dispatch(
        fetchLoginByFirebase(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/login-by-firebase`,
          user,
          "google",
          navigate
        )
      );
    } catch (error) {
      console.log(error);
      dispatch(
        userActions.login({
          user: null,
          isFetch: false,
          error: error.message,
        })
      );
    }
  };

  const loginWithGithub = async () => {
    try {
      const { user } = await signInWithPopup(authFirebase, githubProvider);
      dispatch(
        fetchLoginByFirebase(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/login-by-firebase`,
          {
            displayName: user.reloadUserInfo.displayName,
            email: user.reloadUserInfo.screenName + "@gmail.com",
            photoURL: user.reloadUserInfo.photoUrl,
            phoneNumber: user.phoneNumber,
          },
          "github",
          navigate
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const { user } = await signInWithPopup(authFirebase, facebookProvider);

      if (!user.providerData[0].email) {
        throw new Error("Login fail due to unspecific email!!");
      }

      dispatch(
        fetchLoginByFirebase(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/login-by-firebase`,
          user.providerData[0],
          "facebook",
          navigate
        )
      );
    } catch (error) {
      console.log(error);
      dispatch(
        userActions.login({
          user: null,
          isFetch: false,
          error: error.message,
        })
      );
    }
  };

  return (
    <Container>
      <Content>
        {!userState.error && (
          <FormContainer>
            <FormSection>
              <Circle />
              <Circle />
              <Flip>
                <Logo>
                  <div>
                    <img src="/images/logo-login.png" alt="" />
                  </div>
                </Logo>
              </Flip>
              <MainTitle>
                <Fade direction="down" delay={100}>
                  <h3>
                    <span>{props.title}</span>
                    <span>Your Account</span>
                  </h3>
                </Fade>
              </MainTitle>
              <Form
                isSignup={props.isSignUp}
                isResetPass={props.isResetPass}
                formType={props.formType}
                onSubmit={submitHandle}
              >
                {!(props.formType === "new-password") && (
                  <FormGroup>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                )}
                {(!(props.formType === "password-reset") ||
                  props.formType === "new-password") && (
                  <FormGroup>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                )}
                {(props.isSignUp || props.formType === "new-password") && (
                  <FormGroup>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPass}
                      required
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </FormGroup>
                )}
                {!props.isResetPass && (
                  <CheckBox>
                    <FormCheck>
                      {props.isSignUp ? (
                        <input
                          type="checkbox"
                          checked={isTermsService}
                          onChange={(e) => setIsTermService(e.target.checked)}
                          required
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={isRemember}
                          onChange={(e) => setIsRemember(e.target.checked)}
                        />
                      )}
                      <label>{props.formCheck}</label>
                    </FormCheck>
                    {!props.isSignUp && (
                      <Link to="/reset-password">Forgot your password?</Link>
                    )}
                  </CheckBox>
                )}
                <LoginButton>
                  {userState.isFetch ? (
                    <LoadingSpinner />
                  ) : (
                    <button type="submit">{props.button}</button>
                  )}
                </LoginButton>
                <ExtraLogin>
                  <span>Or Login With</span>
                </ExtraLogin>
                <SocialList>
                  <List isFb={true} onClick={loginWithFacebook}>
                    <div>
                      <FiFacebook />
                      <span>Facebook</span>
                    </div>
                  </List>
                  <List isGithub={true} onClick={loginWithGithub}>
                    <div>
                      <VscGithubInverted />
                      <span>Github</span>
                    </div>
                  </List>
                  <List isGoogle={true} onClick={loginWithGoogle}>
                    <div>
                      <IoLogoGoogle />
                      <span>Google</span>
                    </div>
                  </List>
                </SocialList>
              </Form>
              <p>
                {props.paraph}
                <Link to={`/${props.linkTo}`}>{props.link}</Link>
              </p>
            </FormSection>
          </FormContainer>
        )}
      </Content>
    </Container>
  );
};

export default Login;

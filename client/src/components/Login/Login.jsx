import React, { useState, useEffect } from "react";
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
import { FiFacebook, FiTwitter } from "react-icons/fi";
import { IoLogoGoogle } from "react-icons/io5";
import { fetchLogin } from "../../store/user-creator";
import { Fade, Flip } from "react-awesome-reveal";
import Swal from "sweetalert2";
import { userActions } from "../../store/user-slice";

const Login = (props) => {
  console.log("Login running");
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [isTermsService, setIsTermService] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // const handleCredentialResponse = (response) => {
  //   console.log(response.credential);
  // };
  //
  // useEffect(() => {
  //   console.log(window.google);
  //   window.google?.accounts.id.initialize({
  //     client_id:
  //       "989782942339-0peqjbst2eaik1cl6vnhaulkcdjlp4na.apps.googleusercontent.com",
  //     callback: handleCredentialResponse,
  //   });
  //   window.google?.accounts.id.renderButton(
  //     document.getElementById("signInAnchor"),
  //     { theme: "outline", size: "large" }
  //   );
  // }, []);

  useEffect(() => {
    if (!props.isSignUp) {
      // userState.error === null important statement
      if ((userState.error === null && userState.user) || auth) {
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
    setEmail("");
    setPassword("");
    setConfirmPass("");
    setIsRemember(false);
    setIsTermService(false);
  }, [props.isSignUp, navigate, dispatch, props.signupRef]);

  useEffect(() => {
    userState.error &&
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: userState.error,
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
        `${process.env.REACT_APP_ENDPOINT_SERVER}/${props.formType}`,
        {
          email,
          password,
          confirmPass,
          isRemember,
        },
        props.formType,
        navigate,
        props.signupRef
      )
    );
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
                  <a href="#">
                    <img src="/images/logo-login.png" alt="" />
                  </a>
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
              <Form isSignup={props.isSignUp} onSubmit={submitHandle}>
                <input
                  type="hidden"
                  name="clientHome"
                  value={window.location.origin}
                />
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
                {props.isSignUp && (
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
                  <List isFb={true}>
                    <a href="#">
                      <FiFacebook />
                      <span>Facebook</span>
                    </a>
                  </List>
                  <List isTwitter={true}>
                    <a href="#">
                      <FiTwitter />
                      <span>Twitter</span>
                    </a>
                  </List>
                  <List isGoogle={true} className="g-signin2">
                    <div href="#" id="signInAnchor">
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

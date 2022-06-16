import React, { useState, useEffect, useRef } from "react";
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
import { fetchLogin, fetchSession } from "../../store/user-creator";
import { Fade, Flip } from "react-awesome-reveal";
import Error from "../UI/Error";

const Login = (props) => {
  console.log("Login running");
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [clearErr, setClearErr] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchSession(`${process.env.REACT_APP_ENDPOINT_SERVER}/session`, navigate)
    );
  }, [dispatch, navigate]);

  useEffect(() => {
    setTimeout(() => {
      // userState.error === null important statement
      if (userState.error === null && userState.user) {
        !props.isSignUp ? navigate("/video-chat/Chats") : navigate("/login");
      }
    }, 1000);
  }, [userState, navigate, props.isSignUp]);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPass("");
    setClearErr(false);
  }, [props.isSignUp]);

  useEffect(() => {
    if (!userState.error) {
      setClearErr(false);
    }
  }, [userState.error]);

  const submitHandle = (e) => {
    e.preventDefault();
    dispatch(
      fetchLogin(`${process.env.REACT_APP_ENDPOINT_SERVER}/${props.formType}`, {
        email,
        password,
        confirmPass,
        isRemember,
      })
    );
  };

  return (
    <Container>
      <Content>
        {!clearErr && userState.error ? (
          <Error error={userState.error} onClearErr={setClearErr} />
        ) : (
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
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
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </FormGroup>
                )}
                <CheckBox>
                  <FormCheck>
                    {props.isSignUp ? (
                      <input type="checkbox" required />
                    ) : (
                      <input
                        type="checkbox"
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
                  <List isGoogle={true}>
                    <a href="#">
                      <IoLogoGoogle />
                      <span>Google</span>
                    </a>
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

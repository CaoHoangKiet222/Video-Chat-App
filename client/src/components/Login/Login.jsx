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

const Login = (props) => {
  console.log("Login running");
  const url = `http://localhost:5000/${props.formType}`;
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();

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
  }, [props.isSignUp]);

  const submitHandle = async (e) => {
    e.preventDefault();
    dispatch(fetchLogin(url, { email, password, confirmPass }));
  };

  return (
    <Container>
      <Content>
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
              {userState.error && <span>{userState.error}</span>}
            </MainTitle>
            <Form
              method="POST"
              action={url}
              isSignup={props.isSignUp}
              onSubmit={submitHandle}
            >
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
                    <input type="checkbox" />
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
      </Content>
    </Container>
  );
};

export default Login;

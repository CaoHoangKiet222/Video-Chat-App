import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Heading,
  Row,
  Setting,
} from "./Settings.styled";
import { v4 as uuid4 } from "uuid";
import { BsFillCircleFill } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { postData } from "../../utilities/utilities";
import { useDispatch, useSelector } from "react-redux";
import FormDisplay from "./FormDisplay";
import { LoadingSpinner } from "../UI/Loading";
import Swal from "sweetalert2";
import { userActions } from "../../store/user-slice";

const formDisplay = [
  {
    h6: "Account",
    p: "Update personal & contact information",
    input: [
      {
        label: "Name",
        type: "text",
        placeholder: "Type your name",
      },
      {
        label: "Phone number",
        type: "tel",
        placeholder: "Type your phone number",
        pattern: "[0-9]{10}",
        title: "Ten digits code",
      },
      {
        label: "Birth date",
        type: "date",
        placeholder: "mm/dd/yyyy",
      },
      { label: "Website", type: "text", placeholder: "Type your website" },
      {
        label: "Choose your image",
        type: "file",
        accept: "image/*",
      },
      {
        label: "Address",
        type: "text",
        placeholder: "Type your address",
        isAddress: true,
      },
    ],
  },
  {
    h6: "Social network profiles",
    p: "Update personal & contact information",
    input: [
      {
        label: "Facebook",
        type: "url",
        placeholder: "https://www.example.com",
        pattern: "https://.*",
      },
      {
        label: "Twitter",
        type: "url",
        placeholder: "https://www.example.com",
        pattern: "https://.*",
      },
      {
        label: "Instagram",
        type: "url",
        placeholder: "https://www.example.com",
        pattern: "https://.*",
      },
      {
        label: "Linkedin",
        type: "url",
        placeholder: "https://www.example.com",
        pattern: "https://.*",
      },
    ],
  },
  {
    h6: "Password",
    p: "Update password information",
    input: [
      {
        label: "Current Password",
        type: "password",
        placeholder: "Current Password",
      },
      {
        label: "New Password",
        type: "password",
        placeholder: "New Password",
      },
      {
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm Password",
      },
    ],
  },
];

const Settings = () => {
  const user = useSelector((state) => state.user.user);
  const authRef = useRef(null);
  const alertRef = useRef(null);
  const accountRef = useRef({}),
    socialRef = useRef({}),
    passRef = useRef({});
  const [isFetch, setIsFetch] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.twoFA.is2FAEnabled) {
      authRef.current.classList.add("active");
    }
  }, [user]);

  const handleInput = (e, label) => {
    switch (label) {
      case "Name":
        accountRef.current.name = e.target.value;
        break;
      case "Phone number":
        accountRef.current.phone = e.target.value;
        break;
      case "Birth date":
        accountRef.current.birth = e.target.value.split("-").join("/");
        break;
      case "Website":
        accountRef.current.website = e.target.value;
        break;
      case "Choose your image": {
        const fReader = new FileReader();
        fReader.readAsDataURL(e.target.files[0]);
        fReader.onload = (event) => {
          accountRef.current.avatar = event.target.result;
        };
        break;
      }
      case "Address":
        accountRef.current.address = e.target.value;
        break;
      case "Facebook":
        socialRef.current.facebook = e.target.value;
        break;
      case "Twitter":
        socialRef.current.twitter = e.target.value;
        break;
      case "Instagram":
        socialRef.current.instagram = e.target.value;
        break;
      case "Linkedin":
        socialRef.current.linkedin = e.target.value;
        break;
      case "Current Password":
        passRef.current.currentPass = e.target.value;
        break;
      case "New Password":
        passRef.current.newPass = e.target.value;
        break;
      case "Confirm Password":
        passRef.current.confirmPass = e.target.value;
        break;
      default:
        break;
    }
    console.log(passRef.current);
  };

  const handleSaveChange = async (e, h6) => {
    e.preventDefault();
    switch (h6) {
      case "Account":
        return await postData(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/update-user/account`,
          "post",
          { ...accountRef.current, userId: user._id }
        );
      case "Social network profiles":
        return await postData(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/update-user/social-network`,
          "post",
          { ...socialRef.current, userId: user._id }
        );
      case "Password":
        return await postData(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/update-user/password`,
          "post",
          { ...passRef.current, userId: user._id }
        );
      case "2FA":
        setIsFetch(true);
        const response = await postData(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/update-user/enable-2fa`,
          "post",
          {
            is2FAEnabled: authRef.current.classList.contains("active"),
            userId: user._id,
          }
        );
        if (response.update) {
          Swal.fire({
            icon: "success",
            title: response.update,
            showConfirmButton: false,
            timer: 5000,
          });
        } else if (response.QRCodeImage) {
          Swal.fire({
            html: `
              <strong>Enable two factor authentication!!</strong><br/><br/>
              <span>Using Google Authenticator App to access code!!!</span>
            `,
            width: 500,
            imageUrl: response.QRCodeImage,
          });
        }

        dispatch(userActions.setUser({ user: response.user }));
        return setIsFetch(false);
      default:
        break;
    }
  };

  return (
    <Setting>
      <Heading>
        <div>
          <h5>Settings</h5>
          <p>Update Personal Information & Settings</p>
        </div>
      </Heading>
      <Container>
        <Row>
          <Col>
            {formDisplay.map(({ h6, p, input }) => {
              return (
                <FormDisplay
                  key={uuid4()}
                  h6={h6}
                  p={p}
                  input={input}
                  handleSaveChange={handleSaveChange}
                  handleInput={handleInput}
                  accountRef={accountRef}
                  socialRef={socialRef}
                  passRef={passRef}
                ></FormDisplay>
              );
            })}
            <Card
              onSubmit={(e) => {
                handleSaveChange(e, "2FA");
              }}
            >
              <CardHeader>
                <h6>Security</h6>
                <p>
                  Two-factor authentication adds an additional layer of security
                  to your account
                </p>
              </CardHeader>
              <CardBody>
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="media-body">
                      <p>Use two-factor authentication</p>
                      <p>
                        Ask for a code if attempted login from an unrecognised
                        device or browser.
                      </p>
                    </div>
                    <div className="button">
                      <div
                        className="switch-btn"
                        ref={authRef}
                        onClick={() => {
                          authRef.current.classList.toggle("active");
                        }}
                      >
                        <TiTick />
                        <div className="icon">
                          <BsFillCircleFill />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardBody>
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="media-body">
                      <p>Get alerts about unrecognised logins</p>
                      <p>
                        You will be notified if anyone logs in from a device or
                        browser you don't usually use
                      </p>
                    </div>
                    <div className="button">
                      <div
                        className="switch-btn"
                        ref={alertRef}
                        onClick={() => {
                          alertRef.current.classList.toggle("active");
                        }}
                      >
                        <TiTick />
                        <div className="icon">
                          <BsFillCircleFill />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div>Reset</div>
                <button>
                  {isFetch ? (
                    <LoadingSpinner settings={true} />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </Setting>
  );
};

export default Settings;

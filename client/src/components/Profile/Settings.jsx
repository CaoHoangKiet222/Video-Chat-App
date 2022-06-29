import React, { useRef } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Heading,
  Row,
  Setting,
} from "./Settings.styled";
import { v4 as uuid4 } from "uuid";
import { BsFillCircleFill } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { postData } from "../../utilities/utilities";
import { useDispatch, useSelector } from "react-redux";
import { errorActions } from "../../store/error-slice";

const formDisplay = [
  {
    h6: "Account",
    p: "Update personal & contact information",
    input: [
      {
        label: "Name",
        type: "text",
        placeholder: "Type your name",
        required: true,
      },
      {
        label: "Phone number",
        type: "tel",
        placeholder: "Type your phone number",
        pattern: "[0-9]{10}",
        title: "Ten digits code",
        required: true,
      },
      {
        label: "Birth date",
        type: "date",
        placeholder: "mm/dd/yyyy",
        required: true,
      },
      { label: "Website", type: "text", placeholder: "Type your website" },
      {
        label: "Choose your image",
        type: "file",
        accept: "image/*",
        required: true,
      },
      {
        label: "Address",
        type: "text",
        placeholder: "Type your address",
        isAddress: true,
        required: true,
      },
    ],
  },
  {
    h6: "Social network profiles",
    p: "Update personal & contact information",
    input: [
      {
        label: "Facebook",
        type: "text",
        placeholder: "Type your link here",
      },
      {
        label: "Twitter",
        type: "text",
        placeholder: "Type your link here",
      },
      {
        label: "Instagram",
        type: "text",
        placeholder: "Type your link here",
      },
      {
        label: "Linkedin",
        type: "text",
        placeholder: "Type your link here",
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
        required: true,
      },
      {
        label: "New Password",
        type: "password",
        placeholder: "New Password",
        required: true,
      },
      {
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm Password",
        required: true,
      },
    ],
  },
];

const Settings = () => {
  const user = useSelector((state) => state.user.user);
  const authRef = useRef(null);
  const alertRef = useRef(null);
  const accountRef = useRef({});
  const dispatch = useDispatch();

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
      default:
        break;
    }
    console.log(accountRef.current);
  };

  const handleSaveChange = async (e, h6) => {
    console.log("sssssssssssssssss", e.target, h6);
    e.preventDefault();
    switch (h6) {
      case "Account":
        const response = await postData(
          `${process.env.REACT_APP_ENDPOINT_SERVER}/update-user/account`,
          "post",
          { ...accountRef.current, userId: user._id }
        );
        dispatch(
          errorActions.setError({ error: true, message: response.update })
        );
        break;

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
                <Card key={uuid4()} onSubmit={(e) => handleSaveChange(e, h6)}>
                  <CardHeader>
                    <h6>{h6}</h6>
                    <p>{p}</p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      {input.map((item) => {
                        return (
                          <FormGroup key={uuid4()}>
                            <div>
                              <label>{item.label}</label>
                              <input
                                type={item.type}
                                placeholder={item.placeholder}
                                required={item.required}
                                title={item.title}
                                pattern={item.pattern}
                                accept={item.accept}
                                onChange={(e) => {
                                  handleInput(e, item.label);
                                }}
                              />
                            </div>
                          </FormGroup>
                        );
                      })}
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <button>Reset</button>
                    <button>Save Changes</button>
                  </CardFooter>
                </Card>
              );
            })}

            <Card>
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
                <button>Reset</button>
                <button>Save Changes</button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </Setting>
  );
};

export default Settings;

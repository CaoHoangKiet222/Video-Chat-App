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

const formDisplay = [
  {
    h6: "Account",
    p: "Update personal & contact information",
    input: [
      {
        label: "First Name",
        type: "text",
        placeholder: "Type your first name",
        required: true,
      },
      {
        label: "Last Name",
        type: "text",
        placeholder: "Type your last name",
        required: true,
      },
      {
        label: "Phone number",
        type: "tel",
        placeholder: "Type your phone number",
        required: true,
      },
      {
        label: "Birth date",
        type: "date",
        placeholder: "mm/dd/yyyy",
        required: true,
      },
      {
        label: "Another email address",
        type: "email",
        placeholder: "Another email address",
      },
      { label: "Website", type: "text", placeholder: "Type your website" },
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
  const authRef = useRef(null);
  const alertRef = useRef(null);

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
                <Card key={uuid4()}>
                  <CardHeader>
                    <h6>{h6}</h6>
                    <p>{p}</p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      {input.map((item) => {
                        return (
                          <FormGroup key={uuid4()} isAddress={item.isAddress}>
                            <div>
                              <label>{item.label}</label>
                              <input
                                type={item.type}
                                placeholder={item.placeholder}
                                required={item.required}
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

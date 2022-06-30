import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid4 } from "uuid";
import { errorActions } from "../../store/error-slice";
import { userActions } from "../../store/user-slice";
import { postData } from "../../utilities/utilities";
import { LoadingSpinner } from "../UI/Loading";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormGroup,
  Row,
} from "./Settings.styled";

const FormDisplay = (props) => {
  const [isFetch, setIsFetch] = useState(false);
  const dispatch = useDispatch();

  return (
    <Card
      onSubmit={async (e) => {
        setIsFetch(true);
        const response = await props.handleSaveChange(e, props.h6);
        setIsFetch(false);
        if (props.h6 === "Account") {
          props.accountRef.current = {};
        } else if (props.h6 === "Social network profiles") {
          props.socialRef.current = {};
        } else {
          props.passRef.current = {};
        }
        dispatch(userActions.setUser({ user: response.user }));
        if (response.error) {
          return dispatch(
            errorActions.setError({ error: true, message: response.error })
          );
        }

        dispatch(
          errorActions.setError({ error: true, message: response.update })
        );
      }}
    >
      <CardHeader>
        <h6>{props.h6}</h6>
        <p>{props.p}</p>
      </CardHeader>
      <CardBody>
        <Row>
          {props.input.map((item) => {
            return (
              <FormGroup key={uuid4()}>
                <div>
                  <label>{item.label}</label>
                  <input
                    type={item.type}
                    placeholder={item.placeholder}
                    required={true}
                    title={item.title}
                    pattern={item.pattern}
                    accept={item.accept}
                    onChange={(e) => {
                      props.handleInput(e, item.label);
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
        <button>
          {isFetch ? <LoadingSpinner settings={true} /> : "Save Changes"}
        </button>
      </CardFooter>
    </Card>
  );
};

export default FormDisplay;

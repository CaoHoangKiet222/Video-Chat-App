import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuid4 } from "uuid";
import { userActions } from "../../store/user-slice";
import { LoadingSpinner } from "../UI/Loading";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormGroup,
  Row,
} from "./Settings.styled";
import Swal from "sweetalert2";

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

        if (response.error) {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.error,
            showConfirmButton: false,
            timer: 3500,
          });
        }

        dispatch(userActions.setUser({ user: response.user }));
        Swal.fire({
          icon: "success",
          title: response.update,
          showConfirmButton: false,
          timer: 3500,
        });
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
        <div>Reset</div>
        <button>
          {isFetch ? <LoadingSpinner settings={true} /> : "Save Changes"}
        </button>
      </CardFooter>
    </Card>
  );
};

export default FormDisplay;

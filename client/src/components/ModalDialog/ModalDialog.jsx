import React, { useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { fetchConversation } from "../../store/conversations-creator";
import { conversationActions } from "../../store/conversations-slice";
import { errorActions } from "../../store/error-slice";
import { postData } from "../../utilities/utilities";
import { LoadingSpinner } from "../UI/Loading";
import DialogItems from "./DialogItems";
import {
  Container,
  DialogGroupName,
  DialogGroupPicture,
  DialogSearch,
  Document,
  ModalBody,
  ModalContent,
  ModalFade,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
} from "./ModalDialog.styled";

const ModalDialog = (props) => {
  const [searchName, setSearchName] = useState("");
  const [newMembers, setNewMembers] = useState([]);
  const [isFetch, setIsFetch] = useState(false);
  const groupName = useRef(null);
  const profilePicture = useRef(null);
  const dispatch = useDispatch();
  console.log(newMembers);

  const startSearch = (e) => {
    setSearchName(e.target.value);
  };

  const closeModalDialog = () => {
    props.setShowModalDialog(false);
  };

  const handleFile = (e) => {
    // console.log(e.target.files[0]);
    const fReader = new FileReader();
    fReader.readAsDataURL(e.target.files[0]);
    fReader.onload = (event) => {
      // console.log(event.target.result);
      profilePicture.current = event.target.result;
    };
  };

  const createGroupHandler = async () => {
    if (groupName.current.value !== "") {
      if (profilePicture.current) {
        if (newMembers.length >= 2) {
          try {
            setIsFetch(true);
            const data = await postData(
              `${process.env.REACT_APP_ENDPOINT_SERVER}/new-group`,
              "post",
              {
                newMembers,
                groupImg: profilePicture.current,
                groupName: groupName.current.value,
              }
            );

            if (data.error) {
              dispatch(
                errorActions.setError({
                  error: true,
                  message: data.error,
                })
              );
            } else {
              dispatch(
                conversationActions.setConversation({
                  conversation: data,
                  error: null,
                })
              );
            }

            setNewMembers([]);
            groupName.current = null;
            profilePicture.current = null;
            props.setShowModalDialog(false);
            setIsFetch(false);
          } catch (error) {}
        } else {
          dispatch(
            errorActions.setError({
              error: true,
              message: "Group need at least 2 members!!!",
            })
          );
        }
      } else {
        dispatch(
          errorActions.setError({
            error: true,
            message: "You need to provide group image!!!",
          })
        );
      }
    } else {
      dispatch(
        errorActions.setError({
          error: true,
          message: "You need to have a group name!!!",
        })
      );
    }
  };

  return (
    <>
      <ModalFade />
      <Container>
        <Document newGroup={props.newGroup} isForward={props.isForward}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                <h5>
                  {props.isForward
                    ? "Forward"
                    : props.newGroup
                    ? "Create a New Group"
                    : "New Chat"}
                </h5>
              </ModalTitle>
              <button className="btn" onClick={closeModalDialog}>
                <span>×</span>
              </button>
            </ModalHeader>
            <ModalBody>
              <Row>
                {props.newGroup && (
                  <>
                    <DialogGroupName>
                      <div>
                        <label>Group name</label>
                        <input
                          type="text"
                          placeholder="Type group name here"
                          ref={groupName}
                          onChange={(e) =>
                            (groupName.current.value = e.target.value)
                          }
                        />
                      </div>
                    </DialogGroupName>
                    <DialogGroupPicture>
                      <div>
                        <label>Choose profile picture</label>
                        <div className="custom-file">
                          <label
                            className="custom-file-label"
                            htmlFor="profilePictureInput"
                          >
                            Choose file
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            id="profilePictureInput"
                            onChange={handleFile}
                          />
                        </div>
                      </div>
                    </DialogGroupPicture>
                  </>
                )}
                <DialogSearch newGroup={props.newGroup}>
                  <div>
                    <input
                      type="text"
                      placeholder="Search for user..."
                      onChange={startSearch}
                    ></input>
                    <div>
                      <div>
                        <BsSearch />
                      </div>
                    </div>
                  </div>
                </DialogSearch>
                <DialogItems
                  conversation={props.conversation}
                  friends={props.friends}
                  searchName={searchName}
                  setSearchName={setSearchName}
                  setShowModalDialog={props.setShowModalDialog}
                  isForward={props.isForward}
                  newGroup={props.newGroup}
                  setNewMembers={setNewMembers}
                />
              </Row>
            </ModalBody>
            {props.newGroup && (
              <ModalFooter>
                <button className="cancel">Cancel</button>
                <button className="new-group" onClick={createGroupHandler}>
                  {isFetch ? (
                    <LoadingSpinner newGroup={props.newGroup} />
                  ) : (
                    <>Create Group</>
                  )}
                </button>
              </ModalFooter>
            )}
          </ModalContent>
        </Document>
      </Container>
    </>
  );
};

export default ModalDialog;

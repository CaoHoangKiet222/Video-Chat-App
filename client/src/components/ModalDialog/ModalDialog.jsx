import React, { useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { conversationActions } from "../../store/conversations-slice";
import { errorActions } from "../../store/error-slice";
import { convertString, postData } from "../../utilities/utilities";
import { LoadingSpinner } from "../UI/Loading";
import DialogItems from "./DialogItems";
import {
  Container,
  DialogGroupName,
  DialogGroupPicture,
  DialogInvitation,
  DialogMessage,
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
  const { notifySocket } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.user);
  const groupName = useRef(null);
  const emailRef = useRef("");
  const textAreaRef = useRef("");
  const profilePicture = useRef(null);
  const dispatch = useDispatch();

  const startSearch = (e) => {
    setSearchName(e.target.value);
  };

  const closeModalDialog = () => {
    props.setShowModalDialog(false);
  };

  const handleFile = (e) => {
    const fReader = new FileReader();
    fReader.readAsDataURL(e.target.files[0]);
    fReader.onload = (event) => {
      profilePicture.current = event.target.result;
    };
  };

  const cancelHandler = () => {
    props.setShowModalDialog(false);
  };

  const handleInvitation = async () => {
    setIsFetch(true);
    const data = await postData(
      `${process.env.REACT_APP_ENDPOINT_SERVER}/invite-others`,
      "post",
      {
        message: convertString(textAreaRef.current.value),
        email: emailRef.current.value,
        user,
      }
    );

    if (data.error) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        html: data.error,
        showConfirmButton: false,
        timer: 5000,
      });
    }

    setIsFetch(false);
    emailRef.current.value = "";
    textAreaRef.current.value = "";
    Swal.fire({
      icon: "success",
      html: data.message,
      showConfirmButton: false,
      timer: 5000,
    });
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
              notifySocket.emit("notifyingUserAddGroup");
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
          } catch (error) {
            console.log(error);
          }
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
          <ModalContent
            onSubmit={(e) => {
              e.preventDefault();

              if (props.invitation) {
                handleInvitation();
              }
            }}
          >
            <ModalHeader>
              <ModalTitle>
                <h5>
                  {props.isForward
                    ? "Forward"
                    : props.newGroup
                    ? "Create a New Group"
                    : props.invitation
                    ? "Invite Others"
                    : "New Chat"}
                </h5>
              </ModalTitle>
              <button className="btn" onClick={closeModalDialog}>
                <span>×</span>
              </button>
            </ModalHeader>
            <ModalBody>
              <Row>
                {props.invitation && (
                  // invite others
                  <>
                    <DialogInvitation>
                      <div>
                        <label>Email address</label>
                        <input
                          type="email"
                          placeholder="Type email address here"
                          ref={emailRef}
                          required
                          onChange={(e) =>
                            (emailRef.current.value = e.target.value)
                          }
                        />
                      </div>
                    </DialogInvitation>
                    <DialogMessage>
                      <div>
                        <label>Invitation message</label>
                        <textarea
                          type="text"
                          ref={textAreaRef}
                          rows="3"
                          placeholder="Write your message here"
                          onChange={(e) =>
                            (textAreaRef.current.value = e.target.value)
                          }
                        ></textarea>
                      </div>
                    </DialogMessage>
                  </>
                )}
                {props.newGroup && (
                  // create new Group
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
                            name="groupImg"
                            id="profilePictureInput"
                            onChange={handleFile}
                          />
                        </div>
                      </div>
                    </DialogGroupPicture>
                  </>
                )}
                {!props.invitation && (
                  <>
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
                  </>
                )}
              </Row>
            </ModalBody>
            {props.invitation && (
              <ModalFooter invitation={true}>
                <button className="cancel" onClick={cancelHandler}>
                  Close
                </button>
                <button className="invitation">
                  {isFetch ? (
                    <LoadingSpinner invitation={props.invitation} />
                  ) : (
                    <>Send Invitation</>
                  )}
                </button>
              </ModalFooter>
            )}
            {props.newGroup && (
              <ModalFooter>
                <button className="cancel" onClick={cancelHandler}>
                  Cancel
                </button>
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

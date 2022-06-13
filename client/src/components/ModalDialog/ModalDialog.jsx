import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import DialogItems from "./DialogItems";
import {
  Container,
  DialogSearch,
  Document,
  ModalBody,
  ModalContent,
  ModalFade,
  ModalHeader,
  ModalTitle,
  Row,
} from "./ModalDialog.styled";

const ModalDialog = (props) => {
  const [searchName, setSearchName] = useState("");

  const startSearch = (e) => {
    setSearchName(e.target.value);
  };

  const closeModalDialog = () => {
    props.setShowModalDialog(false);
  };

  return (
    <>
      <ModalFade />
      <Container>
        <Document>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                <h5>New Chat</h5>
              </ModalTitle>
              <button className="btn" onClick={closeModalDialog}>
                <span>×</span>
              </button>
            </ModalHeader>
            <ModalBody>
              <Row>
                <DialogSearch>
                  <div>
                    <input
                      type="text"
                      placeholder="Search ..."
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
                  friends={props.friends}
                  searchName={searchName}
                  setSearchName={setSearchName}
                  setShowModalDialog={props.setShowModalDialog}
                />
              </Row>
            </ModalBody>
          </ModalContent>
        </Document>
      </Container>
    </>
  );
};

export default ModalDialog;

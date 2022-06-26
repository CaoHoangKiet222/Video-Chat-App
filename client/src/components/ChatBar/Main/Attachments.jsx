import React from "react";
import styled from "styled-components";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";

const Attachments = (props) => {
  return (
    <Attachment isRight={props.isRight}>
      <div className="attachments">
        <div className="btn">
          <HiOutlineDocumentDuplicate />
        </div>
        <div className="attachment-body">
          <h6 className="file-text">
            <a href="#">sssssssssssssssssssssssssssssss.cpp</a>
          </h6>
          <div className="payload">
            <span>14kb</span>
          </div>
        </div>
      </div>
    </Attachment>
  );
};

export default Attachments;

const Attachment = styled.div`
  .attachments {
    display: flex;
    margin-top: 10px;
    justify-content: center;
    align-items: center;
    flex-direction: wrap;
    /* flex-direction: column; */

    .btn {
      display: flex;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      background-color: ${({ isRight }) => (isRight ? "#383F44" : "#4e44fe")};
      border-radius: 50%;
      min-height: 2.9rem;
      min-width: 2.9rem;
      margin-right: 0.75rem;

      svg {
        font-size: 1.9rem;
        color: #fff;
      }
      &:hover {
        opacity: 0.8;
      }
    }
    .attachment-body {
      .file-text {
        margin-bottom: 4px;
        font-size: 1.175rem;
        font-weight: 500;
        line-height: 1;
        margin-top: 0;

        a {
          width: 16.5rem;
          color: #fff;
          overflow-wrap: break-word;
          display: inline-block;
        }
      }

      .payload {
        color: ${({ isRight }) => (isRight ? "#ffffff90" : "#adb5bd")};
        font-size: 0.95rem;
        font-weight: 400;
        /* margin-top: 5px; */
      }
    }
  }
`;

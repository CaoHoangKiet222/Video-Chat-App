import React, { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineUserAdd,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { GiSelfLove } from "react-icons/gi";
import { FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import styled from "styled-components";
import { BiBlock } from "react-icons/bi";
import { HiOutlineUserAdd } from "react-icons/hi";
import {
  BsCardImage,
  BsChevronRight,
  BsChevronUp,
  BsDownload,
  BsFillFileEarmarkTextFill,
  BsImages,
  BsThreeDots,
} from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { FiUsers } from "react-icons/fi";

const ChatDetail = () => {
  const [showAboutUser, setShowAboutUser] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  return (
    <InfoDetail showMembers={showMembers}>
      <div className="container">
        <div className="header">
          <div className="header-body">
            <ul>
              <li>
                <h5>Profile Details</h5>
              </li>
              <li>
                <AiOutlineClose />
              </li>
            </ul>
          </div>
        </div>
        <div className="body">
          <div className="body-info">
            <div className="avatar">
              <img
                src={`${process.env.REACT_APP_ENDPOINT_CLIENT}/images/user.jpg`}
                alt=""
              />
            </div>
            <h5 className="name">caohoangkiet</h5>
            <p className="address">
              <FaMapMarkerAlt />
              <span>address</span>
            </p>
            <div className="icons">
              <div className="item">
                <HiOutlineUserAdd />
                {/* <AiOutlineUsergroupAdd /> */}
              </div>
              <div className="item">
                <GiSelfLove />
              </div>
              <div className="item">
                <BiBlock />
              </div>
            </div>
          </div>
          <div className="chat-info-group">
            <div className="about-user">
              <div
                className="card-header"
                onClick={() => setShowAboutUser(!showAboutUser)}
              >
                <div>
                  <FaUserAlt />
                  <span>About</span>
                </div>
                <div>
                  {!showAboutUser ? <BsChevronRight /> : <BsChevronUp />}
                </div>
              </div>

              <Collapse showAboutUser={showAboutUser}>
                <div className="card-body">
                  <div className="name">
                    <p>Name</p>
                    <h5>caohoangkiet</h5>
                  </div>
                  <div className="email">
                    <p>Email</p>
                    <h5>caohoangkiet@gmail.com</h5>
                  </div>
                  <div className="time">
                    <p>Time</p>
                    <h5>11:40Am</h5>
                  </div>
                  <div className="location">
                    <p>Location</p>
                    <h5>No trang long</h5>
                  </div>
                </div>
              </Collapse>
            </div>
            <div className="group-members">
              <div
                className="card-header"
                onClick={() => setShowMembers(!showMembers)}
              >
                <div>
                  <FiUsers />
                  <span>Members</span>
                </div>
                <div>{!showMembers ? <BsChevronRight /> : <BsChevronUp />}</div>
              </div>

              <Collapse showMembers={showMembers}>
                <div className="card-body">
                  <div className="group-content">
                    <div>
                      <div className="avatar">
                        <img
                          src={`${process.env.REACT_APP_ENDPOINT_CLIENT}/images/user.jpg`}
                          alt=""
                        />
                      </div>
                      <div className="member-name">
                        <h5>
                          caohoangkiet
                          <span>Admin</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
            <div className="files-imgs">
              <div
                className="card-header"
                onClick={() => setShowMedia(!showMedia)}
              >
                <div>
                  <BsImages />
                  <span>Media</span>
                </div>
                <div>{!showMedia ? <BsChevronRight /> : <BsChevronUp />}</div>
              </div>

              <Collapse showMedia={showMedia}>
                <div className="card-body">
                  <div className="card-content">
                    <div className="item">
                      <div className="avatar">
                        <BsCardImage />
                      </div>
                    </div>
                    <div className="item">
                      <h5>ddddddddddddddddddddAdmin-A.zip</h5>
                      <p>12.5Mb</p>
                    </div>
                    <div className="item">
                      <ul className="actions">
                        <li>
                          <BsDownload />
                        </li>
                        <li>
                          <BsThreeDots />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
            <div className="files-attachments">
              <div
                className="card-header"
                onClick={() => setShowAttachments(!showAttachments)}
              >
                <div>
                  <CgAttachment />
                  <span>Documents</span>
                </div>
                <div>
                  {!showAttachments ? <BsChevronRight /> : <BsChevronUp />}
                </div>
              </div>

              <Collapse showAttachments={showAttachments}>
                <div className="card-body">
                  <div className="card-content">
                    <div className="item">
                      <div className="avatar">
                        <BsFillFileEarmarkTextFill />
                      </div>
                    </div>
                    <div className="item">
                      <h5>ddddddddddddddddddddAdmin-A.zip</h5>
                      <p>12.5Mb</p>
                    </div>
                    <div className="item">
                      <ul className="actions">
                        <li>
                          <BsDownload />
                        </li>
                        <li>
                          <BsThreeDots />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </InfoDetail>
  );
};

export default ChatDetail;

export const InfoDetail = styled.div`
  min-width: 29.875rem;
  width: 29.875rem;
  background-color: #383f44;
  border-left: 1px solid #2b2b2f;

  .container {
    display: flex;
    flex-direction: column;
    .body {
      display: flex;
      flex-direction: column;
      max-height: 88vh;
      overflow: scroll;
      &::-webkit-scrollbar {
        display: none;
      }

      .chat-info-group {
        padding: 1.5rem;
        background-color: #2a2a2a;

        .about-user,
        .files-imgs,
        .files-attachments,
        .group-members {
          cursor: pointer;
          margin-bottom: 0.5rem;
          border: 1px solid #4b4b60;
          border-radius: 0.25rem;
          background-color: #383f44;
          color: #fff;

          .card-header {
            display: flex;
            padding: 0.75rem 1.25rem;
            & > div:first-child {
              width: 100%;
              & > svg {
                margin-right: 0.5rem;
              }
            }
          }
        }
      }

      .body-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        color: #fff;
        border-bottom: 1px solid #2a2a2a;

        .avatar {
          height: 7.5rem;
          width: 7.5rem;
          min-width: 7.5rem;
          box-shadow: 0 0 1px 1px rgb(0 0 0 / 10%);
          border-radius: 50%;
          margin-bottom: 1.5rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .name {
          margin-top: 0;
          margin-bottom: 0.375rem;
          font-size: 18px;
        }

        .address {
          color: #fff;
          display: flex;
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 16px;

          svg {
            width: 1rem;
            height: 1rem;
            margin-right: 0.55rem;
            margin-top: 2px;
          }
          span {
            color: #f8f9fa;
          }
        }
        .icons {
          display: flex;

          .item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            cursor: pointer;
            margin: 0 0.375rem;
            & > svg {
              font-size: 20px;
            }

            &:first-child {
              background: #2a2a2a;
              color: #adb5bd;
              border: 1px solid #2a2a2a;
              &:hover {
                background-color: #495057;
              }
            }

            &:nth-child(2) {
              color: #f8f9fa;
              background-color: #665dfe;
              border: 1px solid #665dfe;
              &:hover {
                background-color: #4237fe;
              }
            }

            &:nth-child(3) {
              color: #f8f9fa;
              background-color: #ff337c;
              border: 1px solid #ff337c;
              &:hover {
                background-color: #ff0d63;
              }
            }
          }
        }
      }
    }

    .header {
      border-bottom: 1px solid #2b2b2f;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 99px;
      padding: 0 0.75rem;

      .header-body {
        padding: 0 0.75rem;
        margin: 0 auto;
        width: 100%;

        & > ul {
          display: flex;
          justify-content: space-between;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          color: #fff;

          & > li h5 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
          }

          & > li:last-child {
            cursor: pointer;
            color: #adb5bd;
            font-size: 20px;
            height: 1.375rem;
            width: 1.375rem;
          }
        }
      }
    }
  }
`;

const Collapse = styled.div`
  /* padding: 1.25rem; */
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  background-color: #2a2a2a;
  ${({ showAboutUser, showMembers, showMedia, showAttachments }) =>
    !showAboutUser && !showMembers && !showMedia && !showAttachments
      ? `
            height: 0;
            padding: 0 1.25rem ;
          `
      : `
            height: 336px;
            padding: 1.25rem;
          `};
  transition: all 0.5s ease-in-out;

  .card-body {
    .email,
    .time,
    .location {
      margin-top: 1.5rem;
    }

    .group-content {
      padding: 0.5rem;
      margin: 1.5rem 0 !important;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }

      div {
        display: flex;
        justify-content: flex-start;

        .member-name {
          h5 {
            font-weight: 600;
            margin: 0;
            margin-bottom: 0.25rem;
            font-size: 18px;
            line-height: 1.7;

            span {
              font-size: 13px;
              background-color: rgba(239, 71, 111, 0.18);
              color: #ef476f;
              border-radius: 0.25rem;
              padding: 0.25rem 0.6rem;
              float: right;
              line-height: 1;
            }
          }
        }

        .avatar {
          margin-right: 1rem;
          display: flex;
          justify-content: center;
          height: 2.2rem;
          width: 2.2rem;
          border-radius: 50%;

          img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
          }
        }
      }
    }

    .card-content {
      display: flex;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      border: 1px solid #4b4b60;

      .item {
        height: 3rem;
        width: 3rem;

        &:first-child {
          margin-right: 1rem;

          .avatar {
            border-radius: 0.25rem;
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 3rem;
            min-height: 3rem;
            font-weight: 500;
            background-color: rgba(114, 105, 239, 0.35);
            svg {
              color: rgba(113, 105, 239, 1);
            }
          }
        }
        &:nth-child(2) {
          display: flex;
          flex-direction: column;
          width: 100%;
          overflow: hidden;

          h5 {
            font-size: 18px;
            margin: 0;
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          p {
            font-size: 16px;
            margin: 0;
            color: #9aa1b9;
          }
        }
        &:last-child {
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 90px;

          .actions {
            padding: 0;
            font-size: 20px;
            display: flex;
            list-style: none;
            margin: 0;

            li {
              height: 29px;
              width: 26px;
              margin: 10px 8px 0 8px;
              color: #9aa1b9;
              display: flex;
              justify-content: center;

              &:hover {
                color: #fff;
              }
            }
          }
        }
      }
    }

    & > div {
      p {
        margin: 0;
        font-size: 16px;
        margin-bottom: 0.25rem;
        color: #9aa1b9;
      }
      h5 {
        margin: 0;
        font-size: 18px;
        color: #e1e9f1;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
    }
  }
`;

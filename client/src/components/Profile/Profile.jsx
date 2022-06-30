import React from "react";
import {
  AiOutlineCalendar,
  AiOutlineHome,
  AiOutlineMail,
} from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";
import { HiOutlineGlobe } from "react-icons/hi";
import { IoCallOutline } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../../store/user-creator";
import { formatDate } from "../../utilities/utilities";
import {
  ProfileOptions,
  ProfileAvatar,
  ProfileBody,
  ProfileCol,
  ProfileContainer,
  ProfileContent,
  ProfileIcons,
  ProfileItem,
  ProfileRow,
  ProfileListItem,
  ProfileRowInfo,
  ProfileListGroup,
} from "./Profile.styled";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(
      userLogout(
        `${process.env.REACT_APP_ENDPOINT_SERVER}/logout`,
        user._id,
        navigate
      )
    );
  };

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileRow>
          <ProfileCol>
            <ProfileBody>
              <ProfileAvatar>
                <img src={`${user?.avatar.url}`} alt="" />
              </ProfileAvatar>
              <ProfileItem>
                <h5>{user?.name}</h5>
                <ProfileIcons onClick={logoutHandler}>
                  <div>
                    <BiLogOut />
                    <span>Logout</span>
                  </div>
                </ProfileIcons>
              </ProfileItem>
            </ProfileBody>
            <ProfileOptions>
              <BsThreeDotsVertical />
            </ProfileOptions>
          </ProfileCol>
        </ProfileRow>
        <ProfileRowInfo>
          <ProfileCol>
            <ProfileListGroup>
              <ProfileListItem>
                <div>
                  <p>Local Time</p>
                  <p>{formatDate(Date.now())}</p>
                </div>
                <MdAccessTime />
              </ProfileListItem>
              <ProfileListItem>
                <div>
                  <p>BirthDate</p>
                  <p>{user?.birth}</p>
                </div>
                <AiOutlineCalendar />
              </ProfileListItem>
              <ProfileListItem>
                <div>
                  <p>Phone</p>
                  <p>{user?.phone}</p>
                </div>
                <IoCallOutline />
              </ProfileListItem>
              <ProfileListItem>
                <div>
                  <p>Email</p>
                  <p>{user?.email}</p>
                </div>
                <AiOutlineMail />
              </ProfileListItem>
              <ProfileListItem>
                <div>
                  <p>Website</p>
                  <p>{user?.website}</p>
                </div>
                <HiOutlineGlobe />
              </ProfileListItem>
              <ProfileListItem>
                <div>
                  <p>Address</p>
                  <p>{user?.address}</p>
                </div>
                <AiOutlineHome />
              </ProfileListItem>
            </ProfileListGroup>
            <ProfileListGroup>
              <ProfileListItem>
                <div>
                  <p>Facebook</p>
                  <a href={user?.facebook}>
                    {user?.facebook.split("/").splice(-1)[0]}
                  </a>
                </div>
                <FiFacebook />
              </ProfileListItem>
              <ProfileListItem>
                <div>
                  <p>Twitter</p>
                  <a href={user?.twitter}>
                    {user?.twitter.split("/").splice(-1)[0]}
                  </a>
                </div>
                <FiTwitter />
              </ProfileListItem>
              <ProfileListItem>
                <div>
                  <p>Instagram</p>
                  <a href={user?.instagram}>
                    {user?.instagram.split("/").splice(-1)[0]}
                  </a>
                </div>
                <FiInstagram />
              </ProfileListItem>
              <ProfileListItem>
                <div>
                  <p>Linkedin</p>
                  <a href={user?.linkedin}>
                    {user?.linkedin.split("/").splice(-1)[0]}
                  </a>
                </div>
                <FiLinkedin />
              </ProfileListItem>
            </ProfileListGroup>
          </ProfileCol>
        </ProfileRowInfo>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;

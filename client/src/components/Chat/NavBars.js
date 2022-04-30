import React from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsMessenger, BsTelephone } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { TiMessages } from "react-icons/ti";
import { Link } from "react-router-dom";
import { MainNav, NavBar } from "./NavBars.styled";

const NavBars = () => {
  const clickHandle = (e) => {
    e.target.classList.toggle("active");
  };

  return (
    <NavBar>
      <a href="#">
        <BsMessenger />
      </a>
      <MainNav>
        <li>
          <Link to="/video-chat/Chats" onClick={clickHandle}>
            <TiMessages />
          </Link>
        </li>
        <li>
          <Link to="/video-chat/Calls">
            <BsTelephone />
          </Link>
        </li>
        <li>
          <Link to="/video-chat/Friends">
            <HiOutlineUsers />
          </Link>
        </li>
        <li>
          <Link to="/video-chat/Account">
            <BiUserCircle />
          </Link>
        </li>
      </MainNav>
    </NavBar>
  );
};

export default NavBars;

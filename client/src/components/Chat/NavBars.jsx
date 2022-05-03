import React, { useCallback, useEffect, useRef } from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsMessenger, BsTelephone } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { TiMessages } from "react-icons/ti";
import { Link } from "react-router-dom";
import { MainNav, NavBar } from "./NavBars.styled";

const NavBars = () => {
  const navItems = useRef(null);

  const removeActive = useCallback(() => {
    navItems.current.querySelectorAll("li a").forEach((item) => {
      item.classList.remove("active");
    });
  }, []);

  useEffect(() => {
    navItems.current.querySelectorAll("li a").forEach((item) => {
      item.addEventListener("click", () => {
        removeActive();
        item.classList.add("active");
      });
    });
  }, [removeActive]);

  return (
    <NavBar>
      <a href="#">
        <BsMessenger />
      </a>
      <MainNav ref={navItems}>
        <li>
          <Link to="/video-chat/Chats" className="active">
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

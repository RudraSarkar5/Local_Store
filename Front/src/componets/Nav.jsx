import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import logo from "../assets/mobile-shopping.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { AiFillMessage, AiFillHome } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../webSocket/socketSetUp";
import { fetchUnreadMsgNumber } from "../redux/feature/unreadMsgSlice";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const unRead = useSelector((state) => state.unreadMsg);
  useEffect(()=>{
    setValue(unRead.unReadMsg);
  },[unRead])
  const [bar, setBar] = useState(true);
  const [value, setValue] = useState(0);
  
  
  

  socket.emit("join", userId);

  useEffect(() => {
    socket.on("chat", (msg) => {
      console.log(msg);
      setTimeout(dispatch(fetchUnreadMsgNumber(userId)),100)
      
    
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(()=>{
    dispatch(fetchUnreadMsgNumber(userId));
  },[])

  //To logOut functionality
  function handleLogOut() {
    Cookies.remove("token");
    localStorage.removeItem("userId");
    navigate("/signup");
  }

 
  return (
    <div className="py-2 px-5 grid grid-cols-2 bg-violet-950 text-slate-100 fixed top-0 left-0 right-0 z-20">
      <div>
        <img src={logo} alt="" className="h-8" />
      </div>
      <div className="relative">
        <div className="md:hidden flex justify-evenly items-center">
          <NavLink
            to={"/"}
            className="hover:text-blue-500"
            onClick={() => setBar(!bar)}
          >
            <div>
              <AiFillHome className="text-2xl" />
            </div>
          </NavLink>
          <NavLink to={`/chat`} className="hover:text-blue-500 ">
            <div className=" mt-2 text-2xl flex gap-1">
              <AiFillMessage />
              {value > 0 ? (
                <h1 className=" text-green-600 text-xs">({value})</h1>
              ) : null}
            </div>
          </NavLink>

          <div className="hover:text-blue-500">
            {bar ? (
              <RxHamburgerMenu
                className="text-2xl"
                onClick={() => setBar(!bar)}
              />
            ) : (
              <RxCross2 className="text-2xl" onClick={() => setBar(!bar)} />
            )}
          </div>
        </div>
        <div
          className={`${
            bar ? "translate-x-full" : "translate-x-0"
          } transform md:hidden h-screen bg-white py-3 px-3 font-bold text-blue-700 duration-300 fixed top-14 right-1 flex flex-col gap-2 z-50 transition-transform`}
        >
          <div></div>
          <div>
            <NavLink
              to={"/addProduct"}
              className="hover:text-blue-500"
              onClick={() => setBar(!bar)}
            >
              Add-Product
            </NavLink>
          </div>
          <div>
            <NavLink
              to={"/cart"}
              className="hover:text-blue-500"
              onClick={() => setBar(!bar)}
            >
              Cart
            </NavLink>
          </div>
          <div className="hover:text-blue-500">
            <button onClick={handleLogOut} className="hover:text-blue-500">
              Log out
            </button>
          </div>
          <div></div>
          <div>
            <NavLink
              to={"/profile"}
              className="hover:text-blue-500"
              onClick={() => setBar(!bar)}
            >
              Profile
            </NavLink>
          </div>
        </div>
        <div className="hidden md:flex justify-evenly ml-10 items-center">
          <NavLink to={"/"} className="hover:text-blue-500">
            Home
          </NavLink>
          <NavLink to={"/addProduct"} className="hover:text-blue-500">
            Add-Product
          </NavLink>
          <NavLink to={"/cart"} className="hover:text-blue-500">
            Cart
          </NavLink>

          <button onClick={handleLogOut} className="hover:text-blue-500">
            Log out
          </button>
          <div>
            <NavLink to={`/chat`} className="hover:text-blue-500 ">
              <div className="flex gap-1 mt-1">
                Chat
                {value > 0 ? (
                  <h1 className=" text-green-600 my-auto text-xl">({value})</h1>
                ) : null}
              </div>
            </NavLink>
          </div>
          <NavLink to={"/profile"} className="hover:text-blue-500">
            Profile
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Nav;

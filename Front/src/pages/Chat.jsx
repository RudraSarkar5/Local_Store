import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../redux/feature/chatSlice";
import { NavLink, Link } from "react-router-dom";
import Layout from "../componets/Layout";
import { baseUrl } from "../Server/variable";
import { addToCart } from "../redux/feature/cartSlice";
import { setStatus } from "../redux/feature/cartSlice";
import { removeCart } from "../redux/feature/cartSlice";
import ChatBox from "./ChatBox";
import Error from "./Error";


const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chatbox, setChatbox] = useState(false);
  const friends = useSelector((state) => state.chat.data);
  const status = useSelector((state) => state.chat.status);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(fetchFriends(userId));
  }, []);
  
  return (
    <Layout>
      <div className="w-full bg-gradient-to-br from-gray-900 fixed via-gray-800 to-gray-900 h-screen overflow-hidden flex items-center justify-center">
        <div className="w-full md:w-96 bg-slate-600 h-full md:h-[560px] relative flex flex-col  overflow-scroll rounded-lg p-6 shadow-xl text-white">
          <h1 className="text-2xl font-bold mb-4">Chat List</h1>
          <ul className="space-y-4">
            {friends &&
              friends.map((friend) => (
                <li key={friend._id}>
                  <NavLink
                    className="text-blue-400  hover:text-blue-600 text-2xl"
                    to={`/chatBox/${friend.friendDetails._id}`}
                  >
                    <div
                      className={`flex ${
                        friend.read ? " bg-slate-200 " : "bg-green-500 "
                      } text-black  border-blue-500 border-2 p-2 rounded-lg  justify-start gap-2 flex-col`}
                    >
                      <div className="flex gap-2">
                        <img
                          className="w-8 h-8 rounded-full "
                          src={`${baseUrl}/productsUpload/${friend.friendDetails.profilePhoto}`}
                          alt="Profile"
                        />
                        <h1 className="text-blue-500">{friend.friendDetails.fullName}</h1>
                      </div>
                      <div className=" pl-8">
                        <p className=" text-sm">{friend.msg.substring(0,40)}</p>
                      </div>
                    </div>
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;

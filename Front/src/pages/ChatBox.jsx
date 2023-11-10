import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Layout from "../componets/Layout";
import { Navigate, useParams,NavLink } from "react-router-dom";
import { baseUrl } from "../Server/variable";
import { useSelector, useDispatch } from "react-redux";
import { fetchUnreadMsgNumber } from "../redux/feature/unreadMsgSlice";
import { setStatuss } from "../redux/feature/unreadMsgSlice";
import { useRef } from "react";
import { BiArrowBack } from "react-icons/bi";
import { fetchFriends } from "../redux/feature/chatSlice";
import { socket } from "../webSocket/socketSetUp";

const ChatBox = () => {

  const dispatch = useDispatch();
  const messgaeRef = useRef(null);
  const receiverId = useParams().id;
  const senderId = localStorage.getItem("userId");
  socket.emit("join", senderId);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const friendsName = useSelector((state) => {
    const friend = state.chat.data.find((item) => item.friend == receiverId);
    return friend ? friend.friendDetails : "";
  });

  useEffect(() => {
    dispatch(fetchFriends(senderId));
  }, []);
  

  //They are two function to save lastmsg in database
  const addAsReadMsgForSender = async (body) => {
    try {
      const response = await fetch(`${baseUrl}/chat/unreadmsg/${senderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addAsUnreadMsgforReceiver = async (body) => {
    try {
      const response = await fetch(`${baseUrl}/chat/unreadmsg/${receiverId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // To fetch All the messages from Databases
  useEffect(() => {
    async function fetchMessages() {
      try {
        const url = `${baseUrl}/chat/getmessages?senderid=${senderId}&receiverid=${receiverId}`;

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [receiverId, senderId]);

  //To send messages to friend and save in databases
  const handleSend = async () => {
    const newMessage = {
      sender: senderId,
      content: text,
    };

    try {
      const response = await fetch(`${baseUrl}/chat/addchat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: [senderId, receiverId],
          messages: [newMessage],
        }),
        credentials: "include",
      });

      if (response.ok) {
        const messageData = {
          sender: senderId,
          receiver: receiverId,
          content: text,
        };
        await addAsReadMsgForSender({
          friend: receiverId,
          msg: text,
          read: true,
        });
        await addAsUnreadMsgforReceiver({
          friend: senderId,
          msg: text,
          read: false,
        });
        socket.emit("chatget", messageData);
        setText("");
        setMessages((prevMessages) => [...prevMessages, messageData]);
      } else {
        throw Error("Failed to send the message");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUnread = async () => {
    const response = await fetch(
      `${baseUrl}/chat/updateUnreadMsgTrue?user=${senderId}&friend=${receiverId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      dispatch(fetchUnreadMsgNumber(senderId));
    }
  };

  useEffect(() => {
    socket.on("chat", (msg) => {
      if (msg.sender == receiverId || msg.sender == senderId) {
        console.log(msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
        updateUnread();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // To do automatically scroll in messages into last send message
  useEffect(() => {
    if (messgaeRef.current) {
      messgaeRef.current.scrollIntoView();
    }
  }, [messages]);

  useEffect(() => {
    updateUnread();
  }, [messages]);

  return (
    <div>
      <Layout>
        <div className="w-full bg-gray-900 h-screen overflow-hidden fixed flex  justify-center">
          <div className="w-full md:w-[500px]  bg-slate-500 h-full md:h-[560px] relative  flex flex-col">
            <div className="bg-slate-700 p-3">
              <div className="flex justify-start gap-5 items-center">
                {friendsName && (
                  <>
                  <NavLink to = '/chat'>
                  <BiArrowBack className=" text-xl"></BiArrowBack>
                  </NavLink>
                  
                    <div className="flex gap-3">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={`${baseUrl}/productsUpload/${friendsName.profilePhoto}`}
                        alt="Profile"
                      />
                      <h1 className="text-2xl text-green-500 ">
                        {friendsName.fullName}
                      </h1>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className=" h-4/5 px-3 py-8 overflow-y-scroll">
              {messages &&
                messages.map((message) => (
                  <div key={message._id} className="my-2">
                    {senderId.toString() === message.sender.toString() ? (
                      <div className="flex justify-end pl-10">
                        <div className="rounded-lg bg-green-300 text-black py-1 px-3">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start pr-10">
                        <div className="rounded-lg bg-green-300 text-black py-1 px-3">
                          {message.content}
                        </div>
                      </div>
                    )}
                    <div ref={messgaeRef}></div>
                  </div>
                ))}
            </div>
            <div className=" bg-cyan-500 ml-2 fixed  bottom-5 p-3 flex justify-between">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className=" bg-gray-700 text-white py-2 px-5 rounded-lg border-2 border-blue-600 focus:outline-none"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSend}
                className=" bg-blue-600 ml-9 md:ml-32 text-white py-2 px-5 rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ChatBox;

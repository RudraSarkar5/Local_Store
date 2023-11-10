import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Cookies from "js-cookie";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  
  const [visible, setVisible] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    location: "",
    profilePhoto: null,
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePhoto: file,
    });
  };

  const showToast = (message) => {
    toast.error(message, {
      className: "custom-toast", 
      position:"bottom-center",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:3000/user/signup";
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.location
    ) {
      showToast("Please Fill All The Fields");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("profilePhoto", formData.profilePhoto);

      const response = await fetch(url, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        const keyVal = result.id;
        localStorage.setItem("userId", keyVal);
        navigate("/");
      } else {
        const result = await response.json();
        showToast(result.message);
      
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    Cookies.remove("token");
    localStorage.removeItem("userId");
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-blue-500 to-blue-700">
      <div className="p-6 md:p-3 max-h-screen mt-5 bg-white rounded-md shadow-md w-96">
        <h1 className="text-2xl md:text-xl font-semibold mb-4 text-center text-blue-500">
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div>
            <label htmlFor="fullName" className="block text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700">
              User Id
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
         
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              />
              {visible ? (
                <AiFillEye
                  onClick={() => setVisible(false)}
                  className=" absolute right-2 top-2 h-5"
                />
              ) : (
                <AiFillEyeInvisible
                  onClick={() => setVisible(true)}
                  className=" absolute right-2 top-2 h-5"
                />
              )}
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="profilePhoto" className="block text-gray-700">
              Profile Photo
            </label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <NavLink to={"/login"} className="text-blue-500 hover:underline">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
      <ToastContainer />
      
    </div>
  );
};

export default Signup;

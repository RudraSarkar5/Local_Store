import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { fetchProducts } from "../redux/feature/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const showToast = (text) => {
    toast.error(text, {
      className: "custom-toast", 
      position:"bottom-center",
    });
  };

  

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    
    if (
      !formData.email ||
      !formData.password 
    ) {
      showToast("Please Fill all the field");
      return;
    }
    const url = "http://localhost:3000/user/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        dispatch(fetchProducts());
        const result = await response.json();
        const keyVal = result.id;

        localStorage.setItem("userId", keyVal);
        navigate("/");
      } else {
        showToast("Incorrect Password!")
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-blue-500 to-blue-700">
      <div className="p-6 bg-white rounded-md shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4 text-center text-blue-500">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-gray-700">
            User Id
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleFormData}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
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
                id="password"
                value={formData.password}
                onChange={handleFormData}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
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

          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

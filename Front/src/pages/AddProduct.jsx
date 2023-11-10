import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../componets/Layout";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "../redux/feature/productsSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    productImages: [],
    email: "",
  });
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files;
    const selectedFiles = [];
    for (let i = 0; i < file.length; i++) {
      selectedFiles.push(file[i]);
    }
    setFormData({
      ...formData,
      productImages: selectedFiles,
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
    const url = "http://localhost:3000/products/addProduct";

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("email", userId);

      for (let i = 0; i < formData.productImages.length; i++) {
        formDataToSend.append("productImages", formData.productImages[i]);
      }

      const response = await fetch(url, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        dispatch(setStatus());
        navigate("/");
      }else{
        const result = await response.json();
        console.log(result);
        if ( result.reason == "images"){
          showToast(result.message);
          return;
        }
        showToast(result.message);
        navigate("/signup");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="md:h-full h-screen  flex justify-center items-center">
        <div className="p-3 bg-white shadow-lg rounded-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Add a New Product
          </h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label htmlFor="productName" className="block text-gray-600">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>
              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-600">
                Price
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <div className="flex  items-center gap-5">
              <label htmlFor="productImages" className="block text-gray-600">
                Images
              </label>
              <h2 className=" text-red-600 font-bold">* max 4 images</h2>
              </div>
              
              <input
                type="file"
                name="productImages"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                className="w-full"
              />
            </div>
            <div className="text-center">
              <input
                type="submit"
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                value="Add Product"
              />
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default AddProduct;

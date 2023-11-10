import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "../componets/Layout";
import { baseUrl } from "../Server/variable";
import ConfirmationDialog from "../componets/Confirmation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setStatus } from "../redux/feature/productsSlice";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    const response = await fetch(`${baseUrl}/user/deleteAccount/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      console.log("successfully deleted your Account...");
      Cookies.remove("token");
      localStorage.removeItem("userId");
      navigate("/signup");
    } else {
      console.log("there are some problem to delete your account");
    }
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    async function getUserDetails() {
      const url = "http://localhost:3000/userDetails/";
      const response = await fetch(`${url}${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const gotUser = await response.json();
        setUserDetails(gotUser.user);
      } else {
        navigate("/signup");
      }
    }
    getUserDetails();
  }, []);

  const deleteProduct = async (productId) => {
    const url = `http://localhost:3000/products/${productId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        dispatch(setStatus());
        console.log("Product deleted successfully");
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    async function getAllProducts() {
      const url = `${baseUrl}/products/userProducts/`;
      const response = await fetch(`${url}${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const allProducts = await response.json();
        setProducts(allProducts);
      } else {
        navigate("/signup");
      }
    }
    getAllProducts();
  }, [userDetails, deleteProduct]);

  function handleLogOut() {
    Cookies.remove("token");
    localStorage.removeItem("userId");
    navigate("/signup");
  }

  return (
    <Layout>
      <div className="">
        <div className="p-4 rounded-md shadow-lg bg-blue-200">
          {userDetails && userDetails.profilePhoto && (
            <img
              className="w-32 h-32 rounded-full mx-auto"
              src={`${baseUrl}/productsUpload/${userDetails.profilePhoto}`}
              alt="Profile"
            />
          )}

          <h2
            className="text-2xl font-semibold text-center 
           text-blue-800"
          >
            {userDetails && userDetails.fullName && `${userDetails.fullName}`}
          </h2>
          <div className="text-center mt-2">
            <p className="text-gray-600">
              <strong>Email:</strong>{" "}
              {userDetails &&
                userDetails.profilePhoto &&
                `${userDetails.email}`}
            </p>
            <p className="text-gray-600">
              <strong>Location:</strong>{" "}
              {userDetails &&
                userDetails.profilePhoto &&
                `${userDetails.location}`}
            </p>
            <p className="text-gray-600">
              <strong>Products No:</strong> {products.length}
            </p>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-900 transition"
              >
                Delete
              </button>
              <button onClick={handleLogOut} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Log out
              </button>
              <div className="absolute">
                {showConfirmation && (
                  <ConfirmationDialog
                    message="Are you sure you want to delete your account?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap w-full py-5 justify-center gap-5  bg-blue-100">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="w-80">
              <NavLink to={`/productDetails/${product._id}`}>
                <div className="flex flex-col justify-center items-center gap-3 p-4 bg-blue-300 rounded-md">
                  <h1 className="text-2xl font-semibold text-blue-800">
                    {product.productName}
                  </h1>
                  <img
                    className="h-60 w-full object-cover rounded-md"
                    src={`${baseUrl}/productsUpload/${product.productImages[0]}`}
                    alt=""
                  />
                  <p className="text-gray-600">
                    {product.description.length > 90
                      ? `${product.description.slice(0, 90)}...`
                      : product.description}
                  </p>
                  <h1 className="text-2xl font-semibold text-blue-800">
                    RS {product.price}
                  </h1>
                </div>
              </NavLink>
              <div className="flex justify-between p-3 bg-blue-200 rounded-md">
                <NavLink to={`/productUpdate/${product._id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    Edit
                  </button>
                </NavLink>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-2xl text-red-500">No Products Exist</h1>
        )}
      </div>
    </Layout>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "../componets/Layout";

const ProductUpdate = () => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
  });

  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = "http://localhost:3000/products";
        const response = await fetch(`${baseUrl}/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        setFormData({
          productName: result.productName,
          description: result.description,
          price: result.price,
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:3000/products/update/${id}`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(formData),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("You can navigate");
        navigate("/profile");
      } else {
        navigate("/signup");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Layout>
      <div className="h-screen flex justify-center items-center bg-gradient-to-b from-blue-500 to-blue-700">
        <div className="p-6 bg-white rounded-md shadow-md w-96">
          <h1 className="text-2xl font-semibold mb-4 text-center text-blue-500">
            Update Product
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="productName" className="block text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700">
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
            <div>
              <label htmlFor="price" className="block text-gray-700">
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
            <div className="text-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProductUpdate;

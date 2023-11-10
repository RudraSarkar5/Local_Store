import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "../componets/Layout";
import { baseUrl } from "../Server/variable";

const ProductInfo = () => {
  const url = `http://localhost:3000/products`;
  const [productData, setProductData] = useState({});
  const [images, setImages] = useState([]);
  const [bigImage, setBigImage] = useState("");
  const userId = useParams();
  console.log(userId.id);
  const navigate = useNavigate();
  const getUserId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${url}/${userId.id}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setProductData(result);
          setImages(result.productImages);
          setBigImage(`${baseUrl}/productsUpload/${result.productImages[0]}`);
        } else {
          navigate("/signup");
        }
      } catch (error) {
        console.log("Error fetching product data:", error);
      }
    }

    fetchData();
  }, []);

  function handleImageClick(val) {
    setBigImage(val);
  }

  function renderImage() {
    if (
      !productData ||
      !productData.productImages ||
      productData.productImages.length < 2
    ) {
      return null;
    }

    return images.map((image, index) => (
      <div
        key={index}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        <img
          className="h-28 border-gray-950 border-2"
          onClick={() => handleImageClick(`${baseUrl}/productsUpload/${image}`)}
          src={`${baseUrl}/productsUpload/${image}`}
          alt="Product Photo"
        />
      </div>
    ));
  }

  return (
    <Layout>
      <div className="h-screen w-screen relative top-20">
        <div className="h-screen  w-screen lg:h-4/5 lg:w-4/5 mx-auto flex lg:flex-row flex-col shadow-xl">
          <div className="bg-gray-100 lg:w-[50%] h-[50%] lg:h-[100%] grid grid-cols-4 gap-3  grid-rows-4">
            <div className="row-span-4 col-span-3">
              <img
                src={bigImage}
                alt=""
                className="h-full w-full border-2 border-gray-950 p-2"
              />
            </div>
            {productData && renderImage()}
          </div>
          <div className="lg:w-[50%] h-[50%] bg-blue-300 lg:h-[100%] p-5 flex flex-col gap-5">
            <div>
              <h1 className="text-3xl font-bold">
                {productData ? productData.productName : "Product Name"}
              </h1>
            </div>
            <div className="flex justify-center flex-col gap-2">
              <h1 className="text-2xl font-bold">
                Price: ₹{productData ? productData.price : "Product Price"}
              </h1>
            </div>
            <div>
              <p className="text-lg">
                {productData ? productData.description : "Product Description"}
              </p>
            </div>
            {productData && productData.userId != getUserId && (
              <NavLink
                className="p-3 bg-slate-950 text-white shadow-lg rounded-lg w-24"
                to={`/chatBox/${productData ? productData.userId : ""}`}
              >
                Chat
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductInfo;

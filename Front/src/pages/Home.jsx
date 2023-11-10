import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/feature/productsSlice";
import { NavLink } from "react-router-dom";
import Layout from "../componets/Layout";
import Search from "../componets/Search";
import { baseUrl } from "../Server/variable";
import { addToCart } from "../redux/feature/cartSlice";
import { setStatus } from "../redux/feature/cartSlice";
import { setStatuss } from "../redux/feature/unreadMsgSlice";


const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const productsVal = useSelector((state) => state.products.data);
  const status = useSelector((state) => state.products.status);
  const searchValue = useSelector((state) => state.searchText.text);
  const userId = localStorage.getItem("userId");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    } else if (status === "failed") {
      console.error("Error fetching products:");
      navigate("/signup");
    }
  }, [status, dispatch]);

  const handleCartClick = (product) => {
    dispatch(addToCart({ product, userId }));
    dispatch(setStatus());
  };

  useEffect(() => {
    if (searchValue == "") {
      setProducts(productsVal);
    } else {
      const searchProducts = productsVal.filter((product) => {
        return product.productName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setProducts(searchProducts);
    }
  }, [searchValue, productsVal]);

  return (
    <Layout>
      <Search />
      <div className="flex flex-wrap min-h-full justify-center gap-5 mt-5">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product._id}
              className=" w-80 md:w-1/4 rounded overflow-hidden p-3 shadow-lg bg-lime-100 hover:shadow-2xl transition duration-300"
            >
              <NavLink to={`/productDetails/${product._id}`}>
                <h1 className="text-xl text-center font-semibold mb-2">
                  {product.productName}
                </h1>
                <img
                  className="w-full h-56 object-cover"
                  src={`${baseUrl}/productsUpload/${product.productImages[0]}`}
                  alt={product.productName}
                />
              </NavLink>
              <div className="px-6 py-4">
                <p className="text-gray-600 text-sm mb-4">
                  {product.description.length > 90
                    ? product.description.slice(0, 90) + "..."
                    : product.description}
                </p>
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-lg font-bold text-blue-700">
                    RS {product.price}
                  </span>
                  <button
                    onClick={() => handleCartClick(product)}
                    className="px-2 py-1 bg-blue-700 text-white rounded hover-bg-blue-900 transition duration-300"
                  >
                    Add Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-3xl font-semibold text-center  mt-10 w-full">
            No Products Exist
          </h1>
        )}

        <div
          className=" w-full  py-5 flex justify-center items-center 
           
          "
        >
          <div
            className={`${
              currentProducts.length == 0 ? "hidden" : ""
            } w-full md:w-1/3 lg:w-1/3 bg-slate-400 h-12 overflow-y-hidden overflow-x-scroll flex rounded-sm border-2`}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className=" bg-white  px-2 mx-2 my-1 font-bold rounded-md border-1 border-black"
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

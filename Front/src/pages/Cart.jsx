import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/feature/cartSlice";
import { NavLink } from "react-router-dom";
import Layout from "../componets/Layout";
import { baseUrl } from "../Server/variable";
import { addToCart } from "../redux/feature/cartSlice";
import { setStatus } from "../redux/feature/cartSlice";
import { removeCart } from "../redux/feature/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.data);
  console.log(products);
  const status = useSelector((state) => state.cart.status);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCart(userId));
    } else if (status === "failed") {
      console.error("Error fetching products:");
      navigate("/signup");
    }
  }, [dispatch, status, navigate]);

  const handleCartClick = (product_id) => {
    dispatch(removeCart(product_id));
    dispatch(setStatus());
  };

  return (
    <Layout>
      <div className="flex flex-wrap  justify-center gap-5 pt-5">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className=" w-80 md:w-1/4 rounded overflow-hidden p-3 shadow-lg bg-lime-100 hover:shadow-2xl transition duration-300"
            >
              <div className="flex justify-between">
                <h1 className="text-xl text-center font-semibold mb-2">
                  {product.productName}
                </h1>
                <h1>Q:{product.qty}</h1>
              </div>

              <NavLink to={`/productDetails/${product._id}`}>
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
                    onClick={() => handleCartClick(product._id)}
                    className="px-2 py-1 bg-blue-700 text-white rounded hover-bg-blue-900 transition duration-300"
                  >
                    remove
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
      </div>
    </Layout>
  );
};

export default Cart;

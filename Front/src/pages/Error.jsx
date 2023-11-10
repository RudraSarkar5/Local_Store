import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  function handleReload() {
    navigate("/");
  }

  return (
    <div className="h-screen w-screen px-2 flex flex-col justify-center items-center bg-gradient-to-b from-red-500 to-red-700 text-white">
      <div className="text-4xl font-bold mb-4">Oops, Something Went Wrong!</div>
      <p className="text-lg">
        We're sorry, but an error occurred while processing your request.
      </p>
      <p className="text-lg">
        Please try again later or contact support if the issue persists.
      </p>
      <button
        className="mt-8 px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-red-100 hover:text-red-600 focus:outline-none"
        onClick={handleReload}
      >
        Reload Page
      </button>
    </div>
  );
};

export default Error;

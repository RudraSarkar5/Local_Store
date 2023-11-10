import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearch } from "../redux/feature/searchSlice";

const Search = () => {
  const [textVal, setTextVal] = useState();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  return (
    <div>
      <div className="flex justify-center  w-full">
        <input
          value={textVal}
          onChange={handleChange}
          placeholder="Search Product Here"
          className="p-2 w-full md:w-3/4 m-5 rounded-lg border-2 border-blue-500 focus:outline-none focus:border-blue-700 shadow-md"
          type="text"
        />
      </div>
    </div>
  );
};

export default Search;

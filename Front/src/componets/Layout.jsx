import React from "react";
import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="mainDiv">
      <Nav />
      {children}
    </div>
  );
};

export default Layout;

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import "./layout.css";

const Layout = () => {
  return (
    <div className="ly-container">
      <Navbar />

      <div className="ly-main-wrapper">
        <Sidebar />

        <main className="ly-content-area" id="main-content">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default Layout;

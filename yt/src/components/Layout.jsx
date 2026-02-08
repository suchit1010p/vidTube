import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />

      <div className="layout-body">
        <Sidebar />

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

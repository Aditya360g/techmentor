import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#08070f]">
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
}

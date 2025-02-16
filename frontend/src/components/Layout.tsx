import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="mt-16 p-4 rounded-xl bg-black">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

import React from "react";
import { Poppins } from "next/font/google";

import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";

const poppins = Poppins({
  variable: "--poppins-font",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});
export default function Layout({ children }: any) {
  return (
    <div className={poppins.className + " min-h-screen flex flex-col justify-between"}>
      <Nav />
      <div className="flex flex-col flex-1 container sm:items-center pt-28">
        {children}
      </div>
      <Footer />
    </div>
  );
}

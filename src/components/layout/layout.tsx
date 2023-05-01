import React from "react";
import Nav from "./Nav/Nav";
import { Poppins } from "next/font/google";
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
      <div
        className={"flex flex-col flex-1 container sm:items-center lg:pt-28 p-5"}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}

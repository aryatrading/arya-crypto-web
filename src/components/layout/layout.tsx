import React from "react";
import { Poppins } from "next/font/google";
import clsx from "clsx";

import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";

const poppins = Poppins({
  variable: "--poppins-font",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});
// flex flex-col flex-1 container sm:items-center lg:pt-28 p-5
export default function Layout({ children }: any) {
  return (
    <div className={poppins.className}>
      <Nav />
      <div className={clsx('h-full w-full container mx-auto sm:items-center', poppins.className)}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

import React, { useEffect } from "react";
import { Poppins } from "next/font/google";

import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";
import { initStoreData } from "../../common/hooks/initStore";
import { useAuthUser } from "next-firebase-auth";
import { getNotifications } from "../../services/controllers/notifications";

const poppins = Poppins({
  variable: "--poppins-font",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});


export function SalesPagesLayout({ children }: any) {
  return (
    <div className={poppins.className + " min-h-screen flex flex-col justify-between"}>
      <Nav />
      <div className="flex flex-col flex-1 sm:items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}


export default function Layout({ children }: any) {

  const authUser = useAuthUser();

  useEffect(() => {
    if (authUser.id !== null) {
      initStoreData();
      getNotifications(0, 100, "desc");
    }
  }, [authUser.id]);

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

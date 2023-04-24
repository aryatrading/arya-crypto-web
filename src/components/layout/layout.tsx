import clsx from "clsx";
import { Poppins } from "next/font/google";

type LayoutPropsType = { children: any };

const poppins = Poppins({
  variable: "--poppins-font",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutPropsType) {
  return (
    <div className={clsx("h-full w-full", poppins.className)}>{children}</div>
  );
}

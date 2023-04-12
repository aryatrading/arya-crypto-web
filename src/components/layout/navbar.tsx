import Link from "next/link";
import Image from "next/image";
import { images } from "../../assets/images/images";
import { NavLinkItem } from "../shared/navlink/navlinkitem";
import { icons } from "../../assets/navbar_icons/icons";

export default function Navbar() {
  return (
    <div className="flex flex-wrap bg-[#171717] w-5/12 h-14 rounded-2xl items-center mt-5 mx-auto px-4 justify-between">
      <div className="grid grid-flow-col gap-7 items-center">
        <Link href={"/login"}>
          <Image src={images.logoIcon} alt="logo" />
        </Link>
        <NavLinkItem
          linkto="/login"
          navTitle="My Portfolio"
          navIcon={<Image src={icons.home} alt="logo" width={20} height={20} />}
        />
        <NavLinkItem
          linkto="/home"
          navTitle="Smart Allocation"
          navIcon={
            <Image src={icons.portfolio} alt="logo" width={20} height={20} />
          }
        />
        <NavLinkItem
          linkto="/login"
          navTitle="Trade"
          navIcon={
            <Image src={icons.trade} alt="logo" width={20} height={20} />
          }
        />
        <NavLinkItem
          linkto="/home"
          navTitle="Market"
          navIcon={
            <Image src={icons.market} alt="logo" width={20} height={20} />
          }
        />
      </div>
      <div className="grid grid-flow-col gap-2 items-center">
        <NavLinkItem
          linkto="/login"
          navIcon={
            <Image src={icons.settings} alt="logo" width={20} height={20} />
          }
        />
        <NavLinkItem
          linkto="/home"
          navIcon={
            <Image src={icons.account} alt="logo" width={20} height={20} />
          }
        />
      </div>
    </div>
  );
}

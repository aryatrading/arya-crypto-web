import Link from "next/link";
import Image from "next/image";
import { images } from "../../assets/images";
import { NavLinkItem } from "../shared/navlink/navlinkitem";
import { icons } from "../../assets/navbar_icons/icons";
import { useAuthModal } from "../../context/authModal.context";
import Button from "../shared/buttons/button";

export default function Navbar() {
  const {modalTrigger, setVisibleSection} = useAuthModal();
  return (
    <div className="flex flex-wrap bg-[#171717] w-5/12 h-14 rounded-2xl items-center mx-auto px-4 justify-between  mt-5">
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
          linkto="/market"
          navTitle="Market"
          navIcon={
            <Image src={icons.market} alt="logo" width={20} height={20} />
          }
        />
      </div>
      <div className="grid grid-flow-col gap-2 items-center">
        <Button onClick={() => {
            setVisibleSection('login');
            modalTrigger.show();
          }}>
          <Image src={icons.settings} alt="logo" width={20} height={20} />
        </Button>
        <Button onClick={() => {
            setVisibleSection('signup');
            modalTrigger.show();
          }}>
        <Image src={icons.account} alt="logo" width={20} height={20} />
        </Button>
        {/* <NavLinkItem
          linkto="/login"
          navIcon={
          }
        /> */}
        {/* <NavLinkItem
          linkto="/home"
          navIcon={
          }
        /> */}
      </div>
    </div>
  );
}

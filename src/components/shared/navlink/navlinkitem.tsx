import { FC } from "react";
import { NavlinkProps } from "./navlink.types";
import Link from "next/link";

export const NavLinkItem: FC<NavlinkProps> = ({
  linkto,
  navTitle,
  navIcon,
}) => {
  return (
    <Link href={`${linkto}`} className="grid grid-flow-col gap-2 items-center">
      {navIcon}
      <h2 className="text-[#D9D9D9] font-semibold text-sm">{navTitle}</h2>
    </Link>
  );
};

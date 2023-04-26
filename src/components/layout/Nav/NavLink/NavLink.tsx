import { useTranslation } from "next-i18next";
import Link, { LinkProps } from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface INavLink extends LinkProps {
  NavIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  navTitle?: string;
  Hover?:React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  fill?:boolean;
  active?:boolean;
  className?:string
}

const NavLink = ({ NavIcon, navTitle, Hover,fill=true, active=false, className, ...props }: INavLink) => {
  const [isHover, setIsHover] = useState(false)
  const { t } = useTranslation(['common']);

  return (
    <Link
      {...props}
      className= {twMerge("group flex justify-start items-center gap-3 lg:justify-center py-3 px-6 lg:p-0 lg:border-b-0",`${!!Hover&&'border-b-2 dark:border-grey-3'}`,`${(!!Hover&&(isHover||active))&&'lg:border-b-2 lg:dark:border-blue-1'}`,className)}
      onMouseEnter={()=>setIsHover(true)}
      onMouseLeave={()=>{setIsHover(false)}}
    >
      {(!!Hover&&(isHover||active))?<Hover className="w-6 h-6"/>:<NavIcon className="w-6 h-6"/>}
      {!!navTitle && (
        <h2 className={twMerge("dark:text-white font-medium text-sm",`${(!!Hover&&(isHover||active))&&'dark:text-blue-1'}`)}>
          {t(navTitle)}
        </h2>
      )}
    </Link>
  );
};

export default NavLink;

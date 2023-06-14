import {
  facebookIcon,
  twitterIcon,
  linkedinIcon,
  instagramIcon,
} from "../../components/svg/SocialIcons";

export const socials = [
  {
    name: "facebook",
    link: "https://www.facebook.com",
    logo: facebookIcon,
  },
  {
    name: "twitter",
    link: "https://www.twitter.com",
    logo: twitterIcon,
  },
  {
    name: "linkedin",
    link: "https://www.linkedin.com",
    logo: linkedinIcon,
  },
  {
    name: "instagram",
    link: "https://www.instagram.com",
    logo: instagramIcon,
  },
];

export const footerLinks = [
  {
    name: "Pages",
    links: [
      {
        name: "Home",
        route: "/home",
      },
      {
        name: "Portfolio",
        route: "/dashboard",
      },
      {
        name: "Smart Allocation",
        route: "/smart-allocation",
      },
      {
        name: "Trading",
        route: "/trade",
      },
      {
        name: "Watchlist",
        route: "/market",
      },
    ],
  },
  {
    name: "Tools",
    links: [
      {
        name: "Return Calculator",
        route: "/coin-profit-calculator",
      },
      {
        name: "Crypto Converter",
        route: "/coin-converter",
      },
    ],
  },
  //   {
  //     name: "Our products",
  //     links: [
  //       {
  //         name: "Arya Trading",
  //         route: "https://www.arya.com",
  //       },
  //       {
  //         name: "Arya App",
  //         route: "https://www.arya.com",
  //       },
  //       {
  //         name: "Arya Crypto",
  //         route: "https://www.aryacrypto.com",
  //       },
  //     ],
  //   },
];

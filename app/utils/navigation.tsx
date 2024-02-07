import { BsGrid, BsShop, BsStack, BsFillPeopleFill } from "react-icons/bs";

interface INav {
  label: string;
  url: string;
  icon: React.ReactNode;
}

export const navigations: INav[] = [
  {
    label: "Dashboard",
    url: "/dashboard",
    icon: <BsGrid size={18} />,
  },
  {
    label: "Categories",
    url: "/dashboard/category",
    icon: <BsStack size={18} />,
  },
  {
    label: "Product",
    url: "/dashboard/product",
    icon: <BsShop size={18} />,
  },
  {
    label: "Users",
    url: "/dashboard/users",
    icon: <BsFillPeopleFill size={18} />,
  },
  {
    label: "Banner",
    url: "/dashboard/banner",
    icon: <BsFillPeopleFill size={18} />,
  },
];

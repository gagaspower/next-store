import { FC } from "react";
import dynamic from "next/dynamic";

const NavbarTop = dynamic(() => import("@/components/public/Navbar"));
const Footer = dynamic(() => import("@/components/public/Footer"));

const withWebStore = (Component: FC<any>) => {
  const StoreLayout: FC = (props) => {
    return (
      <div className="bg-[#f5f5f5] min-h-screen overflow-hidden">
        <NavbarTop />
        <Component {...props} />
        <Footer />
      </div>
    );
  };

  return StoreLayout;
};

export default withWebStore;

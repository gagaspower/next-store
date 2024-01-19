import { FC } from "react";
import NavbarTop from "../component/layouts/front/Navbar";
import Footer from "../component/layouts/front/Footer";

const withWebStore = (Component: any) => {
  const StoreLayout: FC = (props) => {
    return (
      <div className="bg-[#f5f5f5] min-h-screen">
        <NavbarTop />
        <Component {...props} />
        <Footer />
      </div>
    );
  };

  return StoreLayout;
};

export default withWebStore;

import React from "react";

import Slider from "./component/layouts/front/Slider";
import Categories from "./component/layouts/front/Categories";
import Shop from "./component/layouts/front/Shop";
import { Jarak } from "./component/application-ui/Spacing";
import withWebStore from "./hook/withWebStore";
import Breadcrumbs from "./component/layouts/front/Breadcumbs";

const HomePage = () => {
  return (
    <>
      <Breadcrumbs />
      <Slider />
      <section className="w-full md:max-w-6xl m-auto px-5">
        <Categories />
        <Shop />
      </section>
      <Jarak />
    </>
  );
};

export default withWebStore(HomePage);

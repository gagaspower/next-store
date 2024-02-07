import React from "react";
import withWebStore from "@/context/withWebStore";
import dynamic from "next/dynamic";
import { Jarak } from "./components/application-ui/Spacing";

const Slider = dynamic(() => import("@/components/public/Slider"));
const Categories = dynamic(() => import("@/components/public/Categories"));
const FeaturedProduct = dynamic(
  () => import("@/components/public/FeaturedProduct")
);

function HomePage() {
  return (
    <>
      <Slider />
      <section className="w-full md:max-w-6xl m-auto px-5">
        <Categories />
        <FeaturedProduct />
      </section>
      <Jarak />
    </>
  );
}

export default withWebStore(HomePage);

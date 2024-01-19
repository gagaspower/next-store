"use client";
import React, { FC } from "react";
import ContentWrapper from "../component/application-ui/ContentWrapper";
import withAuth from "../hook/withAuth";

const Home: FC = () => {
  return (
    <ContentWrapper>
      <div>Hello world</div>
    </ContentWrapper>
  );
};

export default withAuth(Home);

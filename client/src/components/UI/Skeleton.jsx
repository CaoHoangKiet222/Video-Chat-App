import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonComponent = () => {
  return (
    <p>
      sdfasdfasdf
      <Skeleton height={30} width={300} duration={1} />
    </p>
  );
};

export default SkeletonComponent;

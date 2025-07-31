import React, { lazy, Suspense } from "react";
import { LoadingData } from "../../layout/LoadingTable";

const Adk2023 = lazy(() => import("./Adk"));
const Adk22 = lazy(() => import("./Adk2022"));
const Adk21 = lazy(() => import("./Adk2021"));
const Adk20 = lazy(() => import("./Adk2020"));
const Adk19 = lazy(() => import("./Adk2019"));
const Adk24 = lazy(() => import("./Adk24"));
const Adk25 = lazy(() => import("./Adk25"));

function TayangAdk(props) {
  return (
    <div>
      <Suspense fallback={<LoadingData />}>
        <Adk25 kdsatker={props.kdsatker} />
        <Adk24 kdsatker={props.kdsatker} />
        <Adk2023 kdsatker={props.kdsatker} />
        <Adk22 kdsatker={props.kdsatker} />
        <Adk21 kdsatker={props.kdsatker} />
        <Adk20 kdsatker={props.kdsatker} />
        <Adk19 kdsatker={props.kdsatker} />
      </Suspense>
    </div>
  );
}

export default TayangAdk;

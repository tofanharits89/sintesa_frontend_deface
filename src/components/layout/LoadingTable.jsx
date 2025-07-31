import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingChart = () => <Skeleton count={5} />;
const LoadingTable = () => <Skeleton count={3} />;
const Loading2 = () => <Skeleton count={2} />;
const Loading1 = () => <Skeleton count={1} />;
const LoadingData = () => <Skeleton count={8} />;
// const LoadingImage = () => (
//   <Skeleton circle height="100%" containerClassName="avatar-skeleton" />
// );
const TableSkeleton = ({ columns, width }) => {
    return (
        <>
            {Array.from({ length: columns }, (_, index) => (
                <tr key={index} >
                    <td className="align-middle text-center">
                        <Skeleton width={width} />
                    </td>
                </tr >
            ))}
        </>
    );
};

export { LoadingTable, LoadingChart, LoadingData, Loading2, Loading1, TableSkeleton };

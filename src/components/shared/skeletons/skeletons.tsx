import { FC } from "react";
import Skeleton from 'react-loading-skeleton';


export const TextSkeleton: FC<{ widthClassName?: string, heightClassName?: string }> = ({ widthClassName = "w-2/3", heightClassName = "h-10" }) => {
    return <Skeleton baseColor="#111827" className={`w-full ${heightClassName}`} containerClassName={`${widthClassName} ${heightClassName}`} />
}


export const DoughnutSkeleton: FC<{ widthClassName?: string }> = ({ widthClassName = "w-full", }) => {
    return <Skeleton baseColor="#111827" circle={true} className={`w-full aspect-square`} containerClassName={`${widthClassName} aspect-square`} />
}


export const TableRowSkeleton: FC<{ numberOfColumns: number }> = ({ numberOfColumns }) => {
    return (
        <tr>
            {Array.from(Array(1).keys()).map(() => <td colSpan={numberOfColumns}><TextSkeleton /></td>)}
        </tr>
    );
}


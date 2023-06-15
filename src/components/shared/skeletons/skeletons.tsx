import { FC } from "react";
import Skeleton from 'react-loading-skeleton';
import { Col, Row } from "../layout/flex";


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

export const PostSkeleton: FC = () => {
    return (
        <Col className="w-full gap-5 bg-[#1E293B] py-4 md:py-6 px-6 md:px-10 rounded-md">
            <Row className="gap-2 items-center">
                <Row className="w-12 aspect-square"><DoughnutSkeleton /></Row>
                <Col className="gap-1">
                    <TextSkeleton widthClassName="w-24" heightClassName="h-5" />
                    <TextSkeleton widthClassName="w-28" heightClassName="h-5" />
                </Col>
            </Row>
            <Row className="gap-2 items-center">
                <TextSkeleton widthClassName="w-16" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-16" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-16" heightClassName="h-5" />
            </Row>
            <Col className="gap-2 items-center">
                <TextSkeleton widthClassName="w-full" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-full" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-full" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-full" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-full" heightClassName="h-5" />
            </Col>
            <TextSkeleton widthClassName="w-full" heightClassName="aspect-video" />
            <TextSkeleton widthClassName="w-full" heightClassName="h-20" />
            <TextSkeleton widthClassName="w-20" heightClassName="h-5" />
            <Row className="h-[1px] bg-[#ACB3BA]"/>
            <Row className="gap-2 items-center justify-between">
                <TextSkeleton widthClassName="w-16" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-16" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-16" heightClassName="h-5" />
                <TextSkeleton widthClassName="w-16" heightClassName="h-5" />
            </Row>
        </Col>
    )
}


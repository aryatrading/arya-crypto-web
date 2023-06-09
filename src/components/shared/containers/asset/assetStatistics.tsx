import { FC } from "react";
import { Col } from "../../layout/flex";
import { TextSkeleton } from "../../skeletons/skeletons";

type AssetStats = {
  title?: string;
  value?: any;
  className?: string;
};

export const AssetStatistics: FC<AssetStats> = ({ title, value,className }) => {
  return (
    <Col className={className}>
      <h3 className="font-medium text-sm text-grey-1">{title}</h3>
      {value === undefined? <TextSkeleton/> : <p className="font-medium text-sm">{value}</p>}
    </Col>
  );
};

export default AssetStatistics;

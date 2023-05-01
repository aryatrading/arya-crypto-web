import { FC } from "react";
import { Col } from "../../layout/flex";

type AssetStats = {
  title?: string;
  value?: any;
};

export const AssetStatistics: FC<AssetStats> = ({ title, value }) => {
  return (
    <Col>
      <p className="font-medium text-sm text-grey-1">{title}</p>
      <p className="font-medium text-xl">{value}</p>
    </Col>
  );
};

export default AssetStatistics;

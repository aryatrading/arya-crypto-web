import { FC } from "react";
import { Col } from "../../layout/flex";

type AssetStats = {
  title?: string;
  value?: any;
};

export const AssetStatistics: FC<AssetStats> = ({ title, value }) => {
  return (
    <Col>
      <h3 className="font-medium text-sm text-grey-1">{title}</h3>
      <p className="font-medium text-xl">{value}</p>
    </Col>
  );
};

export default AssetStatistics;

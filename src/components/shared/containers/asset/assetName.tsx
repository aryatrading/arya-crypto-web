import { FC } from "react";
import { Row } from "../../layout/flex";

type AssetNameProps = {
  iconUrl?: string;
  name?: string;
  symbol?: string;
};

export const AssetName: FC<AssetNameProps> = ({ iconUrl, name, symbol }) => {
  return (
    <Row className="gap-3 align-center items-center">
      <img className="w-9 h-9 rounded-full" src={iconUrl} alt="new" />
      <p className="text-white font-medium text-3xl">{name}</p>
      <p className="text-grey-1 font-medium text-3xl">{symbol}</p>
    </Row>
  );
};

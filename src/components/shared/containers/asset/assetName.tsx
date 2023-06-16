import { FC } from "react";
import { Row } from "../../layout/flex";
import { TextSkeleton } from "../../skeletons/skeletons";
type AssetNameProps = {
  iconUrl?: string;
  name?: string;
  symbol?: string;
};

export const AssetName: FC<AssetNameProps> = ({ iconUrl, name, symbol }) => {

  return (
    <Row className="gap-3 align-center items-center">
      {iconUrl ? <img className="w-9 h-9 rounded-full" src={iconUrl} alt={name} /> : <TextSkeleton/>}
      {name ?<h2>
      <span className="text-white font-medium text-lg md:text-3xl">{name}</span>
      <span className="text-grey-1 font-medium text-lg md:text-3xl"> · {symbol}</span>
      </h2>:  <TextSkeleton/>}
    </Row>
  );
};

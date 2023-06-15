import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFilter,
  getPairs,
  setFilter,
} from "../../../../services/redux/tradeSlice";
import { Row } from "../../layout/flex";
import { ShadowButton } from "../../buttons/shadow_button";

export const AssetPairSelector: FC = () => {
  const dispatch = useDispatch();
  const pairs = useSelector(getPairs);
  const filter = useSelector(getFilter);

  return (
    <Row className="gap-1">
      {pairs &&
        pairs.map((elm: string, index: number) => {
          return (
            <ShadowButton
              key={index}
              title={elm.replace("-", "")}
              onClick={() =>
                dispatch(setFilter({ filter: elm.replace("-", "") }))
              }
              border={"rounded-md"}
              bgColor={filter === elm ? "bg-blue-3" : "bg-grey-2"}
              textColor={filter === elm ? "text-blue-2" : ""}
              textSize="text-xs text-center"
            />
          );
        })}
    </Row>
  );
};

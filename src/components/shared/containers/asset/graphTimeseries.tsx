import { FC } from "react";
import { Row } from "../../layout/flex";
import { ShadowButton } from "../../buttons/shadow_button";

type TimeseriesProps = {
  series: { title: string; value: string; key: string; points?: number }[];
  active: string;
  onclick: Function;
};

export const TimeseriesPicker: FC<TimeseriesProps> = ({
  series,
  active,
  onclick,
}) => {
  return (
    <Row className="gap-0.5">
      {series.map((elm, index) => {
        return (
          <ShadowButton
            key={index}
            title={elm.title}
            onClick={() => onclick(elm)}
            border={
              index === 0
                ? "rounded-l-md"
                : index === series.length - 1
                ? "rounded-r-md"
                : ""
            }
            bgColor={active === elm.key ? "bg-blue-3" : "bg-grey-2"}
            textColor={active === elm.key ? "text-blue-2" : ""}
          />
        );
      })}
    </Row>
  );
};

import { FC } from "react";
import { Row } from "../../layout/flex";
import { ShadowButton } from "../../buttons/shadow_button";
import { twMerge } from "tailwind-merge";

type TimeseriesProps = {
  series: { title: string; value?: string; key: string; points?: number, icon?:any }[];
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
            className={twMerge('px-3 py-2 gap-0',elm.title==='3M'?'hidden md:flex':'')}
            key={index}
            title={elm.title}
            onClick={() => onclick(elm)}
            showBadge={index % 2 === 0}
            border={
              index === 0
                ? "rounded-l-md"
                : index === series.length - 1
                ? "rounded-r-md"
                : ""
            }
            iconSvg={
              elm.icon ? 
              <elm.icon className={twMerge('md:hidden',elm.key=== "price"?'stroke-current':'fill-current',active===elm.key?'text-blue-2':'text-grey-1')}/> 
              : null
            }
            bgColor={active === elm.key ? "bg-blue-3" : "bg-grey-2"}
            textColor={active === elm.key ? "text-blue-2" : "text-grey-1"}
            textSize={`font-medium text-xs ${elm.icon&&`hidden md:block`}`}
          />
        );
      })}
    </Row>
  );
};

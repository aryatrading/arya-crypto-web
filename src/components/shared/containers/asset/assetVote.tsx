import { FC } from "react";
import { Col, Row } from "../../layout/flex";
import { ShadowButton } from "../../buttons/shadow_button";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

const AssetVote: FC = ({}) => {
  return (
    <Col className="gap-3">
      <p className="font-medium text-sm">
        How do you feel about Bitcoin today?
      </p>
      <Row className="gap-2">
        <ShadowButton
          title="Bullish"
          bgColor="bg-green-2"
          onClick={() => null}
          textColor="text-green-1"
          border="rounded-md"
          iconSvg={<ArrowTrendingUpIcon className="h-6 w-6 stroke-green-1" />}
        />
        <ShadowButton
          title="Bearish"
          bgColor="bg-red-2"
          onClick={() => null}
          textColor="text-red-1"
          border="rounded-md"
          iconSvg={<ArrowTrendingDownIcon className="h-6 w-6 stroke-red-1" />}
        />
      </Row>
      <p className="text-grey-1 text-xs">Vote to see results</p>
    </Col>
  );
};

export default AssetVote;
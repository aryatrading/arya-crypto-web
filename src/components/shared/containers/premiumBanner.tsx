import { FC } from "react";
import { Row } from "../layout/flex";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export const PremiumBanner: FC = () => {
  return (
      <Row className="bg-grey-1 rounded-md gap-2 justify-center items-center py-2">
        <p className="text-xs font-semibold text-center">
          This feature is for premium users
        </p>
        <ExclamationCircleIcon width={14} height={14} />
      </Row>
  );
};

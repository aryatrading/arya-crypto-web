import { FC } from "react";
import { Row } from "../layout/flex";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export const PremiumBanner: FC = () => {
  return (
    <div className="bg-grey-1 rounded-md flex justify-center">
      <Row className="gap-2 items-center">
        <p className="text-xs font-semibold text-center py-1.5">
          This feature is for premium users
        </p>
        <ExclamationCircleIcon width={14} height={14} />
      </Row>
    </div>
  );
};

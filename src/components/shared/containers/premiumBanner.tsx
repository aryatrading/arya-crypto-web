import { FC } from "react";
import { Row } from "../layout/flex";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

export const PremiumBanner: FC = () => {
  const { t } = useTranslation(["common"]);

  return (
    <div className="bg-transparent rounded-md h-11 border-2 border-orange-1 item-center flex flex-row justify-between">
      <Row className="gap-2 flex items-center mt-0.5">
        <div className="w-2" />
        <LockClosedIcon width={15} height={15} color="bg-orange-1" />
        <p className="md:text-md text-sm font-semibold text-center py-1.5">
          {t("premiumusersfeature")}
        </p>
      </Row>
      <div className="bg-orange-1 w-28 flex items-center justify-center cursor-pointer">
        <p className="text-sm">{t("upgradenow")}</p>
      </div>
    </div>
  );
};

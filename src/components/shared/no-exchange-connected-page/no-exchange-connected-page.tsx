import { Col } from "../layout/flex";
import { useTranslation } from "next-i18next";
import AddExchange from "../../app/exchangeTab/AddExchange";

const NoConnectedExchangePage = () => {
  const { t } = useTranslation(["common"]);

  return (
    <div className="flex flex-col w-full h-96 items-center justify-center">
      <Col className="gap-5 items-center justify-center">
        <AddExchange
          onPressExchange={(data: any) => (window.location.href = "/settings")}
        />
      </Col>
    </div>
  );
};

export default NoConnectedExchangePage;

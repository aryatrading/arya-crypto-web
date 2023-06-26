import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Col } from "../layout/flex";
import AddExchange from "../../app/exchangeTab/AddExchange";

const NoConnectedExchangePage = () => {
  const { push, route } = useRouter();
  const [exchange, setExchange] = useState([]);

  const backgroundImage = useMemo(() => route.includes("dashboard") ? require("../../../../public/assets/images/dashboard.png") : route.includes("trade") ? require("../../../../public/assets/images/trade.png") : require("../../../../public/assets/images/smartallocation.png"), [route]);

  useEffect(() => {
    if (exchange.length > 0) {
      push("/settings?tab=exchange");
      localStorage.setItem("exchange", JSON.stringify(exchange[0]));
    }
  }, [exchange, push]);

  return (
    <Col className="relative w-full h-screen items-center justify-center">
      <Col className="gap-5 items-center justify-center z-40">
        <AddExchange
          onPressExchange={(data: any) => {
            setExchange(data);
          }}
        />
      </Col>
      <Image alt="" src={backgroundImage} width={4000} height={4000} className="w-full h-full absolute z-0" />
    </Col>
  );
};

export default NoConnectedExchangePage;

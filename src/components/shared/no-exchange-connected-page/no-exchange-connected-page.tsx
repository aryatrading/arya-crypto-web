import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Col } from "../layout/flex";
import AddExchange from "../../app/exchangeTab/AddExchange";

const NoConnectedExchangePage = ({ Component }: { Component?: any }) => {
  const { push } = useRouter();
  const [exchange, setExchange] = useState([]);

  useEffect(() => {
    if (exchange.length > 0) {
      push("/settings?tab=exchange");
      localStorage.setItem("exchange", JSON.stringify(exchange[0]));
    }
  }, [exchange, push]);

  return (
    <Col className="relative w-full h-screen items-center justify-center">
      <Col className="gap-5 items-center justify-center z-40 bg-black-2 px-14 rounded-lg pb-32">
        <AddExchange
          onPressExchange={(data: any) => {
            setExchange(data);
          }}
        />
      </Col>
      {Component &&
        <Col className="blur-md absolute w-full mb-32">
          <Component dummy />
        </Col>
      }
    </Col>
  );
};

export default NoConnectedExchangePage;

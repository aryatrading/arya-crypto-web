import { useTranslation } from "next-i18next";
import { Col, Row } from "../../shared/layout/flex";
import Button from "../../shared/buttons/button";
import PaymentModal from "../Subscription/PaymentCard/PaymentModal";
import {
  downloadInvoicePDF,
  getInvoices,
} from "../../../services/controllers/checkout";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { capitalize } from "lodash";
import { useResponsive } from "../../../context/responsive.context";
import { isPremiumUser } from "../../../services/redux/userSlice";
import { useSelector } from "react-redux";

const SubcriptionTab = () => {
  const { t } = useTranslation(["settings", "common"]);
  const [invoices, setInvoices] = useState([]);
  const isPremium = useSelector(isPremiumUser);
  const { isTabletOrMobileScreen } = useResponsive();

  const paymentModalTrigger = (
    <Button className="focus:outline-none text-white bg-orange-1 hover:bg-opacity-95 focus:ring-2 rounded-lg  px-5 py-4 w-fit">
      {t("subscribeToPro")}
    </Button>
  );

  useEffect(() => {
    getInvoices().then((invoices) => {
      let _invoices = invoices.filter((elm: any) =>
        elm.lines[0].price.product.name.toLowerCase().includes("crypto")
      );

      setInvoices(_invoices);
    });
  }, []);

  const features = [
    {
      icon: "assets/images/svg/settings/one-dashboard.svg",
      title: t("dashboardtitle"),
      subText: t("dashboardsubtitle"),
    },
    {
      icon: "assets/images/svg/settings/global-perspective.svg",
      title: t("globaltitle"),
      subText: t("globaldescription"),
    },
    {
      icon: "assets/images/svg/settings/quick-secure.svg",
      title: t("quicktitle"),
      subText: t("quickdescription"),
    },
  ];

  return (
    <Col className="gap-12 w-full">
      {!isPremium ? (
        <>
          <div className="flex flex-col lg:flex-row gap-8 w-full px-12 py-6 items-center bg-subscription bg-black-2 lg:bg-[url('/assets/images/settings-subscription.png')] bg-cover bg-center bg-no-repeat">
            <Image
              height={256}
              width={324}
              src={"/assets/images/svg/settings/trade-mockup.svg"}
              alt="trade-demo"
            />
            <div className="flex flex-col items-center lg:items-start gap-5">
              <div className="gap-2">
                <span className="font-semibold text-lg mt-6">
                  {"Subscribe to ARYA Crypto premium"}
                </span>
                <span className="font-medium text-base ">
                  {t("subscriptionHint")}
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-3 text-sm font-semibold">
                <PaymentModal triggerButton={paymentModalTrigger} />
                <Button className="px-1 hover:underline hover:underline-offset-2">
                  {" "}
                  {t("knowmore")}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-11 justify-center">
            <Image
              height={244}
              width={391}
              src={"/assets/images/svg/settings/exchange-spiral.svg"}
              alt="all-in-one"
            />
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-lg mt-6">
                {t("allinone")}
              </span>
              <span className="lg:font-medium text-base text-grey-1 ">
                {t("allinonedescription")}
              </span>
            </div>
          </div>
          {isTabletOrMobileScreen ? null : (
            <Row className=" gap-14">
              {features.map((feature) => {
                return (
                  <Col className="gap-5 items-center">
                    <Image
                      src={feature.icon}
                      width={68}
                      height={68}
                      alt="feature"
                    />
                    <span className="text-white font-semibold text-lg">
                      {feature.title}
                    </span>
                    <span className="text-grey-1 text-sm text-center">
                      {feature.subText}
                    </span>
                  </Col>
                );
              })}
            </Row>
          )}
        </>
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-center">
          <span className="font-bold text-lg text-base">{t("activesub")}</span>
          <Button
            onClick={() => console.log("/")}
            className="bg-orange-1 rounded w-44 h-10"
          >
            {t("cancel")}
          </Button>
        </div>
      )}
      <Col className="gap-4">
        <span> {t("subscriptionhistory")} </span>
        <table className="table-auto">
          <thead className="border-b border-grey-3 text-sm text-grey-1 font-normal">
            <th className="py-2 font-normal">{t("refrence")}</th>
            <th className="py-2 font-normal">{t("date")}</th>
            <th className="py-2 font-normal">{t("amount")}</th>
            <th className="py-2 font-normal">{t("reciept")}</th>
            <th className="py-2 font-normal">{t("status")}</th>
          </thead>
          <tbody>
            {invoices.map((invoice: any) => {
              return (
                <tr className="text-center">
                  <td className="py-2">{invoice?.id}</td>
                  <td className="py-2">
                    {moment(invoice?.created_at).format("DD/MM/YY")}
                  </td>
                  <td className="py-2">
                    {invoice.total / 100} {invoice.currency.toUpperCase()}
                  </td>
                  <td className="py-2">
                    {invoice.status === "paid" ? (
                      <Button
                        onClick={() => downloadInvoicePDF(invoice.id)}
                        className="text-blue-1"
                      >
                        {t("download")}
                      </Button>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="py-2">{capitalize(invoice.status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Col>
    </Col>
  );
};

export default SubcriptionTab;

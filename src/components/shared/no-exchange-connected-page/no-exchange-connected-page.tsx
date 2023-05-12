import Link from "next/link";
import { Col } from "../layout/flex";
import { CustomizeAllocationIcon } from "../../svg/smart-allocation/customize-portfolio-icon";
import { useTranslation } from "next-i18next";


const NoConnectedExchangePage = () => {

    const { t } = useTranslation(['common'])

    return (
        <Col className="w-full h-96 items-center justify-center">
            <Col className="gap-5 items-center justify-center">
                <CustomizeAllocationIcon />
                <p className="font-bold">{t("connectYourExchanges")}</p>
                <Link href="/settings" className="bg-blue-3 px-12 py-3 rounded-md">{t("goToSettings")}</Link>
            </Col>
        </Col>
    )
}

export default NoConnectedExchangePage;
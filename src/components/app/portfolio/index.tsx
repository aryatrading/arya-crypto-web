import { useAuthUser } from "next-firebase-auth";
import { FC } from "react";
import Dashboard from "../dashboard/dashboard";
import { Col } from "../../shared/layout/flex";

const Portfolio: FC = () => {

    const authUser = useAuthUser();

    if (authUser.id) {
        return <Dashboard />
    } else {
        return (
            <Col className="h-40 aspect-video bg-grey-1 items-center justify-center rounded-md">
                <p>Marketing page</p>
            </Col>
        );
    }

}

export default Portfolio;
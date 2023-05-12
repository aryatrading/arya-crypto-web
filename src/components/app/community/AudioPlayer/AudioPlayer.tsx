import { FC } from "react";
import styles from './index.module.scss'
import { Col, Row } from "../../../shared/layout/flex";
import Button from "../../../shared/buttons/button";
import clsx from "clsx";
import { playAudioIcon } from "../../../svg/playAudioIcon";
import { audioWave } from "../../../svg/audioWave";

const AudioDisplay: FC = () => {

    return (
        <Row className={clsx("w-full my-4 rounded-md", styles["audio-display-wrapper"])}>
            <Button className={clsx("flex justify-center items-center bg-grey-7", styles['record-btn'])}>
                {playAudioIcon}
            </Button>
            <Row className={clsx('w-full bg-grey-7', styles['audio-c'])}>
                <Col className={styles['audio-speed']}>
                    <h6 className="text-white text-sm mb-10">00:00</h6>
                </Col>
                <Col className="w-full">
                    {audioWave}
                </Col>
                <Col className={clsx(styles['audio-speed'], "items-center justify-center")}>
                    <h6 className="text-white">1x</h6>
                </Col>
            </Row>
        </Row>
    );
}


export default AudioDisplay;

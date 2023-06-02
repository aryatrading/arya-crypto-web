import clsx from "clsx";
import { Col, Row } from "../../shared/layout/flex";

import styles from './styles.module.scss';

interface AccordionCardTypes {
    index: number,
    setActiveIndex: (index: number) => void,
    activeIndex: number,
    isLastItem: boolean,
    item: {
        title: string,
        body: string,
        btnLabel?: string,
        btnAction?: () => void,
    },
    isActive: boolean
}

export const AccordionCard = ({ index, setActiveIndex, isActive, isLastItem, item }: AccordionCardTypes) => {
    return (

        <Col key={index} className='items-start bg-black-1'>
            <Row className="items-center gap-4" onClick={() => setActiveIndex(index)}>
                <Col className={clsx({ "bg-blue-1": isActive, "bg-grey-1": !isActive }, 'w-6 h-6 overflow-hidden rounded-md cursor-pointer shrink-0 z-10')} />
                <p className='font-medium text-white , text-lg cursor-pointer bg-black-1 overflow-hidden'>{item.title}</p>
            </Row>
            <Row className='gap-4'>
                <Col className={clsx('w-6 shrink-0 items-center justify-center relative')}>
                    {!isLastItem && <Col className="border-dashed border-l-2 border-white w-1 h-full absolute top-0" />}
                </Col>
                <Col className="gap-2">
                    <p className={clsx(styles.content, isActive && styles.contentExpanded)}>{item.body}</p>
                    {
                        item?.btnLabel && item?.btnAction && isActive ?
                            <button className={clsx(styles.actionBtn, "text-white font-bold text-sm")} onClick={item.btnAction}>
                                {item.btnLabel}
                            </button>
                            : null
                    }
                </Col>

            </Row>
        </Col>
    );
}
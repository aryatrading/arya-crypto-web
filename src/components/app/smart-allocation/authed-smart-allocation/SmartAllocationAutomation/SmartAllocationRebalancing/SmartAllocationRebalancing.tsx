import React, { FC } from 'react'
import { useTranslation } from 'next-i18next'

import { EnumReBalancingFrequency } from '../../../../../../utils/constants/smartAllocation'
import { Col, Row } from '../../../../../shared/layout/flex'
import BlackGreyButton from '../../../../../shared/buttons/black-grey-button'
import SwitchInput from '../../../../../shared/form/inputs/switch/switch'

type SmartAllocationRebalancingType = {
    reBalancingFrequency: EnumReBalancingFrequency | null,
    reBalancingDate: Date | null,
    setReBalancingFrequency: (newFrequency: EnumReBalancingFrequency | null) => void,
}

const SmartAllocationRebalancing: FC<SmartAllocationRebalancingType> = ({ reBalancingFrequency: rebalancingFrequency, reBalancingDate, setReBalancingFrequency }) => {

    const { t } = useTranslation(['smart-allocation', 'common'])

    return (
        <Col className='w-full items-start gap-7'>
            <Col className="w-full gap-10">
                <Row className="items-center gap-5">
                    <p className="font-bold">Rebalancing Frequency?</p>
                    <SwitchInput checked={!!rebalancingFrequency} onClick={() => {
                        if (rebalancingFrequency) {
                            setReBalancingFrequency(null)
                        } else {
                            setReBalancingFrequency(EnumReBalancingFrequency.Monthly)
                        }
                    }} />
                </Row>
                <p className="text-grey-1">Rebalancing a crypto portfolio means redistributing asset allocation to maintain the original or desired allocation or risk.</p>
            </Col>
            <Col className="gap-5 w-full">
                <p className="font-semibold">Choose a time frequency </p>
                <Row className="gap-5">
                    <BlackGreyButton isActive={!rebalancingFrequency} onClick={() => setReBalancingFrequency(null)}> None </BlackGreyButton>
                    <BlackGreyButton isActive={rebalancingFrequency === EnumReBalancingFrequency.Monthly} onClick={() => setReBalancingFrequency(EnumReBalancingFrequency.Monthly)}> {EnumReBalancingFrequency.Monthly} </BlackGreyButton>
                </Row>
                <Row className="gap-5">
                    <BlackGreyButton isActive={rebalancingFrequency === EnumReBalancingFrequency.Quarterly} onClick={() => setReBalancingFrequency(EnumReBalancingFrequency.Quarterly)}> {EnumReBalancingFrequency.Quarterly} </BlackGreyButton>
                    <BlackGreyButton isActive={rebalancingFrequency === EnumReBalancingFrequency.Yearly} onClick={() => setReBalancingFrequency(EnumReBalancingFrequency.Yearly)}> {EnumReBalancingFrequency.Yearly} </BlackGreyButton>
                </Row>
            </Col>
        </Col>
    )
}

export default SmartAllocationRebalancing;
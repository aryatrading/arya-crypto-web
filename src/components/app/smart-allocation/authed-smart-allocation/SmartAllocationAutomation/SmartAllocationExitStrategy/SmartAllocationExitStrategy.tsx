import React, { FC, useCallback, useMemo } from 'react'
import { Col, Row } from '../../../../../shared/layout/flex'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { EnumExitStrategyTrigger, EnumSmartAllocationAssetStatus } from '../../../../../../utils/constants/smartAllocation'
import ExitStrategyInput from './ExitStrategyInput'
import { SmartAllocationExitStrategyType } from '../../../../../../types/smart-allocation.types'
import { Trans, useTranslation } from 'next-i18next'
import SwitchInput from '../../../../../shared/form/inputs/switch/switch'
import { formatNumber, percentageFormat } from '../../../../../../utils/helpers/prices'



type SmartAllocationExitStrategyPropsType = {
    exitStrategy: SmartAllocationExitStrategyType | null,
    onChange: (newExitStrategy: SmartAllocationExitStrategyType | null) => void
}

const SmartAllocationExitStrategy: FC<SmartAllocationExitStrategyPropsType> = ({ exitStrategy, onChange }) => {

    const { t } = useTranslation(['smart-allocation', 'common'])


    const portfolioChange: number = useMemo(() => {
        if (exitStrategy) {
            const { exit_type, exit_value } = exitStrategy
            if (exit_type === EnumExitStrategyTrigger.RisesBy) {
                return (exit_value ?? 0) * 100;
            }
            else {
                return exit_value ?? 0;
            }
        } else {
            return 0;
        }
    }, [exitStrategy])


    const sellPortion: number = useMemo(() => {
        if (exitStrategy) {
            return (exitStrategy?.exit_percentage ?? 0) * 100
        } else {
            return 0;
        }
    }, [exitStrategy])

    const assetChangeType: EnumExitStrategyTrigger = useMemo(() => {
        if (exitStrategy) {
            return exitStrategy.exit_type ?? EnumExitStrategyTrigger.RisesBy;
        } else {
            return EnumExitStrategyTrigger.RisesBy;
        }
    }, [exitStrategy])

    const onExitStrategyChange = useCallback((portfolioChange: number, sellPortion: number, assetChangeType: EnumExitStrategyTrigger) => {
        const exit_value = assetChangeType === EnumExitStrategyTrigger.RisesBy ? portfolioChange / 100 : portfolioChange;
        const exit_percentage = sellPortion / 100;
        const exit_type = assetChangeType;
        if (exitStrategy) {
            onChange({ ...exitStrategy, exit_value, exit_percentage, exit_type });
        } else {
            onChange({ exit_value, exit_percentage, exit_type, status: EnumSmartAllocationAssetStatus.ACTIVE });
        }

    }, [exitStrategy, onChange]);


    const triggerMovement = useCallback(() => {
        return <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
                <button
                    className="px-6 py-3 inline-flex items-center justify-center text-blue-1 bg-black-2 rounded-md gap-0 w-full md:gap-6"
                >
                    <span className='w-full text-center md:text-left'>{t(assetChangeType)}</span>
                    <ChevronDownIcon className='w-5 h-5 text-grey-1 ml-auto md:m-auto' />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                className="w-[--radix-dropdown-menu-trigger-width] flex flex-col bg-black-2 rounded-md p-[5px]"
                align='start'
                sideOffset={2}
            >
                {
                    Object.values(EnumExitStrategyTrigger).map((trigger) => {
                        return <DropdownMenu.Item
                            className='text-left px-6 py-3 hover:text-blue-1'
                            key={trigger}
                            onSelect={() => {
                                onExitStrategyChange(0, sellPortion, trigger);
                            }}
                        >
                            {t(trigger)}
                        </DropdownMenu.Item>
                    })
                }
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    }, [assetChangeType, onExitStrategyChange, sellPortion, t])

    const triggerPercentage = useCallback(
        () => {
            return <Row className='bg-black-2 rounded-lg py-3 px-4 text-sm text-blue-1 w-full'>
                <ExitStrategyInput isPercentage={assetChangeType === EnumExitStrategyTrigger.RisesBy} value={portfolioChange} setValue={(value) => {
                    onExitStrategyChange(value, sellPortion, assetChangeType);
                }} />
            </Row>
        }
        ,
        [assetChangeType, onExitStrategyChange, portfolioChange, sellPortion],
    )

    const sellPercentage = useCallback(() => {
        return <Row className='bg-black-2 rounded-lg py-3 px-4 text-sm text-blue-1 w-full md:w-auto'>
            <ExitStrategyInput isPercentage={true} value={sellPortion} setValue={(value) => {
                onExitStrategyChange(portfolioChange, value, assetChangeType);
            }} />
        </Row>
    }, [assetChangeType, onExitStrategyChange, portfolioChange, sellPortion])

    return (
        <Col className='w-full items-start gap-7'>
            <Col className="w-full gap-10">
                <Row className="items-center gap-5">
                    <p className="font-bold">{t('common:exitStrategy')}</p>
                    <SwitchInput checked={!!exitStrategy} onClick={() => {
                        if (exitStrategy) {
                            onChange(null)
                        } else {
                            onChange({ exit_type: EnumExitStrategyTrigger.RisesBy, exit_value: 0, exit_percentage: 0 })
                        }
                    }} />
                </Row>
                {exitStrategy &&
                    <span className='text-grey-1 lg:whitespace-pre'>
                        <Trans i18nKey={'smart-allocation:haveExitStrategy'}
                            components={{ blueText: <span className='text-blue-1' /> }}
                            values={{
                                assetChangeType: t(assetChangeType),
                                assetChangeValue: assetChangeType === EnumExitStrategyTrigger.RisesBy ? `${percentageFormat(portfolioChange)}%` : `${formatNumber(portfolioChange)}$`,
                                assetSellPercentage: `${percentageFormat(sellPortion)}%`
                            }}
                        />
                    </span>}
                <p className="text-grey-1">
                    Set a contingency plan to sell a portion or all of your portfolio value when it hits a certain threshold for USDT.
                </p>
            </Col>
            {exitStrategy && <Col className='gap-5 font-semibold w-full'>
                <p className="font-bold">{t('common:exitStrategy')}</p>
                <Col className='gap-3 items-center px-1 w-full md:flex-row'>
                    <span className='w-full text-white text-center md:text-start'>{t('whenPortfolio')}</span>
                    {triggerMovement()}
                    {triggerPercentage()}
                    <span className='w-full text-white text-center'>{t('common:sell')}</span>
                    {sellPercentage()}
                </Col>
            </Col>}
        </Col>
    )
}

export default SmartAllocationExitStrategy
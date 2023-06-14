import React, { useState } from 'react'
import { Col, Row } from '../../../shared/layout/flex'
import _ from 'lodash'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { twMerge } from 'tailwind-merge'
import Switch from '../../../shared/Switch/Switch'
import Link from 'next/link'
import { EnumPricing } from '../../../../utils/constants/payment'
import { Trans, useTranslation } from 'react-i18next'


const PaymentCard = () => {

    const [yearlyPayment, setYearlyPayment] = useState(true)

    const onFrequencyChange = (checked:boolean)=>{
        setYearlyPayment(checked)
    }

    const {t} = useTranslation(['payment','common'])

    const benefits = [
        {
            name:t('common:takeProfit'),
            basic:true,
            premium:true
        },
        {
            name:t('common:trailing'),
            basic:true,
            premium:true
        },
        {
            name:t('common:stopLoss'),
            basic:true,
            premium:true
        },
        {
            name:t('exitStrategies'),
            basic:false,
            premium:true
        },
        {
            name:t('unlimitedTrades'),
            basic:false,
            premium:true
        },
        {
            name:t('common:autoRebalancing'),
            basic:false,
            premium:true
        },
        {
            name:t('customAllocation'),
            basic:false,
            premium:true
        },
        {
            name:t('customerSupport'),
            basic:false,
            premium:true
        }
    ]
    const checkIcon = (available:boolean) =>{
        return <CheckCircleIcon className={twMerge('w-[15px] h-[15px]',available?'stroke-current stroke-2 text-blue-1':'')}/>
    }
    

  return (
        <Col className='items-center w-full gap-6 h-full p-7'>
            <span className='font-semibold md:text-3xl text-2xl text-center'>
                {t('upgradeCryptoPremium')}  
            </span>
            <span className='text-center opacity-60'>
                {t('upgradeText')}
            </span>
            <Row className='gap-5 items-center'>
                <Switch beforeLabel='Monthly' afterLabel='Yearly'
                    checked={yearlyPayment}
                    onCheckedChange={onFrequencyChange}
                />
                <span className='py-1 px-4 rounded-md bg-yellow-1 font-semibold'>
                    {t('save50')}
                </span>
            </Row>
            <Col className='flex-col-reverse md:flex-row gap-11'>
                <Col className='rounded-xl border-2 border-grey-1 w-[300px] md:min-h-[300px]'>
                    <Row className='w-full gap-3 py-3 px-9 items-center border-b-2 border-grey-1 font-semibold h-[60px]'>
                        <span className='text-xl'>{t("basic")}</span>
                        <span className='py-1 px-4 bg-grey-1 rounded-md'>
                            {t('currentPlan')}
                        </span>
                    </Row>
                    <Col className='px-9 py-4 gap-6 justify-between h-full'>
                        <Col className='gap-3 font-semibold text-3xl md:min-h-[60px]'>
                            {t('FREE')}
                        </Col>
                        <Col className='gap-2 pb-10'>
                            {
                                benefits.map((benefit)=>{
                                    return <Row className={twMerge('gap-4 font-medium font-sm items-center',benefit.basic?'':'text-grey-1')} key={_.uniqueId()}>
                                        {checkIcon(benefit.basic)}
                                        <span>
                                            {benefit.name}
                                        </span>
                                    </Row>
                                })
                            }                        
                        </Col>
                    </Col>  
                </Col>
                <Col className='rounded-xl border-2 border-blue-1 w-[300px] md:min-h-[300px] relative'>
                    <Row className='w-full gap-3 py-3 px-9 items-center border-b-2 border-blue-1 font-semibold bg-blue-3 rounded-t-xl h-[60px]'>
                        <span className='text-xl'>{t('common:premium')}</span>
                        
                    </Row>
                    <Col className='px-9 py-4 gap-6 justify-between h-full'>
                        <Col className='gap-3 font-semibold min-h-[60px]'>
                            <Row className='items-center gap-1'>
                                <span className='text-3xl text-green-1'>{`€ ${yearlyPayment?'14.99':'19.99'}`}</span>
                                <span>{t('/mo')}</span>
                            </Row>
                            {yearlyPayment&&<span>
                                <Trans
                                    i18nKey={'payment:billedYear'}
                                    components={{ blueText: <span className='text-blue-1' /> }}
                                />
                            </span>}
                        </Col>
                        <Col className='gap-2 pb-10'>
                            {
                                benefits.map((benefit)=>{
                                    return <Row className='gap-4 font-medium font-sm items-center' key={_.uniqueId()}>
                                        {checkIcon(benefit.premium)}
                                        <span>
                                            {benefit.name}
                                        </span>
                                    </Row>
                                })
                            }                        
                        </Col>
                    </Col> 
                    <Link 
                        className='font-semibold py-4 px-8 bg-blue-1 absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-[50%] w-auto rounded-lg whitespace-nowrap'
                        href={{
                            pathname:'/checkout',
                            query:{payment:yearlyPayment?EnumPricing.yearly:EnumPricing.monthly}
                        }}
                    >
                        {t('upgradeToPremium')}
                    </Link>
                </Col>
            </Col>
            <span className='text-center opacity-60 py-6'>
                {t('common:yourSubscriptionWillRenewAutomatically')}
            </span>
        </Col>
  )
}

export default PaymentCard
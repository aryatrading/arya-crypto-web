import React, { useState } from 'react'
import { Col, Row } from '../../../shared/layout/flex'
import Image from 'next/image'
import _ from 'lodash'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { twMerge } from 'tailwind-merge'
import Switch from '../../../shared/Switch/Switch'
import Link from 'next/link'
import { EnumPricing } from '../../../../utils/constants/payment'

const PaymentCard = () => {

    const [yearlyPayment, setYearlyPayment] = useState(true)

    const onFrequencyChange = (checked:boolean)=>{
        setYearlyPayment(checked)
    }

    const benefits = [
        {
            name:'Take profits',
            basic:true,
            premium:true
        },
        {
            name:'Trailing',
            basic:true,
            premium:true
        },
        {
            name:'Stop Loss',
            basic:true,
            premium:true
        },
        {
            name:'Exit Strategies',
            basic:false,
            premium:true
        },
        {
            name:'Unlimited trades',
            basic:false,
            premium:true
        },
        {
            name:'Auto rebalancing',
            basic:false,
            premium:true
        },
        {
            name:'Custom allocation',
            basic:false,
            premium:true
        },
        {
            name:'Customer Support',
            basic:false,
            premium:true
        }
    ]
    const checkIcon = (available:boolean) =>{
        return <CheckCircleIcon className={twMerge('w-[15px] h-[15px]',available?'stroke-current stroke-2 text-blue-1':'')}/>
    }
  return (
    <Col className='items-center gap-2'>
        <Image width={315} height={245} src='/assets/images/publicPages/pricing/1.png' alt='pricing-header-image'/>
        <Col className='items-center gap-6'>
            <span className='font-semibold md:text-3xl text-2xl text-center'>
                Upgrade to Arya Crypto Premium  
            </span>
            <span className='text-center opacity-60'>
            Unlock the full potential of ARYA Crypto with our cutting-edge tools Designed for both novice and experienced crypto enthusiasts,  to help you navigate the dynamic world of digital assets with confidence and ease.
            </span>
            <Row className='gap-5 items-center'>
                <Switch beforeLabel='Monthly' afterLabel='Yearly'
                    checked={yearlyPayment}
                    onCheckedChange={onFrequencyChange}
                />
                <span className='py-1 px-4 rounded-md bg-yellow-1 font-semibold'>
                    Save 50%
                </span>
            </Row>
            <Col className='flex-col-reverse md:flex-row gap-11'>
                <Col className='rounded-xl border-2 border-grey-1 w-[300px] min-h-[500px]'>
                    <Row className='w-full gap-3 py-3 px-9 items-center border-b-2 border-grey-1 font-semibold h-[60px]'>
                        <span className='text-xl'>Basic</span>
                        <span className='py-1 px-4 bg-grey-1 rounded-md'>
                            Current plan
                        </span>
                    </Row>
                    <Col className='px-9 py-4 gap-6 justify-between h-full'>
                        <Col className='gap-3 font-semibold text-3xl min-h-[60px]'>
                            FREE
                        </Col>
                        <Col className='gap-6 pb-10'>
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
                <Col className='rounded-xl border-2 border-blue-1 w-[300px] min-h-[500px] relative'>
                    <Row className='w-full gap-3 py-3 px-9 items-center border-b-2 border-blue-1 font-semibold bg-blue-3 rounded-t-xl h-[60px]'>
                        <span className='text-xl'>Premium</span>
                        
                    </Row>
                    <Col className='px-9 py-4 gap-6 justify-between h-full'>
                        <Col className='gap-3 font-semibold min-h-[60px]'>
                            <Row className='items-center gap-1'>
                                <span className='text-3xl text-green-1'>{`$ ${yearlyPayment?'14.99':'19.99'}`}</span>
                                <span>/mo</span>
                            </Row>
                            {yearlyPayment&&<span>
                                Billed <span className='text-blue-1'>$144.99</span> per year
                            </span>}
                        </Col>
                        <Col className='gap-6 pb-10'>
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
                        Upgrade to Premium
                    </Link>
                </Col>
            </Col>
            <span className='text-center opacity-60 pt-6'>
                Your subscription will renew automatically unless it is cancelled at least 24 hours before the end of the current period <br></br> by upgrading your account, you agree to the Terms of Use & Privacy Policy.
            </span>
        </Col>
    </Col>
  )
}

export default PaymentCard
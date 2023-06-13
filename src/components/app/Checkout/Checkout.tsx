import React, { useEffect, useState } from 'react'
import { Col, Row } from '../../shared/layout/flex'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Input from '../../shared/inputs/Input'
import { useSearchParams } from 'next/navigation'
import Button from '../../shared/buttons/button'
import { EnumPricing } from '../../../utils/constants/payment'
import { useFormik } from 'formik'
import { MODE_DEBUG } from '../../../utils/constants/config'
import Lottie from 'lottie-react'
import paymentSpinner from './payment-spinner.json'
import { getCheckoutDetails } from '../../../services/controllers/checkout'
import { Price, Subscription } from '../../../types/checkout.types'
import { AxiosResponse } from 'axios'
 

const Checkout = () => {
    const searchParams = useSearchParams()
    const paymentFrequency:any = searchParams.get('payment')
    const elements = useElements()
    const stripe = useStripe();

    const [loading, setLoading] = useState<boolean>(false)
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
    const [paymentFailed, setPaymentFailed] = useState<boolean>(false)

    const [monthlyPriceId, setMonthlyPriceId] = useState<string|null>(null)
    const [yearlyPriceId, setYearlyPriceId] = useState<string|null>(null)

    const fetchPriceData = ()=>{
        getCheckoutDetails().then((res:AxiosResponse<Subscription>)=>{
            const {data} = res
            const {prices} = data

            prices.forEach((priceSingle)=>{
                if(priceSingle.price.recurring === 'month'){
                    setMonthlyPriceId(priceSingle.price.stripe_id)
                }
                if(priceSingle.price.recurring === 'year'){
                    setYearlyPriceId(priceSingle.price.stripe_id)
                }
            })

        })
    }

    const formik = useFormik({
        initialValues:{
            name:''
        },
        onSubmit: async (values) =>{
            setLoading(true)
            if(!stripe||!elements){
                return
            }
            // Trigger form validation and wallet collection
            const {error: submitError} = await elements.submit();
            if(submitError){
                return
            }
            await stripe?.createPaymentMethod({
                elements,
                params:{
                    billing_details:{
                        name: values.name
                    }
                }
            })
            .then((result)=>{
                if (result.paymentMethod){
                    if(MODE_DEBUG){
                        console.log(result.paymentMethod)
                    }
                    const {id} = result.paymentMethod
                    return id
                }
                if(result.error){
                    if(MODE_DEBUG){
                        console.log('[createPaymentMethod error]', result.error)
                    }
                    throw(result.error)
                }
            })
            .then((paymentID)=>{
                
            })
        }
    })

    useEffect(()=>{
        fetchPriceData()
    })

  return (
    <Col className='lg:w-[1320px] gap-6 lg:gap-3 p-[2rem] lg:p-0'>
        <Row className='gap-4'>
            <ArrowLongLeftIcon className='w-[18px]'/>
            <span>Go back</span>
        </Row>
        <Col className='lg:bg-black-2 lg:py-14 lg:px-40 min-h-[650px]'>
            {
                loading?
                <Col className=' justify-center items-center w-full lg:h-[500px]'>
                    <span className='text-3xl font-semibold'>Processing payment</span>
                    <Lottie
                        animationData={paymentSpinner}
                        className='scale-50'
                    />
                </Col>:
                paymentSuccess?
                <Col className=' justify-center items-center w-full lg:h-[500px] gap-11'>
                    <Col className='gap-4 text-center'>
                        <span className='text-3xl font-semibold'>Payment Success!</span>
                        <span className='text-white opacity-60 text-base font-medium'>Thank you, you are now subscribed to ARYA Premium</span>
                    </Col>
                    <Image width={256} height={157}  alt='payment-success' src='/assets/images/svg/success.svg'/>
                    <Button className='py-4 px-8 bg-blue-1 font-semibold text-base rounded-lg'>Back to ARYA Crypto</Button>
                </Col>:
                paymentFailed?
                <Col className=' justify-center items-center w-full lg:h-[500px] gap-11'>
                    <Col className='gap-4 text-center'>
                        <span className='text-3xl font-semibold'>Payment Failed!</span>
                        <span className='text-white opacity-60 text-base font-medium'>Try again, or change card payment details. </span>
                    </Col>
                    <Image width={156} height={157}  alt='payment-success' src='/assets/images/svg/failed.svg'/>
                    <Button className='py-4 px-8 bg-blue-1 font-semibold text-base rounded-lg'>Try Again</Button>
                </Col>
                :<Col className='w-full h-full items-center gap-6 lg:gap-24'>
                    <span className='text-3xl font-semibold w-full md:w-auto'>Checkout</span>
                    <form onSubmit={formik.handleSubmit} className='flex flex-col lg:flex-row w-full gap-16'>
                        <Col className='lg:w-1/2 gap-9 w-full'>
                            <Row className='w-full justify-between items-center pb-4 border-b border-grey-1'>
                                <span className='font-semibold'>
                                    Payment details
                                </span>
                                <Image width={120} height={30} src='/assets/images/svg/poweredByStripe.svg' alt='stripe-badge'/>
                            </Row>
                            <Col className=' gap-3'>
                                <Col>
                                    <label htmlFor="name">Name</label>
                                    <Input value={formik.values.name} onChange={formik.handleChange} id='name' className='bg-grey-3 p-4 rounded-md text-base placeholder:text-[#ACACAC]' placeholder='Alice'/>
                                </Col>
                                <PaymentElement/>
                            </Col>
                        </Col>
                        <Col className='gap-14 lg:w-1/2 font-semibold w-full'>
                            <span className='text-2xl'>ARYA Crypto Premium</span>
                            <Col className='w-full gap-4'>
                                <Row className='w-full justify-between pb-10 border-b-2 border-grey-1'>
                                    <span className=' text-lg'>
                                        {paymentFrequency===EnumPricing.yearly?'Yearly Subscription':'Monthly Subscription'}
                                    </span>
                                    <Col className=' text-base text-right'>
                                        <span>{paymentFrequency===EnumPricing.yearly?'$144.99':'19.99'}</span>
                                        {paymentFrequency===EnumPricing.yearly&&<span>Billed yearly</span>}
                                    </Col>
                                </Row>
                                <Row className='justify-between'>
                                    <span>Total</span>
                                    <span>{paymentFrequency===EnumPricing.yearly?'$144.99':'19.99'}</span>
                                </Row>
                                <Button type='submit' className='bg-green-1 rounded py-5 w-full'>
                                    Pay USD 144.99
                                </Button>
                                <span className='text-[#ACACAC] text-sm font-normal'>
                                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                                </span>
                            </Col>
                        </Col>
                    </form>
                </Col>
            }
        </Col>
    </Col>
  )
}

export default Checkout
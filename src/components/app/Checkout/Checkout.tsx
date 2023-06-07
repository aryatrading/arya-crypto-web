import React, { useCallback, useState } from 'react'
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
 

const Checkout = () => {
    const searchParams = useSearchParams()
    const paymentFrequency:any = searchParams.get('payment')
    const elements = useElements()
    const stripe = useStripe();

    const [loading, setLoading] = useState(true)


    const formik = useFormik({
        initialValues:{
            name:''
        },
        onSubmit: async (values) =>{
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
                }
                if(result.error){
                    console.log('[createPaymentMethod error]', result.error)
                    throw(result.error)
                }
            })
        }
    })



  return (
    <Col className='w-[1320px] gap-3'>
        <Row className='gap-4'>
            <ArrowLongLeftIcon className='w-[18px]'/>
            <span>Go back</span>
        </Row>
        <Col className='bg-black-2 py-14 px-40 items-center gap-24 min-h-[650px]'>
            {
                loading?
                <Col className=' justify-center items-center w-full h-[500px]'>
                    <span className='text-3xl font-semibold'>Processing payment</span>

                </Col>:
                <Col className='w-full h-full'>
                    <span className='text-3xl font-semibold'>Checkout</span>
                    <form onSubmit={formik.handleSubmit} className='flex w-full gap-16'>
                        <Col className='w-1/2 gap-9'>
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
                        <Col className='gap-14 w-1/2 font-semibold'>
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
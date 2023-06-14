import React, { useCallback, useEffect, useState } from 'react'
import { Col, Row } from '../../shared/layout/flex'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Input from '../../shared/inputs/Input'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '../../shared/buttons/button'
import { EnumPricing } from '../../../utils/constants/payment'
import { useFormik } from 'formik'
import { MODE_DEBUG } from '../../../utils/constants/config'
import { createSubscription, getCheckoutDetails } from '../../../services/controllers/checkout'
import { Subscription } from '../../../types/checkout.types'
import { AxiosResponse } from 'axios'
import { getPaymentIntent } from '../../../utils/helpers/checkout'
import ProcessingSpinner from '../../shared/ProcessingSpinner/ProcessingSpinner'
import { getUserData } from '../../../services/controllers/user'
import { useTranslation } from 'react-i18next'
 

const Checkout = () => {
    const searchParams = useSearchParams()
    const paymentFrequency:any = searchParams.get('payment')
    const elements = useElements()
    const stripe = useStripe();
    const router = useRouter();
    const {t} = useTranslation(['payment','common'])

    const [loading, setLoading] = useState<boolean>(false)
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
    const [paymentFailed, setPaymentFailed] = useState<boolean>(false)
    const [checkoutId,setCheckoutId] = useState<number>()

    const [priceId, setPriceId] = useState<string|null>(null)
    const [paymentError, setPaymentError] = useState<string>('Try again, or change card payment details.')


    const resetPayment = () =>{
        formik.resetForm()
        setPaymentSuccess(false)
        setPaymentFailed(false)
        setLoading(false)
    }

    const fetchPriceData = useCallback(
        ()=>{
            getCheckoutDetails().then((res:AxiosResponse<Subscription>)=>{
                const {data} = res
                const {prices} = data
                setCheckoutId(data.id)
                prices.forEach((priceSingle)=>{
                    if(priceSingle.price.recurring === 'month'&&paymentFrequency===EnumPricing.monthly){
                        setPriceId(priceSingle.price.stripe_id)
                    }
                    else if(priceSingle.price.recurring === 'year'&&paymentFrequency === EnumPricing.yearly){
                        setPriceId(priceSingle.price.stripe_id)
                    }
                })
            })
        },
      [paymentFrequency],
    )

    const handlePaymentThatRequiresCustomerAction = async ({
        subscription,
        invoice,
        priceId,
        paymentMethodId,
        isRetry,
      }:any) => {
        if (subscription && subscription.status === "active") {
          // subscription is active, no customer actions required.
          return { subscription, priceId, paymentMethodId };
        }
      
        // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
        // If it's a retry, the payment intent will be on the invoice itself.
        const paymentIntent = invoice
          ? invoice.payment_intent
          : getPaymentIntent(subscription);
      
        if (
          paymentIntent &&
          (paymentIntent.status === "requires_action" ||
            paymentIntent.status === "requires_confirmation" ||
            (isRetry === true && paymentIntent.status === "requires_payment_method"))
        ) {
          return stripe?.confirmCardPayment(paymentIntent.client_secret, {
              payment_method: paymentMethodId,
              setup_future_usage: "off_session",
            })
            .then((result) => {
              if (result.error) {
                // start code flow to handle updating the payment details
                // Display error message in your UI.
                // The card was declined (i.e. insufficient funds, card has expired, etc)
                throw result;
              } else {
                if (
                  result.paymentIntent.status === "succeeded"
                ) {
                  // There's a risk of the customer closing the window before callback
                  // execution. To handle this case, set up a webhook endpoint and
                  // listen to invoice.payment_succeeded. This webhook endpoint
                  // returns an Invoice.
                  return {
                    priceId: priceId,
                    subscription: subscription,
                    invoice: invoice,
                    paymentMethodId: paymentMethodId,
                  };
                }
              }
            });
        } else {
          // No customer action needed
          return { subscription, priceId, paymentMethodId };
        }
    };
    
    const handleRequiresPaymentMethod = ({ subscription, paymentMethodId, priceId, invoice }:any) => {

        if ((subscription && subscription.status === 'active') || invoice) {
          // subscription is active, no customer actions required.
          return { subscription, priceId, paymentMethodId }
        } else if (
          subscription &&
          subscription.latest_invoice.payment_intent.status === 'requires_payment_method'
        ) {
          throw new Error('Your card was declined.')
        } else {
          return { subscription, priceId, paymentMethodId }
        }
    }

    const onSubscriptionComplete = (result:any) => {
        // Payment was successful. Provision access to your service.
        if (result) {
            getUserData()
            setPaymentSuccess(true)
        }
      }
    
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
            setLoading(true)
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
            .then((paymentId)=>{
                if(!checkoutId || !priceId || !paymentId){
                    if(MODE_DEBUG){
                        console.log(`create subscription parmeters missing! checkoutId:${checkoutId} priceId:${priceId} paymentID:${paymentId} is falsy`)
                    }
                    return
                }
                return createSubscription(checkoutId,priceId,paymentId).then((res)=>{
                    const {data} = res
                    if(MODE_DEBUG){
                        console.log(data)
                    }
                    if(data){
                        let object:any = {
                            // Use the Stripe 'object' property on the
                            // returned result to understand what object is returned.
                            paymentMethodId: paymentId,
                            priceId: priceId,
                        }
                        if (data.object === 'invoice') {
                            object.invoice = data
                        } else {
                            object.subscription = data
                        }
                        return object
                    }
                })
            })
            // Some payment methods require a customer to do additional
            // authentication with their financial institution.
            // Eg: 2FA for cards.
            .then(handlePaymentThatRequiresCustomerAction)
            // If attaching this card to a Customer object succeeds,
            // but attempts to charge the customer fail. You will
            // get a requires_payment_method error.
            .then(handleRequiresPaymentMethod)
            // No more actions required. Provision your service for the user.
            .then(onSubscriptionComplete)
            .catch((error)=>{
                if(MODE_DEBUG){
                    console.error(error)
                }
                if(error.type === 'card_error'){
                    if(error.decline_code ==='card_not_supported'){
                        setPaymentError('Your card is not supported. Please use a different card')
                    }
                }
                setPaymentFailed(true)
            })
            .finally(()=>{
                setLoading(false)
            })
        }
    })

    useEffect(()=>{
        fetchPriceData()
    },[fetchPriceData])


  return (
    <Col className='lg:w-[1320px] gap-6 lg:gap-3 p-[2rem] lg:p-0'>
        <Button onClick={()=>router.back()} className='flex gap-4'>
            <ArrowLongLeftIcon className='w-[18px]'/>
            <span>{t('return')}</span>
        </Button>
        <Col className='lg:bg-black-2 lg:py-14 lg:px-40 min-h-[650px]'>
            {
                paymentSuccess?
                <Col className=' justify-center items-center w-full lg:h-[500px] gap-11'>
                    <Col className='gap-4 text-center'>
                        <span className='text-3xl font-semibold'>{t('paymentSuccess')}</span>
                        <span className='text-white opacity-60 text-base font-medium'>{t('thankYou')}</span>
                    </Col>
                    <Image width={256} height={157}  alt='payment-success' src='/assets/images/svg/success.svg'/>
                    <Button onClick={()=>(router.back())} className='py-4 px-8 bg-blue-1 font-semibold text-base rounded-lg'>{t('goBack')}</Button>
                </Col>:
                paymentFailed?
                <Col className=' justify-center items-center w-full lg:h-[500px] gap-11'>
                    <Col className='gap-4 text-center'>
                        <span className='text-3xl font-semibold'>{t('paymentFailed')}</span>
                        <span className='text-white opacity-60 text-base font-medium'>{paymentError}</span>
                    </Col>
                    <Image width={156} height={157}  alt='payment-success' src='/assets/images/svg/failed.svg'/>
                    <Button onClick={resetPayment} className='py-4 px-8 bg-blue-1 font-semibold text-base rounded-lg'>{t('tryAgain')}</Button>
                </Col>
                :<Col className='w-full h-full items-center gap-6 lg:gap-24'>
                    <span className='text-3xl font-semibold w-full md:w-auto'>{t('checkout')}</span>
                    <form onSubmit={formik.handleSubmit} className='flex flex-col lg:flex-row w-full gap-16'>
                        <Col className='lg:w-1/2 gap-9 w-full'>
                            <Row className='w-full justify-between items-center pb-4 border-b border-grey-1'>
                                <span className='font-semibold'>
                                    {t('paymentDetails')}
                                </span>
                                <Image width={120} height={30} className='w-auto h-auto' src='/assets/images/svg/poweredByStripe.svg' alt='stripe-badge'/>
                            </Row>
                            <Col className=' gap-3'>
                                <Col>
                                    <label htmlFor="name">{t('common:name')}</label>
                                    <Input value={formik.values.name} onChange={formik.handleChange} id='name' className='bg-grey-3 p-4 rounded-md text-base placeholder:text-[#ACACAC]' placeholder='Alice'/>
                                </Col>
                                <PaymentElement/>
                            </Col>
                        </Col>
                        <Col className='gap-14 lg:w-1/2 font-semibold w-full'>
                            <span className='text-2xl'>{t('aryaPremium')}</span>
                            <Col className='w-full gap-4'>
                                <Row className='w-full justify-between pb-10 border-b-2 border-grey-1'>
                                    <span className=' text-lg'>
                                        {paymentFrequency===EnumPricing.yearly?'Yearly Subscription':'Monthly Subscription'}
                                    </span>
                                    <Col className=' text-base text-right'>
                                        <span>{paymentFrequency===EnumPricing.yearly?'€179.88':'€19.99'}</span>
                                        {paymentFrequency===EnumPricing.yearly&&<span>{t('billedYearly')}</span>}
                                    </Col>
                                </Row>
                                <Row className='justify-between'>
                                    <span>{t('common:total')}</span>
                                    <span>{paymentFrequency===EnumPricing.yearly?'€179.99':'€19.99'}</span>
                                </Row>
                                <Button disabled={loading} type='submit' className='bg-green-1 rounded w-full h-14 flex justify-center items-center'>
                                    {loading?<ProcessingSpinner/>:`Pay €${paymentFrequency===EnumPricing.yearly ?'179.88':'19.99'}`}
                                </Button>
                                <span className='text-[#ACACAC] text-sm font-normal'>
                                    {t('privacyWarning')}
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
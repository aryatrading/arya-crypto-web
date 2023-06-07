import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import Checkout from '../../components/app/Checkout/Checkout'
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { EnumPricing } from '../../utils/constants/payment'
import { ParsedUrlQuery } from 'querystring'


const stagingStripeKey = 'pk_test_51KeZjcDpPbc5wxXxoMkbMxRdxj0OQjvrjRaHzEBQG2undYldkQP5St0En0W3BdsCn8bB0uKXDqcY5f2UFG175fYB00Z1zSwc3R'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY||stagingStripeKey)



const CheckoutPage = () => {
    const options:StripeElementsOptions = {
        mode: 'subscription',
        amount: 1099,
        currency: 'eur',
        locale:'auto',
        fonts:[
            {
                cssSrc:'https://fonts.googleapis.com/css?family=Poppins:400,500,600'
            }
        ],
        appearance: {
            theme:'flat',
            variables: {
                colorBackground: '#1F2A41',
                colorText: '#F9FAFB',
                borderRadius: '4px',
                fontFamily:'Poppins,sans-serif',
                colorTextPlaceholder:'#ACACAC'
                
            }
        },
        paymentMethodCreation:'manual'
      };
    
  return (
    <Elements stripe={stripePromise} options={options} >
        <div className='w-full h-screen flex justify-center items-center'>
            <Checkout/>
        </div>
    </Elements>
  )
}

export default CheckoutPage

interface ICheckoutPageQuery extends ParsedUrlQuery{
    payment:EnumPricing
}

export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
    const query = ctx.query as ICheckoutPageQuery

    if (query.payment !== EnumPricing.monthly && query.payment!==EnumPricing.yearly) {
        return {
          notFound: true,
        };
      }
    
    return {
        props: {
            ...(await serverSideTranslations(ctx.locale ?? 'en')),
        }
    }
}
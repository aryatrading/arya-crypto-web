import { GetStaticProps } from 'next';
import { withAuthUser } from 'next-firebase-auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import Layout from '../../components/layout/layout';
import PaymentCard from '../../components/app/Subscription/PaymentCard/PaymentCard';

const PricingPage = () => {
  return (
    <Layout>
        <PaymentCard/>
    </Layout>
  )
}

export default withAuthUser()(PricingPage);

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? "en")),
    },
});
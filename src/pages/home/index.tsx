import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/solid';
import { withAuthUser } from 'next-firebase-auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import clsx from 'clsx';

import Layout from '../../components/layout/layout'
import { Col, Row } from '../../components/shared/layout/flex';
import Button from '../../components/shared/buttons/button';
import { AccordionCard } from '../../components/app/home/accordionCard';
import AssetRow from '../../components/shared/AssetRow/AssetRow';
import useAssetSearch from '../../common/hooks/useAssetSearch';
import { formatNumber } from '../../utils/helpers/prices';
import { useResponsive } from '../../context/responsive.context';

import styles from './index.module.scss';

const RowItem = ({ content }: any) => {
    return (
        <Row className='gap-4 items-center'>
            <Col className='w-5 h-5 rounded-md bg-blue-1 justify-center items-center'>
                <CheckIcon className='w-3 h-3 fill-white stroke-white' />
            </Col>

            <p className='font-medium text-base text-white'>{content}</p>
        </Row>
    );
}

const SmartAllocationImg = ({ activeIndex }: any) => (
    <Col className={clsx('w-full h-full justify-center items-center absolute', activeIndex !== 0 ? styles.fadeOut : styles.fadeIn)}>
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/smart-allocation/smartallocation.png')} className='w-1/2 -mt-10 md:-mt-20 z-20 self-center md:self-end -me-20 md:me-10' />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/smart-allocation/coinsCircle.png')} className={clsx(styles.rotate, 'w-1/2 absolute left-10 md:left-24 -top-6')} />
    </Col>
)
const PortfolioImg = ({ activeIndex }: any) => (
    <Col className={clsx({ "opacity-1": activeIndex !== 1 }, 'flex-1 w-full h-full justify-center items-center absolute', activeIndex !== 1 ? styles.fadeOut : styles.fadeIn)}>
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/portfolio.png')} className='w-1/2 -mt-10 sm:-mt-20 z-20 self-center md:self-end -me-40 md:me-10' />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/1.png')} className={clsx(styles['animation-1'], 'absolute left-[42%] md:left-[40%] -top-[6%] w-[7%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/2.png')} className={clsx(styles['animation-2'], 'absolute left-[24%] top-[8%] w-[5.5%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/3.png')} className={clsx(styles['animation-3'], 'absolute left-[10%] top-[14%] w-[7%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/4.png')} className={clsx(styles['animation-4'], 'absolute left-[24%] top-[26%] w-[9%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/5.png')} className={clsx(styles['animation-3'], 'absolute left-[42%] top-[38%] w-[7%] z-30')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/6.png')} className={clsx(styles['animation-1'], 'absolute left-[8%] top-[40%] w-[5%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/7.png')} className={clsx(styles['animation-4'], 'absolute left-[24%] top-[60%] w-[7%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/8.png')} className={clsx(styles['animation-1'], 'absolute left-[42%] top-[70%] w-[10%] z-30')} />
    </Col>
)

const TradingImg = ({ activeIndex }: any) => (
    <Col className={clsx({ "opacity-0": activeIndex !== 2 }, 'flex-1 w-full h-full relative justify-center items-center', activeIndex !== 2 ? styles.fadeOut : styles.fadeIn)}>
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/trading.png')} className='w-1/2 -mt-10 md:-mt-20 z-20 self-center md:self-end -me-40 md:me-10' />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/1.png')} className={clsx(styles['animation-1'], 'absolute left-[30%] -top-[10%] w-[21%] z-30')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/2.png')} className={clsx(styles['animation-2'], 'absolute left-[12%] -top-[4%] w-[14%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/3.png')} className={clsx(styles['animation-3'], 'absolute left-[12%] top-[28%] w-[18%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/4.png')} className={clsx(styles['animation-4'], 'absolute left-[29%] top-[36%] w-[16%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/5.png')} className={clsx(styles['animation-3'], 'absolute left-[8%] top-[44%] w-[16%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/6.png')} className={clsx(styles['animation-1'], 'absolute left-[12%] top-[60%] w-[18%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/7.png')} className={clsx(styles['animation-4'], 'absolute left-[38%] top-[78%] w-[12%] z-30')} />
    </Col>
)

const HomePage = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const { filteredAssets, setSearchTerm } = useAssetSearch({ fullModal: true });
    const { isTabletOrMobileScreen } = useResponsive();


    useEffect(() => {
        setSearchTerm('');
    }, [setSearchTerm]);

    return (
        <Layout>
            <Row className='items-center justify-center gap-10 flex-col-reverse lg:flex-row -mt-20 md:-mt-40'>
                <Col className='flex-1 w-full h-full gap-4'>
                    <p className='top-0 left-0 text-left w-full text-2xl font-bold md:leading-snug md:text-5xl'>Your Crypto control tower: Navigation
                        <span className={clsx(styles.underlined, "text-blue-1")}> moon-bound</span>
                        flights.</p>

                    <p className='font-medium text-base'>
                        Connect all your wallets and exchanges in a few clicks. Start effectively managing and automating your entire portfolio directly from Arya crypto. Tract, buy trade, and earn on your digital assets from a unified dashboard.
                    </p>

                    <Col className='gap-4'>
                        {['Automate your digital assets allocation', 'Automate your digital assets allocation', 'Automate your digital assets allocation'].map(e => {
                            return (
                                <RowItem content={e} />
                            );
                        })}
                    </Col>

                    <Button className={clsx('h-[44px] bg-blue-1 rounded-lg max-w-[220px] font-bold mt-4 mb-10', styles.boxShadow)}>
                        <p>Connect Portfolio Now</p>
                    </Button>
                </Col>

                <Col className={'flex-1 w-full h-full relative justify-center items-center'}>
                    <Image alt='' src={require('../../../public/assets/images/publicPages/home/homeMailImg.png')} className={clsx(styles.animateImg, 'w-full absolute')} />
                    <Image alt='' src={require('../../../public/assets/images/publicPages/home/homeMailImg.png')} className='w-full opacity-0' />
                </Col>
            </Row>

            <Row className={clsx(styles.stats, "w-full min-h-[120px] flex-col md:mt-0 md:flex-row items-center py-10 md:py-0 gap-10 md:gap-0 px-4 self-center")}>
                <p className='flex-1 text-center text-2xl font-bold'>Stats Speak for Themselves</p>
                <Col className='flex-1 items-center justify-center gap-2'>
                    <p className='text-white text-4xl font-bold'>00 %</p>
                    <p className='font-light text-sm'>User satisfaction</p>
                </Col>
                <Col className='flex-1 items-center justify-center gap-2'>
                    <p className='text-white text-4xl font-bold'>0M+</p>
                    <p className='font-light text-sm'>Cool Number</p>
                </Col>
                <Col className='flex-1 items-center justify-center gap-2'>
                    <p className='text-white text-4xl font-bold'>0.0</p>
                    <p className='font-light text-sm'>Google Review</p>
                </Col>
                <Col className='flex-1 items-center justify-center gap-2'>
                    <p className='text-white text-4xl font-bold'>00+</p>
                    <p className='font-light text-sm'>API integration</p>
                </Col>
            </Row>

            <Row className=' flex-col lg:flex-row mt-32 h-[450px]'>
                <Col className='flex-1 relative justify-center items-center'>
                    <SmartAllocationImg activeIndex={activeIndex} />
                    <PortfolioImg activeIndex={activeIndex} />
                    <TradingImg activeIndex={activeIndex} />
                </Col>

                <Col className='flex-1 w-full h-full gap-4 relative'>
                    <Col className='gap-1'>
                        <p className='font-bold text-3xl text-white'>Lorem ipsum:</p>
                        <p className='font-light text-base text-white'>Lorem Ipsum Dolor sit amet</p>
                    </Col>

                    <Col className='relative h-full overflow-hidden bg-black-1'>
                        {[{ title: "Smart Allocation", body: "A powerful product that lets anyone automate crypto accumulation and grow passive income as an added bonus. Smart Allocation requires little to no daily effort to maintain, making them suitable for busy people who are thinking about adding a new passive income." },
                        { title: "Portfolio Connect", body: "Securely Connect and manage your crypto portfolios and wallets in one place.", btnLabel: "Connect Now", btnAction: () => alert('x') },
                        { title: "Advance Trading", body: "ARYA integrates many risk management features including: 5 take profits, stop loss, trailing modes, optimization of entry and exit points", btnLabel: "Learn More", btnAction: () => alert('learn more') }].map((item, index, arr) => {
                            const isActive = index === activeIndex;
                            const isLastItem = index === arr.length - 1;
                            return (
                                <AccordionCard key={index} isActive={isActive} activeIndex={activeIndex} index={index} isLastItem={isLastItem} item={item} setActiveIndex={setActiveIndex} />
                            );
                        })}
                    </Col>

                </Col>
            </Row>

            <Col className='w-full md:w-[100vw] bg-grey-3 mt-40 md:mt-96 lg:mt-20 items-center py-10 px-0 md:px-20 lg:px-80 gap-12 rounded-lg px-4 md:rounded-none'>
                <h2 className='font-bold text-white text-2xl text-center'>Popular cryptocurrencies</h2>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            {(isTabletOrMobileScreen ? ["Rank", "Name", "24h Change", "Current Price"] : ["Rank", "Name", "24h Change", "Current Price", "Market Cap", "Volume 24H"]).map(title => {
                                return (
                                    <th className='text-center md:text-left'>{title}</th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets?.map(asset => {
                            return (
                                <tr>
                                    <td className='font-bold text-sm'>{asset.rank}</td>
                                    <td><AssetRow icon={asset.iconUrl} name={asset.name} symbol={asset.symbol} /></td>
                                    <td className={clsx(asset.change24H && asset.change24H > 0 ? "text-green-1" : "text-red-1", "font-bold text-sm")}>{asset.change24H}</td>
                                    <td className='font-bold text-sm'>{formatNumber(asset.currentPrice || 0, true)}</td>
                                    {!isTabletOrMobileScreen && <td className='font-bold text-sm'>{formatNumber(asset.mrkCap || 0, false)}</td>}
                                    {!isTabletOrMobileScreen && <td className='font-bold text-sm'>{formatNumber(asset.volume || 0, false)}</td>}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Col>
        </Layout>
    )
}

export default withAuthUser({
})(HomePage)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})

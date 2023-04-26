import { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { Col, Row } from '../../shared/layout/flex';
import Button from '../../shared/buttons/button';

interface AddExchangeTypes {
    onPressExchange: any,
};

const AddExchange = (props: AddExchangeTypes) => {
    const { t } = useTranslation(['settings', 'common']);

    return (
        <Col className='items-center mt-[100px] gap-6'>
            <Row className='items-center gap-3'>
                <svg width="44" height="44" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 47.6236C37.7026 47.6236 48 37.4104 48 24.8118C48 12.2132 37.7026 2 25 2C12.2975 2 2 12.2132 2 24.8118C2 37.4104 12.2975 47.6236 25 47.6236Z" stroke="#558AF2" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M34 32.7947C34 35.28 29.9706 37.2947 25 37.2947C20.0294 37.2947 16 35.28 16 32.7947" stroke="#558AF2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M34 25.2947C34 27.78 29.9706 29.7947 25 29.7947C20.0294 29.7947 16 27.78 16 25.2947" stroke="#558AF2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M25 22.2947C29.9706 22.2947 34 20.28 34 17.7947C34 15.3094 29.9706 13.2947 25 13.2947C20.0294 13.2947 16 15.3094 16 17.7947C16 20.28 20.0294 22.2947 25 22.2947Z" fill="#558AF2" stroke="#558AF2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h1 className='font-bold text-2xl'>{t('exchangeTitle')}</h1>
            </Row>
            <label className='font-medium text-base text-center text-grey-1'>{t('exchangeHint').split('.')[0]}.<br />{t('exchangeHint').split('.')[1]}</label>
            <Col className="grid grid-cols-3 gap-4">
                <Button className='w-[214px] h-[48px] bg-grey-3 rounded-md hover:bg-grey-4' onClick={() => props.onPressExchange((st: any) => [...st, { id: 1, name: 'Binance', create: true }, { id: 2, name: 'test' }])}>
                    <Row className='justify-center items-center gap-2'>
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2282_18035)">
                                <path d="M5.72902 7.98396L9.41885 4.29429L13.1106 7.98591L15.2576 5.83892L9.41885 0L3.58203 5.83697L5.72902 7.98396Z" fill="#F3BA2F" />
                                <path d="M4.21141 9.49974L2.06445 7.35278L-0.0826092 9.49985L2.06435 11.6468L4.21141 9.49974Z" fill="#F3BA2F" />
                                <path d="M5.72827 11.016L9.41809 14.7056L13.1097 11.0142L15.2579 13.16L15.2569 13.1612L9.41809 18.9999L3.58113 13.1631L3.57812 13.1601L5.72827 11.016Z" fill="#F3BA2F" />
                                <path d="M16.7709 11.6476L18.918 9.50049L16.771 7.35353L14.6239 9.50059L16.7709 11.6476Z" fill="#F3BA2F" />
                                <path d="M11.5957 9.49897H11.5966L9.41799 7.32031L7.80793 8.93037H7.80778L7.6229 9.1154L7.24128 9.49702L7.23828 9.50002L7.24128 9.50317L9.41799 11.6799L11.5966 9.50122L11.5977 9.50002L11.5957 9.49897Z" fill="#F3BA2F" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2282_18035">
                                    <rect width="19" height="19" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                        <label className='font-bold text-base text-center text-white'>Binance</label>
                    </Row>
                </Button>
                <Button className='w-[214px] h-[48px] bg-grey-3 rounded-md hover:bg-grey-4'>
                    <Row className='justify-center items-center gap-2'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2282_18044)">
                                <path d="M0 4.61537C0 2.06638 2.06638 0 4.61537 0H15.3846C17.9336 0 20 2.06638 20 4.61537V15.3846C20 17.9336 17.9336 20 15.3846 20H4.61537C2.06638 20 0 17.9336 0 15.3846V4.61537Z" fill="#0052FF" />
                                <path d="M9.98117 13.75C9.27325 13.7357 8.58375 13.5223 7.99208 13.1343C7.40042 12.7463 6.93062 12.1995 6.63679 11.5569C6.343 10.9143 6.23708 10.202 6.33125 9.50196C6.42546 8.80192 6.71592 8.14267 7.16921 7.60008C7.6225 7.0575 8.22021 6.65363 8.8935 6.435C9.56675 6.21633 10.2883 6.19179 10.9749 6.36421C11.6616 6.53662 12.2855 6.89892 12.7748 7.40946C13.264 7.92 13.5988 8.558 13.7406 9.25H17.5C17.3071 7.33554 16.384 5.56821 14.9214 4.31362C13.4589 3.05902 11.569 2.41309 9.64242 2.50941C7.71588 2.60574 5.90017 3.43696 4.57075 4.83117C3.24136 6.22537 2.5 8.07587 2.5 10C2.5 11.9241 3.24136 13.7746 4.57075 15.1688C5.90017 16.563 7.71588 17.3943 9.64242 17.4906C11.569 17.5869 13.4589 16.941 14.9214 15.6864C16.384 14.4318 17.3071 12.6645 17.5 10.75H13.7406C13.7406 12.25 11.4849 13.75 9.98117 13.75Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2282_18044">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                        <label className='font-bold text-base text-center text-white'>Coinbase</label>
                    </Row>
                </Button>
                <Button className='w-[214px] h-[48px] bg-grey-3 rounded-md hover:bg-grey-4'>
                    <label className='font-bold text-base text-center text-white'>Kucoin</label>
                </Button>
                <Button className='w-[214px] h-[48px] bg-grey-3 rounded-md hover:bg-grey-4'>
                    <label className='font-bold text-base text-center text-white'>Crypto.com</label>
                </Button>
                <Button className='w-[214px] h-[48px] bg-grey-3 rounded-md hover:bg-grey-4'>
                    <label className='font-bold text-base text-center text-white'>Metamask</label>
                </Button>
                <Button className='w-[214px] h-[48px] bg-grey-3 rounded-md hover:bg-grey-4'>
                    <label className='font-bold text-base text-center text-white'>Kraken</label>
                </Button>
            </Col>

            <label className='font-bold text-lg text-center text-white'>{t('exchangeFutureInfo')}</label>
        </Col>
    )
}

export default AddExchange
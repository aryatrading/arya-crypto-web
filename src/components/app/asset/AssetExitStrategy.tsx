import React, { useEffect } from 'react'
import AssetTrade from '../trade/assetTrade'
import { Col, Row } from '../../shared/layout/flex'
import { StoplossTrade } from '../trade/stoploss_trade'
import { TakeprofitTrade } from '../trade/takeprofit_trade'
import { TrailingTrade } from '../trade/trailing_trade'
import { getAssetOpenOrders } from '../../../services/controllers/trade'
import { useSelector } from 'react-redux'
import { getTrade } from '../../../services/redux/tradeSlice'
import { TradeType } from '../../../types/trade'
import { selectSelectedExchange } from '../../../services/redux/exchangeSlice'

const AssetExitStrategy = () => {
  
  const trade:TradeType = useSelector(getTrade);
  const selectedExchange = useSelector(selectSelectedExchange);


  useEffect(()=>{
    if(selectedExchange?.provider_id&&trade.symbol_name){
      getAssetOpenOrders(trade.symbol_name,selectedExchange?.provider_id).then((data)=>{
        console.log(data)
      })
    }
  },[selectedExchange?.provider_id, trade.symbol_name])
  
  return (
    <Col className='w-full gap-6'>
      <Row className='w-full lg:hidden'>
        <AssetTrade />
      </Row>
      <Col className='lg:flex-row w-full gap-4'>
        <Col className='gap-4 w-full bg-black-2 p-4 rounded-md'>
          <span className='font-semibold text-base'>
            What is a take profit?
          </span>
          <span className='text-sm'>
            Take profit is a pre-determined order to sell a asset when it reaches a certain price level in order to secure profits from a favourable price movement
          </span>
          <TakeprofitTrade assetScreen={true}/>
        </Col>
        <Col className='gap-4 w-full bg-black-2 p-4 rounded-md'>
          <span className='font-semibold text-base'>
            What is a Stop Loss?
          </span>
          <span className='text-sm'>
            A stop loss order is a pre-determined instruction to sell a security when it reaches a certain price level, in order to limit potential losses.
          </span>
          <StoplossTrade assetScreen={true}/>
        </Col>
        <Col className='gap-4 w-full bg-black-2 p-4  rounded-md'>
          <span className='font-semibold text-base'>
            Set Trailing?
          </span>
          <span className='text-sm'>
            A Percentage trailing order adjusts a Stop - loss price at a fixed percentage below the current market price to lock in profits and protect gains.
          </span>
          <TrailingTrade assetScreen={true}/>  
        </Col>
      </Col>

    </Col>
    
  )
}

export default AssetExitStrategy
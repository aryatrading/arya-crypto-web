import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectSelectedExchange } from '../../../../../../services/redux/exchangeSlice';
import { MODE_DEBUG } from '../../../../../../utils/constants/config';
import { getSmartAllocationTradeLogs } from '../../../../../../services/controllers/smart-allocation';
import { smartAllocationTradeLogTableHead } from '../../../../../../utils/tableHead/smartAllocationTradeLog';
import moment from 'moment';
import { getStatusList } from '../../../../../../services/controllers/utils';
import { EnumEntityNames } from '../../../../../../utils/constants/utils';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';

const SmartAllocationTradeLog = () => {
    const selectedExchange = useSelector(selectSelectedExchange);

    const [tradeLog, setTradeLog] = useState([] as any[])
    const [statusCodes, setStatusCodes] = useState([] as any[])

    const {t} = useTranslation(['smart-allocation','common'])

    const fetchSmartAllocationTradeLog = useCallback(
        () => {
            if(!selectedExchange?.provider_id){
                if(MODE_DEBUG){
                    console.error("fetchSmartAllocationTradeLog: selectedExchange.provider_id is undefined", 
                    selectedExchange?.provider_id)
                }
                return
            }
            getSmartAllocationTradeLogs(selectedExchange?.provider_id).then((res) => {
                const {data} = res;
                if(MODE_DEBUG){
                  console.log("fetchSmartAllocationTradeLog: data", data)
                }
                setTradeLog([
                  {
                    "status": 200,
                    "quantity": 1,
                    "order_data": {
                      "side": "BUY",
                      "entry_type": "MARKET",
                      "price_based": "False",
                      "status_check_time": "2023-05-15T13:35:58.237145+00:00",
                      "status_check_delay": 15
                    },
                    "settled_at": "2023-05-15T13:35:58.368000+00:00",
                    "price": 27382.18,
                    "asset_name": "btc",
                    "order_id": 111
                  }
                ])
            })
        }
      ,
      [selectedExchange?.provider_id],
    )
    const getOrderStatus = useCallback(
      () => {
        getStatusList(EnumEntityNames.order).then((res) => {
          const {data} = res;
          if(MODE_DEBUG){
            console.log("getOrderStatus: data", data)
          }
          let statusList:any = {}
          data.forEach((item:{value:number, name:string}) => {
            statusList[item.value] = item.name
          })
          setStatusCodes(statusList)
        })
      }
      ,
      [],
    )

    useEffect(() => {
      fetchSmartAllocationTradeLog()
      getOrderStatus()
    }, [fetchSmartAllocationTradeLog, getOrderStatus])
    
  return (
    <div className='w-full overflow-x-auto'>
      <table className="table-auto lg:table-fixed w-full border-collapse">
        <thead className='bg-black-2'>
          <tr className='rounded-lg'>
            {smartAllocationTradeLogTableHead.map((item, index) => {
              return (
                <th className=' first:rounded-l-lg last:rounded-r-lg text-left h-14 px-5 text-grey-1 text-sm' key={index}>
                  {t(`common:${item}`)}
                </th>
              )
            })
            }
          </tr>
        </thead>
        <tbody className='relative'>
          {!tradeLog.length &&<span className='absolute top-1/2 left-0 right-0 text-center mx-auto font-medium'>{t("noTradeData")}</span>}
          {
            !!tradeLog.length?
            tradeLog.map((trade,index) => {
              const tradeDate = moment(trade.settled_at).format('DD/MM/YYYY HH:mm:ss')
              return (
                <tr key={trade.order_id}>
                  <td className='h-14 px-5 font-medium text-sm'>{index+1}</td>
                  <td className='h-14 px-5 font-medium text-sm'>{
                    <span className={twMerge('flex w-16 h-6 rounded text-center justify-center items-center',trade.order_data.side==='BUY'?'text-red-1 bg-red-2':'text-green-1 bg-green-2')}>{trade.order_data.side}</span>
                  }</td>
                  <td className='h-14 px-5 font-medium text-sm'>{t(`common:${statusCodes[trade.status]}`)}</td>
                  <td className='h-14 px-5 font-medium text-sm'>{`${trade.quantity} ${trade.asset_name.toUpperCase()}`}</td>
                  <td className='h-14 px-5 font-medium text-sm'>${trade.price}</td>
                  <td className='h-14 px-5 font-medium text-sm'>{tradeDate}</td>
                </tr>
              )
            }):
            new Array(10).fill(0).map((item, index) => {
              return (
                <tr key={index}>
                  <td className='h-4 px-5'></td>
                  <td className='h-4 px-5'></td>
                  <td className='h-4 px-5'></td>
                  <td className='h-4 px-5'></td>
                  <td className='h-4 px-5'></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default SmartAllocationTradeLog 
import React, { useMemo, useState } from "react";
import AssetTrade from "../trade/assetTrade";
import { Col, Row } from "../../shared/layout/flex";
import { StoplossTrade } from "../trade/stoploss_trade";
import { TakeprofitTrade } from "../trade/takeprofit_trade";
import { TrailingTrade } from "../trade/trailing_trade";
import { useSelector } from "react-redux";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import _ from "lodash";
import { TrashIcon } from "@heroicons/react/24/outline";
import { TpHeaderOptions, TrailingHeaderOptions } from "../../../utils/constants/asset";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { cancelOrder } from "../../../services/controllers/trade";
import { toast } from "react-toastify";
import Button from "../../shared/buttons/button";
import { Order } from "../../../types/trade";

const AssetExitStrategy = () => {
  const selectedExchange = useSelector(selectSelectedExchange);
  const [orders, setOrders] = useState<Order[]>([])

  const deleteExitStrategy = (orderId:number) =>{
    if(!orderId||!selectedExchange?.provider_id){
      if(MODE_DEBUG){
        console.log(`deleteExitStrategy called with false orderId:${orderId} or provider:${selectedExchange?.provider_id}`)
      }
      return
    }
    cancelOrder(orderId,selectedExchange?.provider_id).then(()=>{
      toast.success('Order cancelled successfully')
    }).catch(()=>{
      toast.error('Error cancelling order')
    })
  }

  const ExitStrategyOptions = [
    {
      heading: "What is a take profit?",
      text: "Take profit is a pre-determined order to sell a asset when it reaches a certain price level in order to secure profits from a favourable price movement",
      component: <TakeprofitTrade assetScreen={true} />,
    },
    {
      heading: "What is a Stop Loss?",
      text: "A stop loss order is a pre-determined instruction to sell a security when it reaches a certain price level, in order to limit potential losses.",
      component: <StoplossTrade assetScreen={true} />,
    },
    {
      heading: "Set Trailing?",
      text: "A Percentage trailing order adjusts a Stop - loss price at a fixed percentage below the current market price to lock in profits and protect gains.",
      component: <TrailingTrade assetScreen={true} />,
    },
  ];

 

  const OpenOrdersOptions= useMemo(()=>{
    return[
      {
        name:"Take profit",
        values:orders.filter((order)=>order.type==='TP'),
        header:TpHeaderOptions
      },
      {
        name:"Stoploss",
        values:orders.filter((order)=>order.type==='SL'),
        header:TpHeaderOptions
      },
      {
        name:"Trailing",
        values:orders.filter((order)=>order.type==='T_SL'),
        header:TrailingHeaderOptions
      }
    ]
  },[orders])
  

  return (
    <Col className="w-full gap-6">
      <Row className="w-full lg:hidden">
        <AssetTrade />
      </Row>
      <Col className="lg:flex-row w-full gap-4">
        {ExitStrategyOptions.map((option) => {
          return (
            <Col
              key={_.uniqueId()}
              className="gap-4 w-full bg-black-2 p-4  rounded-md"
            >
              <span className="font-semibold text-base">{option.heading}</span>
              <span className="text-sm">{option.text}</span>
              {option.component}
            </Col>
          );
        })}
      </Col>

      <Col className="gap-10">
      {OpenOrdersOptions.filter((option)=>!!option.values.length).map((option)=>{
        const {values,header}:any = option
        return <Col className="gap-8">
          <span className="font-semibold text-2xl">{option.name}</span>
          <table className="table-fixed text-center w-full">
            <thead className="bg-black-2 ">
              <tr className="text-grey-1 font-medium text-base">
                {header.map((option:string) => (
                  <th className="py-4 first:rounded-l-lg last:rounded-r-lg">
                    {option}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.map((order:any,index:any)=>{
                return <tr className="font-medium text-base">
                  <td className="py-4">{option.name==='Trailing'?(order.order_data.trailing_delta?"Percentage":"Breakeven"):`${option.name} ${index+1}`}</td>
                  <td className="py-4">{option.name==='Trailing'?order.order_data.activation_price:'Sell'}</td>
                  <td className="py-4">{option.name==='Trailing'?`${!!order.order_data?.stop_price?order.order_data?.stop_price:''}`:order?.quantity}</td>
                  <td className="py-4">{option.name==='Trailing'?`${!!order.order_data?.trailing_delta?order.order_data.trailing_delta*100:''}`:order?.order_value}</td>
                  <td className="py-4">{order?.order_status === 'PENDING_ENTRY'?'Pending':'Active'}</td>
                  <td className="py-4"> 
                    <Button onClick={()=>deleteExitStrategy(order.id)} className="flex w-full justify-center">
                      <TrashIcon className="w-6"/>
                    </Button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </Col>
      })}
      </Col>
    </Col>
  );
};

export default AssetExitStrategy;

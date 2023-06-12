import React, { useEffect, useMemo, useState } from "react";
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

const AssetExitStrategy = () => {
  const selectedExchange = useSelector(selectSelectedExchange);
  const [orders, setOrders] = useState([
    {
      id: 2945,
      quantity: 1.0,
      order_value: 30000.0,
      value: 30000.0,
      number: 7,
      executed_amount: 0.0,
      total_price: 0.0,
      total_fees: 0.0,
      type: "T_SL",
      status: 0,
      cancel_reason: null,
      edited_time: null,
      created_at: "2023-06-08T12:05:57.415270+00:00",
      settled_at: null,
      order_data: {
        trailing_delta: "0.3",
        activation_price: "30000",
        status_check_time: null,
        status_check_delay: 0,
      },
      provider_data: {},
      order_origin: "manual_order",
      order_status: "PENDING_ENTRY",
      order_symbol: "BTCUSDT",
      order_provider: 1,
    },
    {
      id: 2944,
      quantity: 1.377946,
      order_value: 37204.542,
      value: 27000.0,
      number: 6,
      executed_amount: 0.0,
      total_price: 0.0,
      total_fees: 0.0,
      type: "SL",
      status: 0,
      cancel_reason: null,
      edited_time: null,
      created_at: "2023-06-08T11:11:50.631296+00:00",
      settled_at: null,
      order_data: {
        stop_price: "27000",
        activation_price: "30455.1",
        status_check_time: null,
        status_check_delay: 0,
      },
      provider_data: {},
      order_origin: "manual_order",
      order_status: "PENDING_ENTRY",
      order_symbol: "BTCUSDT",
      order_provider: 1,
    },
    {
      id: 2943,
      quantity: 1.377946,
      order_value: 28194.842079,
      value: 20461.5,
      number: 5,
      executed_amount: 0.0,
      total_price: 0.0,
      total_fees: 0.0,
      type: "SL",
      status: 0,
      cancel_reason: null,
      edited_time: null,
      created_at: "2023-06-08T11:11:50.627433+00:00",
      settled_at: null,
      order_data: { status_check_time: null, status_check_delay: 0 },
      provider_data: {},
      order_origin: "manual_order",
      order_status: "PENDING_ENTRY",
      order_symbol: "BTCUSDT",
      order_provider: 1,
    },
    {
      id: 2942,
      quantity: 0.5,
      order_value: 15227.65,
      value: 30455.3,
      number: 4,
      executed_amount: 0.0,
      total_price: 0.0,
      total_fees: 0.0,
      type: "TP",
      status: 0,
      cancel_reason: null,
      edited_time: null,
      created_at: "2023-06-08T11:11:50.624504+00:00",
      settled_at: null,
      order_data: { status_check_time: null, status_check_delay: 0 },
      provider_data: {},
      order_origin: "manual_order",
      order_status: "PENDING_ENTRY",
      order_symbol: "BTCUSDT",
      order_provider: 1,
    },
    {
      id: 2941,
      quantity: 0.188973,
      order_value: 5000.0,
      value: 26458.75,
      number: 3,
      executed_amount: 0.0,
      total_price: 0.0,
      total_fees: 0.0,
      type: "ENTRY",
      status: 0,
      cancel_reason: null,
      edited_time: null,
      created_at: "2023-06-08T11:11:50.615021+00:00",
      settled_at: null,
      order_data: {
        side: "BUY",
        entry_type: "MARKET",
        price_based: "True",
        status_check_time: "2023-06-08T11:11:50.612541+00:00",
        status_check_delay: 15,
      },
      provider_data: {},
      order_origin: "manual_order",
      order_status: "PENDING_ENTRY",
      order_symbol: "BTCUSDT",
      order_provider: 1,
    },
    {
      id: 2937,
      quantity: 0.008866,
      order_value: 234.0,
      value: 26392.86,
      number: 1,
      executed_amount: 0.0,
      total_price: 0.0,
      total_fees: 0.0,
      type: "ENTRY",
      status: 0,
      cancel_reason: null,
      edited_time: null,
      created_at: "2023-06-08T10:09:53.827509+00:00",
      settled_at: null,
      order_data: {
        side: "BUY",
        entry_type: "MARKET",
        price_based: "True",
        status_check_time: "2023-06-08T10:09:53.824949+00:00",
        status_check_delay: 15,
      },
      provider_data: {},
      order_origin: "manual_order",
      order_status: "PENDING_ENTRY",
      order_symbol: "BTCUSDT",
      order_provider: 1,
    },
    {
      id: 2936,
      quantity: 0.037899,
      order_value: 1000.0,
      value: 26385.59,
      number: 0,
      executed_amount: 0.0,
      total_price: 0.0,
      total_fees: 0.0,
      type: "ENTRY",
      status: 0,
      cancel_reason: null,
      edited_time: null,
      created_at: "2023-06-08T09:52:04.246133+00:00",
      settled_at: null,
      order_data: {
        side: "BUY",
        entry_type: "MARKET",
        price_based: "True",
        status_check_time: "2023-06-08T09:52:04.237391+00:00",
        status_check_delay: 15,
      },
      provider_data: {},
      order_origin: "manual_order",
      order_status: "PENDING_ENTRY",
      order_symbol: "BTCUSDT",
      order_provider: 1,
    },
  ])

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
        name:"Stoploss",
        values:orders.filter((order)=>order.type==='SL'),
        header:TpHeaderOptions
      },
      {
        name:"Take profit",
        values:orders.filter((order)=>order.type==='TP'),
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
      {OpenOrdersOptions.filter((option)=>!!option.values.length).map((option,index)=>{
        const {values,header}:any = option
        return <Col className="gap-8">
          <span className="font-semibold text-2xl">{option.name}</span>
          <table className="table-auto">
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
              {values.map((order:any)=>{
                return <tr className="text-center font-medium text-base">
                  <td className="py-4">{option.name==='Trailing'?'Fixed':`${option.name} ${index+1}`}</td>
                  <td className="py-4">{option.name==='Trailing'?order.order_data.activation_price:'Sell'}</td>
                  <td className="py-4">{order?.quantity}</td>
                  <td className="py-4">{option.name==='Trailing'?`${order.order_data.trailing_delta*100}`:order?.order_value}</td>
                  <td className="py-4">{order?.order_status === 'PENDING_ENTRY'?'Pending':'Active'}</td>
                  <td className="py-4"> 
                    <TrashIcon className="w-6"/>
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

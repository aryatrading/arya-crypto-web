import React, { useCallback, useEffect } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectSelectedExchange } from '../../../../../../../services/redux/exchangeSlice'
import { performRebalance } from '../../../../../../../services/controllers/smart-allocation'
import { MODE_DEBUG } from '../../../../../../../utils/constants/config'
import { toast } from 'react-toastify'
import Button from '../../../../../../shared/buttons/button'
import { SmartAllocationAssetType } from '../../../../../../../types/smart-allocation.types'
import { Col } from '../../../../../../shared/layout/flex'
import { twMerge } from 'tailwind-merge'
import AssetRow from '../../../../../../shared/AssetRow/AssetRow'
import CustomScroll from '../../../../../../shared/CustomScroll/CustomScroll'
 
 
 
 const RebalancePreviewDialog = ({holdingData}:{holdingData:SmartAllocationAssetType[]}) => {
    

    const {t} = useTranslation(['smart-allocation','common'])
    
    const selectedExchange = useSelector(selectSelectedExchange);

    const maxMovement =Math.max(
        ...holdingData.map((asset) => {
            const {expected_value, current_value} = asset;
            let movement = 0;
            if(current_value && expected_value){
                if(current_value<expected_value){
                     movement = expected_value - current_value
                }
                else{
                    movement = current_value - expected_value   
                }
            }
            return movement
        })
    )

    const rebalanceNow  = useCallback(
      () => {
        if(!selectedExchange?.provider_id){
            if(MODE_DEBUG){
                console.log(`rebalanceNow: missing provider_id:${selectedExchange?.provider_id}`)
            }
            return
        }
        performRebalance(selectedExchange?.provider_id).then((res) => {
            const {response} = res.data;
            if(response){
                toast.success('Rebalancing portfolio')
            }
        } 
        ).catch((error) => {    
            if(MODE_DEBUG){
                console.log(error)
            }    
            toast.error('Error rebalancing portfolio') 
        })
      },
      [selectedExchange?.provider_id],
    )
    
    const tradePreview = useCallback(() => {
        return <Col className='w-full'>
            <div className='grid grid-cols-5 text-grey-1 bg-black-2 rounded-lg items-stretch justify-between text-center font-medium'>
                <div className='col-span-1 py-4 px-4'>{t('common:asset')}</div>
                <div className='col-span-1 py-4 px-4'>{t('common:sell')}</div>
                <div className='col-span-2 py-4 px-4'>{t('common:target')}</div>
                <div className='col-span-1 py-4 px-4'>{t('common:buy')}</div>
            </div>
            <CustomScroll height='h-[400px] md:h-[250px]'>
                {
                    holdingData.map((asset) => {
                        const {asset_details, current_value, expected_value} = asset
                        const asset_data = asset_details?.asset_data

                        let percentage = 0
                        let buy = false
                        if(current_value && expected_value){
                            if(current_value<expected_value){
                                buy = true
                                let buyAmount = expected_value - current_value
                                percentage = Math.abs(Math.round((buyAmount / maxMovement) * 100))
                            }
                            else{
                                let sellAmount = current_value - expected_value
                                percentage = Math.abs(Math.round((sellAmount / maxMovement) * 100))
                            }
                        }
                        return <div className='grid grid-cols-5 rounded-lg items-stretch justify-between text-center font-medium md:font-semibold'>
                                    <div className='col-span-1 py-4 px-4'>
                                        <AssetRow icon={asset_data?.image} name={asset_data?.name} symbol={asset_data?.symbol}/>
                                    </div>
                                    <div className='col-span-1 py-4 px-4 text-sm md:text-base'>
                                        {!buy&&<span className='flex flex-col md:flex-row gap-1 items-end md:items-center'>
                                            <span>USD</span>
                                            <span>${((current_value||0)-(expected_value||0)).toFixed(2)}</span>
                                        </span>
                                        }
                                    </div>
                                    
                                    <div className='col-span-2 py-4 px-4 flex justify-center'>
                                        <div className='w-1/2 relative'>
                                            {!buy&&<div style={{width:`${percentage>100?100:percentage}%`}} className={twMerge(' absolute right-0 h-full rounded bg-red-1')}></div>}
                                        </div>
                                        <div className='w-1/2 relative'>
                                            {buy&&<div style={{width:`${percentage>100?100:percentage}%`}} className={twMerge(' absolute left-0 h-full rounded bg-green-1')}></div>}
                                        </div>
                                        
                                    </div>
                                    
                                    <div className='col-span-1 py-4 px-4 text-sm md:text-base'>
                                        {buy&&<span className='flex flex-col md:flex-row gap-1 items-start md:items-center'>
                                            <span>USD</span>
                                            <span>${((expected_value||0)-(current_value||0)).toFixed(2)}</span>
                                        </span>}
                                    </div>
                                </div>
                    },[])
                }
            </CustomScroll>
        </Col>
    },[holdingData, maxMovement, t])
    
  return (
    <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
            <Button className="w-full bg-blue-1 py-2.5 px-5 rounded-md text-sm font-bold">{t('rebalanceNow')}</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
            <AlertDialog.Overlay className="dialog-overlay data-[state=open]:animate-overlayShow" />
            <AlertDialog.Content className="fixed left-0 right-0 bottom-0 top-[60px] md:right-auto md:top-1/2 md:left-1/2 md:translate-x-[-50%] md:translate-y-[-50%] md:h-[500px] md:w-[90vw] md:rounded-lg p-7 bg-black-1 z-10 flex flex-col data-[state=open]:animate-contentShow max-w-[900px] focus:outline-none justify-between">
                <div className='flex flex-col items-start gap-4 w-full'>
                    <AlertDialog.Title className="dialog-title">{t('rebalanceNow')}</AlertDialog.Title>
                    <AlertDialog.Description className="dialog-description">
                        {t('smart-allocation:rebalanceNowDescription')}
                    </AlertDialog.Description>
                </div>
                {tradePreview()}
                <div className='w-full flex flex-col-reverse md:flex-row gap-6 justify-end items-center text-base font-semibold'>
                    <AlertDialog.Cancel asChild>
                        <Button className="alert-dialog-cancel-btn">{t('cancel')}</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <Button className=" bg-blue-1 rounded-md py-4 px-12 w-full md:w-auto" onClick={rebalanceNow}>{t('rebalanceNow')}</Button>
                    </AlertDialog.Action>   
                </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default RebalancePreviewDialog
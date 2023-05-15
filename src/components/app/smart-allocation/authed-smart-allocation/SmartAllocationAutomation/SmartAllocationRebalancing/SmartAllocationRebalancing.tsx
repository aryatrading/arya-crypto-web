import moment from 'moment'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { EnumRebalancingFrequency } from '../../../../../../utils/constants/smartAllocation'
import Button from '../../../../../shared/buttons/button'
import { Col, Row } from '../../../../../shared/layout/flex'
import { useSelector } from 'react-redux'
import { selectSelectedExchange } from '../../../../../../services/redux/exchangeSlice'
import { MODE_DEBUG } from '../../../../../../utils/constants/config'
import { SmartAllocationContext } from '../../authed-smart-alocation'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import { toast } from 'react-toastify'
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'next-i18next'
import { setRebalancingFrequency } from '../../../../../../services/controllers/smart-allocation'

const SmartAllocationRebalancing = () => {
    const {rebalancingDate,rebalancingFrequency,getSmartAllocationData} = useContext(SmartAllocationContext)
    const [tempFrequency, setTempFrequency] = useState<EnumRebalancingFrequency|null>(rebalancingFrequency)
    const selectedExchange = useSelector(selectSelectedExchange);
    const [rebalanceNow, setRebalanceNow] = useState<boolean|'indeterminate'>(false)
    const [rebalanceModalOpen, setRebalanceModalOpen] = useState<boolean>(false)
    const {t} = useTranslation(['smart-allocation','common'])

    const saveRebalancingFrequency = useCallback(
        (frequency?:EnumRebalancingFrequency|null) => {
            if(!selectedExchange?.provider_id || tempFrequency===undefined){
                if(MODE_DEBUG){
                    console.log(`saveRebalancingFrequency: missing provider_id:${selectedExchange?.provider_id} or tempFrequency:${tempFrequency}}`)
                }
                return
            } 
            const frequencyToSave = (frequency!==undefined)?frequency:tempFrequency
            const rebalance = rebalanceNow==='indeterminate'?false:rebalanceNow
            setRebalancingFrequency(selectedExchange?.provider_id, frequencyToSave,rebalance).then((res) => {
                const {response} = res.data;
                if(response){
                    toast.success(response)
                    getSmartAllocationData()
                }
            }).catch((error) => {    
                if(MODE_DEBUG){
                    console.log(error)
                }     
            })
        },
      [getSmartAllocationData, rebalanceNow, selectedExchange?.provider_id, tempFrequency],
    )
    
    
    useEffect(() => {
      setTempFrequency(rebalancingFrequency)
    }, [rebalancingFrequency])
    

    const deleteRebalancingFrequency = useCallback(
        () => {
          return <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                      <Button className='font-semibold text-xs bg-transparent'><TrashIcon className='w-6 h-6 text-grey-1'/></Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                      <AlertDialog.Overlay className="dialog-overlay data-[state=open]:animate-overlayShow" />
                      <AlertDialog.Content className="dialog-content data-[state=open]:animate-contentShow">
                          <AlertDialog.Title className="dialog-title">{t('deleteFrequencyTitle')}</AlertDialog.Title>
                          <AlertDialog.Description className="dialog-description">
                              {t('deleteFrequencyDescription')}
                          </AlertDialog.Description>
                          <div className='flex flex-col gap-6 justify-end text-base font-semibold'>
                            <AlertDialog.Action asChild>
                                <Button className="px-14 py-2  bg-red-1 rounded-lg" onClick={()=>saveRebalancingFrequency(null)}>{t('deleteFrequency')}</Button>
                            </AlertDialog.Action>
                            <AlertDialog.Cancel asChild>
                                <Button className="alert-dialog-cancel-btn">{t('common:cancel')}</Button>
                            </AlertDialog.Cancel>
                          </div>
                      </AlertDialog.Content>
                  </AlertDialog.Portal>
              </AlertDialog.Root>
        },
        [saveRebalancingFrequency, t],
      )


    const saveRebalancingFrequencyButton = useCallback(
      () => {
        return <AlertDialog.Root open={rebalanceModalOpen} onOpenChange={setRebalanceModalOpen} >
                <AlertDialog.Trigger asChild>
                    <Button className='bg-blue-1 py-3 rounded-lg font-semibold text-xs w-full md:w-56'>{t('setRebalancingFrequency')}</Button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="dialog-overlay data-[state=open]:animate-overlayShow" />
                    <AlertDialog.Content className="dialog-content data-[state=open]:animate-contentShow gap-8">
                        <div className='flex flex-col items-center gap-4'>
                            <AlertDialog.Title className="dialog-title">{t('updateFrequencyTitle')}</AlertDialog.Title>
                            <AlertDialog.Description className="dialog-description">
                                {t('updateFrequencyDescription')}
                            </AlertDialog.Description>
                            <div className="flex items-center gap-4">
                                <Checkbox.Root
                                    className=" flex h-6 w-6 appearance-none items-center justify-center rounded-[4px] bg-grey-3 outline-none focus:outline focus:outline-grey-1 hover:outline hover:outline-grey-1"
                                    checked={rebalanceNow}
                                    onCheckedChange={setRebalanceNow}
                                    id="c1"
                                >
                                    <Checkbox.Indicator className="text-white">
                                        <CheckIcon className='w-6 h-4 stroke-2'/>
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <label className="text-base leading-none text-white font-medium" htmlFor="c1">
                                    {t('rebalanceNow')}
                                </label>
                            </div>
                        </div>
                        <div className='flex flex-col gap-6 items-center text-base font-semibold'>
                            <AlertDialog.Action asChild>
                                <Button className=" bg-blue-1 rounded-lg py-2 px-14" onClick={()=>saveRebalancingFrequency()}>{t('updateFrequency')}</Button>
                            </AlertDialog.Action>
                            <AlertDialog.Cancel asChild>
                                <Button className="alert-dialog-cancel-btn">{t('common:cancel')}</Button>
                            </AlertDialog.Cancel>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
      },
      [rebalanceModalOpen, rebalanceNow, saveRebalancingFrequency, t],
    )
    
      useEffect(()=>{
        setRebalanceNow(false)
      },[rebalanceModalOpen])


  return (
        <Col className='items-start gap-7'>
            <Row className='flex py-5 px-4 bg-black-2 rounded-lg w-full justify-between lg:w-1/2'>
                <Col className='gap-2 text-sm'>
                    <span className='font-semibold text-white'>{t('currentRebalancingFrequency')}</span>
                    {rebalancingFrequency?
                        <span className='text-grey-1'>{t('RebalancingDetail')} <span className='text-blue-1'>{`${t(`common:${rebalancingFrequency}`)}, ${t('NextRebalancingAt')} ${moment(rebalancingDate).calendar()}`}</span></span>
                        :
                        <span className='text-grey-1'>{t('noRebalancingFrequencySet')}</span>
                    }
                </Col>
                {!!rebalancingFrequency&&deleteRebalancingFrequency()}
            </Row>
            <Col className='text-sm gap-3 w-full lg:w-2/3'>
                <span className='font-semibold text-white'>{t('WhatIsRebalancingFrequency')}</span>
                <span className='text-grey-1'>{t('RebalancingFrequencyDescription')}</span>
            </Col>
            <Col className='gap-5 w-full'>
                <span className='font-semibold'>{t('chooseFrequency')}</span>
                <div className='flex gap-3'>
                    <Button className= {twMerge('rounded-lg bg-black-2 py-4 w-full lg:w-56 text-xs font-semibold text-grey-1',(tempFrequency===null)?'bg-blue-3 text-blue-1':'')} onClick={() => setTempFrequency(null)}>
                        {t('common:none')}
                    </Button>
                    {Object.values(EnumRebalancingFrequency).map((frequency) => {
                        return (
                            <Button className= {twMerge('rounded-lg bg-black-2 py-4 w-full lg:w-56 text-xs font-semibold text-grey-1',(tempFrequency===frequency)?'bg-blue-3 text-blue-1':'')} onClick={() => setTempFrequency(frequency)}>
                                {t(`common:${frequency}`)}
                            </Button>
                        )
                    })}
                </div>
                {saveRebalancingFrequencyButton()}
            </Col>
        </Col>
  )
}

export default SmartAllocationRebalancing
import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../../../shared/buttons/button'
import { Col, Row } from '../../../../../shared/layout/flex'
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { EnumExitStrategyTrigger } from '../../../../../../utils/constants/smartAllocation'
import ExitStrategyInput from './ExitStrategyInput'
import { selectSelectedExchange } from '../../../../../../services/redux/exchangeSlice'
import { useSelector } from 'react-redux'
import { createExitStrategy, deleteExitStrategy, getExitStrategy, updateExitStrategy } from '../../../../../../services/controllers/smart-allocation'
import { MODE_DEBUG } from '../../../../../../utils/constants/config'
import { toast } from 'react-toastify'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { SmartAllocationExitStrategyType } from '../../../../../../types/smart-allocation.types'
import { Trans, useTranslation } from 'next-i18next'


const SmartAllocationExitStrategy = () => {

    const [portfolioChange,setPortfolioChange] = useState<number>(0)
    const [sellPortion,setSellPortion] = useState<number>(0)
    const [assetChangeType, setAssetChangeType] = useState<EnumExitStrategyTrigger>(EnumExitStrategyTrigger.RisesBy)
    const selectedExchange = useSelector(selectSelectedExchange);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentExitStrategy, setCurrentExitStrategy] = useState<null|SmartAllocationExitStrategyType>(null);
    const [fetchError, setFetchError] = useState<boolean>(true);
    const {t} = useTranslation(['smart-allocation','common'])
    const fetchExitStrategy = useCallback(() =>{
        if(!selectedExchange?.provider_id){
            if(MODE_DEBUG){
                console.log(`fetchExitStrategy: missing provider_id:${selectedExchange?.provider_id}`)
            }
            return
        }
        setLoading(true)
        getExitStrategy(selectedExchange?.provider_id).then((res) =>{
            const {data} = res
            if(data){
                
                setCurrentExitStrategy(data)
                const {exit_percentage,exit_type,exit_value} = data
                if(exit_type === EnumExitStrategyTrigger.RisesBy){
                    setPortfolioChange(exit_value*100)
                }
                else{
                    setPortfolioChange(exit_value)
                }
                setSellPortion(exit_percentage*100)
                setAssetChangeType(exit_type)
            }
            else{
                setCurrentExitStrategy(null)
                setPortfolioChange(0)
                setSellPortion(0)
                setAssetChangeType(EnumExitStrategyTrigger.RisesBy)
            }
            setFetchError(false)
        }).catch((error) =>{
            if(MODE_DEBUG){
                console.log(error)
            }
            setFetchError(true)
        }).finally(() =>{
            setLoading(false)
        })
    },[selectedExchange?.provider_id])

    const saveExitStrategy = useCallback(() =>{
        if(!selectedExchange?.provider_id||!assetChangeType||!portfolioChange||!sellPortion){
            if(MODE_DEBUG){
                console.log(`saveExitStrategy: missing provider_id:${selectedExchange?.provider_id} assetChangeType:${assetChangeType} portfolioChange:${portfolioChange} sellPortion:${sellPortion}`)
            }
            return
        }
        let portflolioValue:number = portfolioChange
        if(assetChangeType === EnumExitStrategyTrigger.RisesBy){
            portflolioValue = portfolioChange/100
        }
        const sellValue = sellPortion/100
        if(currentExitStrategy){
            //update
            updateExitStrategy(selectedExchange?.provider_id,assetChangeType,portflolioValue,sellValue).then((res) =>{
                if(MODE_DEBUG){
                    console.log(res)
                }
                fetchExitStrategy()
                toast.success(t('exitStrategyUpdated'))
            }).catch((error) =>{
                if(MODE_DEBUG){
                    console.log(error)
                }
                toast.error(t('updateExitStrategyFailed'))
            })
        }
        else{
            //create
            createExitStrategy(selectedExchange?.provider_id,assetChangeType,portflolioValue,sellValue).then((res) =>{
                if(MODE_DEBUG){
                    console.log(res)
                }
                fetchExitStrategy()
                toast.success(t('exitStrategyCreated'))
            }).catch((error) =>{
                if(MODE_DEBUG){
                    console.log(error)
                }
                toast.error(t('createExitStrategyFailed'))
            })
        }

    },[assetChangeType, currentExitStrategy, fetchExitStrategy, portfolioChange, selectedExchange?.provider_id, sellPortion, t])

    const removeExitStrategy = useCallback(() =>{
        if(!selectedExchange?.provider_id){
            if(MODE_DEBUG){
                console.log(`deleteExitStrategy: missing provider_id:${selectedExchange?.provider_id}`)
            }
            return
        }
        deleteExitStrategy(selectedExchange?.provider_id).then((res) =>{
            if(MODE_DEBUG){
                console.log(res)
            }
            fetchExitStrategy()
            toast.success(t('exitStrategyDeleted'))
        }).catch((error) =>{
            if(MODE_DEBUG){
                console.log(error)
            }
            toast.error(t('deleteExitStrategyFailed'))
        })

    },[fetchExitStrategy, selectedExchange?.provider_id, t])

    
    const triggerMovement = useCallback(() =>{
        return <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button
            className="px-6 py-3 inline-flex items-center justify-center text-blue-1 bg-black-2 rounded-md gap-0 w-full md:w-auto md:gap-6"
          > 
            <span className='w-full text-center md:text-left'>{t(assetChangeType)}</span>
            <ChevronDownIcon className='w-5 h-5 text-grey-1 ml-auto md:m-auto'/>
          </button>
        </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="w-[--radix-dropdown-menu-trigger-width] flex flex-col bg-black-2 rounded-md p-[5px]"
            align='start'
            sideOffset={2}
          >
            {
                Object.values(EnumExitStrategyTrigger).map((trigger) =>{
                    return <DropdownMenu.Item
                        className='text-left px-6 py-3 hover:text-blue-1'
                        key={trigger}
                        onSelect={() => setAssetChangeType(trigger)}
                    >
                        {t(trigger)}
                    </DropdownMenu.Item>
                })
            }
          </DropdownMenu.Content>
      </DropdownMenu.Root>
    }, [assetChangeType, t])
    
    const triggerPercentage = useCallback(
        () =>{
            return <Row className='bg-black-2 rounded-lg py-3 px-4 text-sm text-blue-1 w-full md:w-auto'>
                <ExitStrategyInput  isPercentage={assetChangeType === EnumExitStrategyTrigger.RisesBy} value={portfolioChange} setValue={setPortfolioChange}/>
            </Row>
        }
      ,
      [assetChangeType, portfolioChange],
    )

    const sellPercentage = useCallback(() =>{
        return <Row className='bg-black-2 rounded-lg py-3 px-4 text-sm text-blue-1 w-full md:w-auto'>
            <ExitStrategyInput isPercentage={true} value={sellPortion} setValue={setSellPortion}/>
        </Row>
    }, [sellPortion])


    const deleteExitStrategyBtn = useCallback(
        () => {
          return <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                      <Button className='font-semibold text-xs bg-transparent'><TrashIcon className='w-6 h-6 text-grey-1'/></Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                      <AlertDialog.Overlay className="dialog-overlay data-[state=open]:animate-overlayShow" />
                      <AlertDialog.Content className="dialog-content data-[state=open]:animate-contentShow">
                          <AlertDialog.Title className="dialog-title">{t('deleteExitStrategyTitle')}</AlertDialog.Title>
                          <AlertDialog.Description className="dialog-description">
                                {t('deleteExitStrategyDescription')}
                          </AlertDialog.Description>
                          <div className='flex flex-col gap-6 justify-end text-base font-semibold'>
                            <AlertDialog.Action asChild>
                                <Button className="px-14 py-2  bg-red-1 rounded-lg" onClick={removeExitStrategy}>{t('deleteExitStrategy')}</Button>
                            </AlertDialog.Action>
                            <AlertDialog.Cancel asChild>
                                <Button className="alert-dialog-cancel-btn">{t('common:cancel')}</Button>
                            </AlertDialog.Cancel>
                          </div>
                      </AlertDialog.Content>
                  </AlertDialog.Portal>
              </AlertDialog.Root>
        },
        [removeExitStrategy, t],
      )


      const saveExitStrategyButton = useCallback(
        () => {
          return <AlertDialog.Root >
                  <AlertDialog.Trigger asChild>
                      <Button className='bg-blue-1 w-full py-3 rounded-lg font-semibold text-xs md:w-56'>{
                            currentExitStrategy?
                            t('updateExitStrategy')
                            :t('setExitStrategy')
                        }</Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                      <AlertDialog.Overlay className="dialog-overlay data-[state=open]:animate-overlayShow" />
                      <AlertDialog.Content className="dialog-content data-[state=open]:animate-contentShow">
                            <AlertDialog.Title className="dialog-title">
                                {
                                    currentExitStrategy?
                                    t('updateExitStrategyTitle')
                                    :t('createExitStrategyTitle')
                                }
                            </AlertDialog.Title>
                            <AlertDialog.Description className="dialog-description">
                                {
                                    currentExitStrategy?
                                    t('updateExitStrategyDescription')
                                    :t('createExitStrategyDescription')
                                }
                            </AlertDialog.Description>
                          <div className='flex flex-col gap-6 items-center text-base font-semibold'>
                              <AlertDialog.Action asChild>
                                  <Button className=" bg-blue-1 rounded-lg py-2 px-14" onClick={()=>saveExitStrategy()}>{
                                    currentExitStrategy?
                                    t('updateExitStrategy')
                                    :t('setExitStrategy')
                                  }</Button>
                              </AlertDialog.Action>
                              <AlertDialog.Cancel asChild>
                                  <Button className="alert-dialog-cancel-btn">{t('common:cancel')}</Button>
                              </AlertDialog.Cancel>
                          </div>
                      </AlertDialog.Content>
                  </AlertDialog.Portal>
              </AlertDialog.Root>
        },
        [currentExitStrategy, saveExitStrategy, t],
      )


    useEffect(() => {
        setPortfolioChange(0)
    }, [assetChangeType])
    
    useEffect(()=>{
        fetchExitStrategy()
    },[fetchExitStrategy])
  return (
    <Col className='items-start gap-7'>
            <Row className='flex py-5 px-4 bg-black-2 rounded-lg lg:w-1/2 justify-between items-center'>
                <Col className='gap-2 text-sm'>
                    <span className='font-semibold text-white'>{t('currentExitStrategy')}</span>
                    {
                        currentExitStrategy?
                        <span className='text-grey-1 whitespace-pre'>
                            <Trans i18nKey={'smart-allocation:haveExitStrategy'}  
                            
                            components={{blueText:<span className='text-blue-1'/>}}
                            values={{assetChangeType:t(currentExitStrategy.exit_type),
                                assetChangeValue: `${currentExitStrategy.exit_type===EnumExitStrategyTrigger.RisesBy?`${currentExitStrategy.exit_value*100}%`:`${currentExitStrategy.exit_value}$`}`,
                                assetSellPercentage: `${currentExitStrategy.exit_percentage*100}%`
                            }}
                            />
                        </span>
                        :
                        <span className='text-grey-1'>{t('noExitStrategySet')}</span>
                    }
                </Col> 
                {!!currentExitStrategy&&deleteExitStrategyBtn()}
            </Row>
            <Col className='text-sm gap-3 lg:w-2/3'>
                <span className='font-semibold text-white'>{t('smart-allocation:whatIsExitStrategy')}</span>
                <span className='text-grey-1'>{t('exitStrategyDescription')}</span>
            </Col>
            <Col className='gap-5 font-semibold w-full'>
                <span >{t('common:exitStrategy')}</span>
                <div className='flex flex-col gap-6 items-center w-full md:w-auto md:items-start'>
                    <div className='flex flex-col gap-3 items-center px-1 w-full md:w-auto md:flex-row'>
                        <span>{t('whenPortfolio')}</span>
                        {triggerMovement()}
                        {triggerPercentage()}
                        <span className='text-white'>{t('common:sell')}</span>
                        {sellPercentage()}
                    </div>
                    {saveExitStrategyButton()}
                </div>
            </Col>
        </Col>
  )
}

export default SmartAllocationExitStrategy
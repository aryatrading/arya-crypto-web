import React, { useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Button from '../buttons/button'
import CloseIcon from '../../svg/Shared/CloseIcon'
import { InputWithIcon } from '../inputs/Input'
import SearchIcon from '../../svg/Shared/SearchIcon'
import AssetRow from '../AssetRow/AssetRow'
import AssetPnl from '../containers/asset/assetPnl'
import useAssetSearch from '../../../common/hooks/useAssetSearch'
import _ from 'lodash'
import { Col, Row } from '../layout/flex'
import CustomScroll from '../CustomScroll/CustomScroll';
import AssetSelectorSkeleton from './AssetSelectorSkeleton';
import { useTranslation } from 'next-i18next'
import { AssetType } from '../../../types/asset'

interface IAssetSelectorProps {
  onClick:(asset:AssetType)=>void,
  trigger:React.ReactNode
}

const AssetSelector = ({onClick,trigger}:IAssetSelectorProps) => {
  const {fetchingError,filteredAssets,isSearching,debouncedSearch} = useAssetSearch();

  const {t}=useTranslation(['common']);
  
  const renderAssets = useCallback(() => {
    return <Col className='w-full h-full'>
              {
                (filteredAssets===null)?
                <Row className='w-full justify-center items-center h-20 gap-4 font-semibold text-xl text-grey-1'>
                  {t('searchforAsset')}
                </Row>:
                filteredAssets?.length?
                filteredAssets.map((asset) => {
                return <Button onClick={(e)=>onClick(asset)} key={_.uniqueId()} className='flex w-full justify-between py-3 px-2 items-center hover:bg-grey-3  hover:rounded-md'>
                    <AssetRow icon={asset.iconUrl} name={asset.name} symbol={asset.symbol} className='font-semibold'/>
                    <AssetPnl value={asset.pnl} className={` ${(asset.pnl<0)?'text-red-1':'text-green-1'}`}/>
                  </Button>
                  }):
                <Row className='w-full justify-center items-center h-20 gap-4 font-semibold text-xl text-grey-1'>
                  {t('noAssetFound')}
                </Row>
              }
          </Col>
    }
  ,[filteredAssets, onClick, t])


  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[600px] w-[90vw] max-w-[466px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-grey-2 p-7 focus:outline-none font-sans flex flex-col gap-3">
        <div className='flex w-full justify-end items-center'>
          <Dialog.Close asChild>
            <Button
              aria-label="Close"
            >
              <CloseIcon className='stroke-current text-[#89939F] w-3 h-3'/>
            </Button>
          </Dialog.Close>
        </div>
        <div className='flex flex-col gap-6 h-full'>
          <Dialog.Title className="text-mauve12 m-0 text-2xl font-semibold">
            {t('selectAsset')}
          </Dialog.Title>
          <InputWithIcon onChange={debouncedSearch} className='gap-3 bg-grey-3 px-3 py-4 rounded-md text-sm font-semibold focus-within:outline focus-within:outline-1 focus-within:outline-grey-1' placeholder='Search asset' icon={<SearchIcon className='stroke-current text-grey-1 w-3 h-3'/>}/>
          <div className='flex flex-col w-full gap-4'>
            <div className='grid grid-cols-2 font-semibold content-center px-2'>
                <span className='text-start'>{t('name')}</span>
                <span className='text-end'>{t('24change')}</span>
            </div>
            <CustomScroll height='h-80'>
              {isSearching? 
                <AssetSelectorSkeleton/>
              :fetchingError?
                <div className='w-full h-full'>
                  <span className='text-grey-1 text-lg font-semibold'>{t('fetchAssetErr')}</span>       
                </div>
              :renderAssets()}
            </CustomScroll>
          </div>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AssetSelector
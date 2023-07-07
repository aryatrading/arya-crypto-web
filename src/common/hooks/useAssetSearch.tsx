import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useTransition, config } from 'react-spring';

import { MODE_DEBUG } from '../../utils/constants/config';
import { fetchAssets, getTradableAssets } from '../../services/controllers/market';
import { AssetType } from '../../types/asset';
import { selectSelectedExchange } from '../../services/redux/exchangeSlice';


const useAssetSearch = ({showShowOnlyTradableAssets, placeHolderCount,assetCount=20 }: {showShowOnlyTradableAssets?: boolean, placeHolderCount?:number, assetCount?:number }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<boolean>(false);
    const [filteredAssets, setFilteredAssets] = useState<AssetType[] | null>(null);
    const [tradableAssets, setTradableAssets] = useState<AssetType[] | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [placeHolderAsset, setPlaceHolderAsset] = useState<AssetType[]>([])


    const { assetLivePrice } = useSelector((state: any) => state.market);
    const selectedExchange = useSelector(selectSelectedExchange);

    const transitions = useTransition(showDialog, {
        from: { opacity: 0, y: -10 },
        enter: { opacity: 1, y: 0 },
        leave: { opacity: 0, y: -10 },
        config: config.stiff,
    });

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    const fetchTradableAssets = useCallback(() => {
        if (selectedExchange && showShowOnlyTradableAssets) {
            getTradableAssets(selectedExchange.provider_id).then((res) => {
                const data = res.data.filter(asset => !!asset.asset_details); // removing assets without details
                data.sort((a, b) => (a.asset_details?.market_cap_rank ?? 0) - (b.asset_details?.market_cap_rank ?? 0)); // sorting assets based on market cap rank
                if (data) {
                    const newFilteredAssets = data.map<AssetType>((tradableAsset) => ({
                        symbol: tradableAsset.asset_details?.symbol?.toUpperCase(),
                        name: tradableAsset.asset_details?.name,
                        pair: tradableAsset?.symbol,
                        iconUrl: tradableAsset?.asset_details?.image,
                        price: tradableAsset?.asset_details?.current_price,
                        rank: tradableAsset?.asset_details?.market_cap_rank,
                        isTradable: true,
                        currentPrice: tradableAsset?.asset_details?.current_price,
                        pnl: tradableAsset?.asset_details?.price_change_percentage_24h,
                    }));
                    setTradableAssets(newFilteredAssets)
                }
            });
        }
    }, [selectedExchange, showShowOnlyTradableAssets]);

    useEffect(() => {
        if (showShowOnlyTradableAssets) {
            if (searchTerm) {
                setFilteredAssets(() => tradableAssets?.filter(asset => asset.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) || asset.name?.toLowerCase().includes(searchTerm.toLowerCase())) ?? null);
            } else {
                setFilteredAssets(tradableAssets);
            }
        }
    }, [searchTerm, showShowOnlyTradableAssets, tradableAssets]);

    useEffect(()=>{
        setIsSearching(true)
        fetchAssets(placeHolderCount,'','',true).then((res)=>{
            if(res){
                setPlaceHolderAsset(res)
            }
        }).finally(()=>{
            setIsSearching(false)
        })
    },[placeHolderCount])


    const fetchFilteredAssets = useCallback(() => {
        if (!showShowOnlyTradableAssets) {
            setIsSearching(true);
            setFilteredAssets(null);
            if(!searchTerm){
                setFilteredAssets(null)
                setIsSearching(false);
                return
            }
            fetchAssets(assetCount,searchTerm,'',true)
                .then((res) => {
                    if (res)
                        setFilteredAssets(res);
                })
                .catch((error) => {
                    setFetchingError(true);
                    if (MODE_DEBUG) {
                        console.error(error);
                    }
                })
                .finally(() => {
                    setIsSearching(false);
                })
        }
    }, [assetCount, searchTerm, showShowOnlyTradableAssets]);

    const debouncedSearch = useMemo(() => {
        return _.debounce(handleSearch, 500);
    }, [handleSearch]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        }
    }, [debouncedSearch]);

    // Fetch new assets if search term changed
    useEffect(() => {
        fetchFilteredAssets();
    }, [fetchFilteredAssets]);

    useEffect(() => {
        fetchTradableAssets();
    }, [fetchTradableAssets]);

    return { fetchingError, isSearching, filteredAssets, searchTerm, fetchFilteredAssets, debouncedSearch, assetLivePrice, showDialog, setShowDialog, transitions, setSearchTerm, placeHolderAsset}
}

export default useAssetSearch
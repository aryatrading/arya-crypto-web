import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { MODE_DEBUG } from '../../utils/constants/config';
import { fetchAssets } from '../../services/controllers/market';
import _ from 'lodash';
import { AssetType } from '../../types/asset';
import { useSelector } from 'react-redux';

const useAssetSearch = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<boolean>(false);
    const [filteredAssets, setFilteredAssets] = useState<AssetType[] | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const { assetLivePrice } = useSelector((state: any) => state.market);

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    const fetchFilteredAssets = useCallback(() => {
        setIsSearching(true);
        setFilteredAssets(null);
        fetchAssets(searchTerm, searchTerm.length <= 0 ? 10 : 100)
            .then((res) => {
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
    }, [searchTerm]);

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

    return { fetchingError, isSearching, filteredAssets, searchTerm, fetchFilteredAssets, debouncedSearch, assetLivePrice, showDialog, setShowDialog }
}

export default useAssetSearch
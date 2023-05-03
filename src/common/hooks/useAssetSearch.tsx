import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { MODE_DEBUG } from '../../utils/constants/config';
import { fetchAssets } from '../../services/controllers/market';
import _ from 'lodash';
import { AssetType } from '../../types/asset';

const useAssetSearch = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [fetchingError, setFetchingError] = useState<boolean>(false);
    const [filteredAssets, setFilteredAssets] = useState<AssetType[] | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);
    
    const fetchFilteredAssets = useCallback(() => {
        if (searchTerm.length > 0) {
            setIsSearching(true);
            setFilteredAssets(null);
            fetchAssets(searchTerm)
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
        } else {
            setFilteredAssets(null);
        }
    }, [searchTerm]);

    const debouncedSearch = useMemo(() => {
        return _.debounce(handleSearch, 500);
    }, [handleSearch]);
    
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        }
    },[debouncedSearch]);

    // Fetch new assets if search term changed
    useEffect(() => {
        fetchFilteredAssets();
    }, [fetchFilteredAssets]);

    return{fetchingError,isSearching,filteredAssets,searchTerm,fetchFilteredAssets,debouncedSearch}
}

export default useAssetSearch
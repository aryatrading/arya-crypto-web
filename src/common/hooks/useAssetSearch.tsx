import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useTransition, config } from 'react-spring';

import { MODE_DEBUG } from '../../utils/constants/config';
import { fetchAssets } from '../../services/controllers/market';
import { AssetType } from '../../types/asset';


const useAssetSearch = ({ fullModal }: { fullModal: boolean }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<boolean>(false);
    const [filteredAssets, setFilteredAssets] = useState<AssetType[] | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const { assetLivePrice } = useSelector((state: any) => state.market);

    const transitions = useTransition(showDialog, {
        from: { opacity: 0, y: -10 },
        enter: { opacity: 1, y: 0 },
        leave: { opacity: 0, y: -10 },
        config: config.stiff,
    });

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    const fetchFilteredAssets = useCallback(() => {
        setIsSearching(true);
        setFilteredAssets(null);
        fetchAssets(searchTerm, searchTerm.length <= 0 ? fullModal ? 20 : 10 : 100)
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

    return { fetchingError, isSearching, filteredAssets, searchTerm, fetchFilteredAssets, debouncedSearch, assetLivePrice, showDialog, setShowDialog, transitions }
}

export default useAssetSearch
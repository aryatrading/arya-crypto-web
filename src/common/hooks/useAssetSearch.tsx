import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { MODE_DEBUG } from '../../utils/constants/config';
import { fetchAssets } from '../../services/controllers/market';

const useAssetSearch = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [fetchingError, setFetchingError] = useState<boolean>(false);
    const [filteredAssets, setFilteredAssets] = useState<any[] | null>(null);
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

    const onSearchSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchFilteredAssets();
    }, [fetchFilteredAssets]);

    return{fetchingError,filteredAssets,handleSearch,searchTerm,fetchFilteredAssets,onSearchSubmit,isSearching}
}

export default useAssetSearch
import { ReactNode, useState } from "react";
import { MagnifyingGlassIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Image from "next/image";
import clsx from "clsx";

import { Col, Row } from "../layout/flex";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import CloseIcon from "../../svg/Shared/CloseIcon";
import Button from "../buttons/button";
import useAssetSearch from "../../../common/hooks/useAssetSearch";
import { formatNumber } from "../../../utils/helpers/prices";

import styles from './index.module.scss';

interface AssetDropdownTypes {
    onClick?: (x: any) => void,
    t?: any,
    trigger?: ({ searchTerm, debouncedSearch, setSearchTerm, setFocused }: { searchTerm: string, debouncedSearch: any, setSearchTerm: any, setFocused: any }) => ReactNode,
}

export const SearchAssetInput = ({ onClick, t, trigger }: AssetDropdownTypes) => {
    const { searchTerm, isSearching, filteredAssets, debouncedSearch, assetLivePrice, setSearchTerm, placeHolderAsset } = useAssetSearch({ placeHolderCount:5});
    const [focused, setFocused] = useState<boolean>();
    const { push } = useRouter();

    return (
        <Col className={clsx({ "hidden": !trigger }, "relative md:flex")}>
            <Col>
                {trigger ? trigger({ searchTerm, debouncedSearch, setSearchTerm, setFocused }) :
                    <Row className="bg-transparent h-[40px] px-0 items-center md:bg-grey-3 md:px-4 rounded-md overflow-hidden">
                        <MagnifyingGlassIcon width="20px" color="#6B7280" />
                        <input
                            className={clsx({ "w-[350px]": searchTerm !== null, "pr-8": searchTerm !== '' }, "font-bold text-sm text-white bg-transparent flex-1 pl-2 focus:outline-none focus:border-transparent focus:ring-0 border-transparent", searchTerm !== '' ? null : styles['input-wrapper'])}
                            type="text"
                            id="searchInput"
                            maxLength={20}
                            placeholder={t('coin:searchAsset').toString()}
                            onFocus={() => setTimeout(() => setFocused(true), 500)}
                            onBlur={() => {
                                if (searchTerm !== '') {
                                    return;
                                }
                                setTimeout(() => setFocused(false), 200);
                            }}
                            onChange={debouncedSearch} />

                        {searchTerm !== '' && <Button className="p-1.5 bg-black-1ed-xl absolute right-4" onClick={() => {
                            setFocused(false);
                            setSearchTerm('');
                        }}>
                            <CloseIcon className="stroke-current text-[#89939F] w-2 h-2" />
                        </Button>}
                    </Row>
                }
            </Col>
            {focused && <Col className={clsx({ "w-full": trigger, "w-[400px]": !trigger }, "max-h-[300px] bg-grey-2 top-16 right-0 absolute items-center rounded-md overflow-auto p-4 z-50", trigger ? null : styles.list)}>
                {isSearching ? <LoadingSpinner /> :
                    filteredAssets=== null ?
                    placeHolderAsset?.map(coin => {
                        return (
                            <Button className="min-h-[44px] py-1 px-2 cursor-pointer z-50 w-full hover:bg-grey-3 hover:rounded-lg" onClick={() => {
                                if (onClick) {
                                    onClick(coin);
                                } else {
                                    push(`/asset?symbol=${coin?.symbol?.toLowerCase()}`);
                                }
                            }}>
                                <Row className="items-center gap-3 h-full">
                                    <Image src={coin?.iconUrl || ''} alt={coin?.name?.toLocaleLowerCase() + "_icon"} width={22} height={22} />
                                    <Row className="gap-2 items-center flex-1">
                                        <p className="capitalize font-extrabold text-sm inline">{coin?.name}</p>
                                        <p className="capitalize font-medium text-xs text-grey-1">{coin?.symbol}</p>
                                    </Row>
                                    <Row className="items-center justify-center gap-1">
                                        {
                                            coin.pnl < 0
                                                ?
                                                <PlayIcon className="w-2 h-2 fill-red-1 rotate-90 stroke-0" />
                                                :
                                                coin.pnl > 0 ?
                                                    <PlayIcon className={`w-2 h-2  fill-green-1 -rotate-90 stroke-0`} />
                                                    : null
                                        }
                                        <p className={clsx({ "text-red-1": coin.pnl < 0, "text-green-1": coin.pnl > 0, "text-grey-1": coin.pnl === 0 }, "font-bold text-xs tracking-[1px]")}>${formatNumber(assetLivePrice[coin?.symbol || ''] || coin?.currentPrice)}</p>
                                    </Row>
                                </Row>
                            </Button>
                        );
                    }):
                    filteredAssets.length?
                    filteredAssets?.map(coin => {
                        return (
                            <Button className="min-h-[44px] py-1 px-2 cursor-pointer z-50 w-full hover:bg-grey-3 hover:rounded-lg" onClick={() => {
                                if (onClick) {
                                    onClick(coin);
                                } else {
                                    push(`/asset?symbol=${coin?.symbol?.toLowerCase()}`);
                                }
                            }}>
                                <Row className="items-center gap-3 h-full">
                                    <Image src={coin?.iconUrl || ''} alt={coin?.name?.toLocaleLowerCase() + "_icon"} width={22} height={22} />
                                    <Row className="gap-2 items-center flex-1">
                                        <p className="capitalize font-extrabold text-sm inline">{coin?.name}</p>
                                        <p className="capitalize font-medium text-xs text-grey-1">{coin?.symbol}</p>
                                    </Row>
                                    <Row className="items-center justify-center gap-1">
                                        {
                                            coin.pnl < 0
                                                ?
                                                <PlayIcon className="w-2 h-2 fill-red-1 rotate-90 stroke-0" />
                                                :
                                                coin.pnl > 0 ?
                                                    <PlayIcon className={`w-2 h-2  fill-green-1 -rotate-90 stroke-0`} />
                                                    : null
                                        }
                                        <p className={clsx({ "text-red-1": coin.pnl < 0, "text-green-1": coin.pnl > 0, "text-grey-1": coin.pnl === 0 }, "font-bold text-xs tracking-[1px]")}>${assetLivePrice[coin?.symbol || ''] || coin?.currentPrice}</p>
                                    </Row>
                                </Row>
                            </Button>
                        );
                    }):
                    <span className="w-full mx-4 text-center">{t('asset:empty')}<br /><br />{searchTerm}</span>
                        
                }
                {!trigger && <p className="capitalize font-extrabold text-base underline underline-offset-2 text-grey-1 cursor-pointer z-50 text-center mt-10" onClick={() => {
                    push('/market');
                }}>{t('asset:seeMore')}</p>}
            </Col>}
        </Col>
    );
};
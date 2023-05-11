import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon, PlayIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Image from "next/image";
import clsx from "clsx";

import { Col, Row } from "../layout/flex";
import { fetchAssets } from "../../../services/controllers/market";
import { AssetType } from "../../../types/asset";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import Button from "../buttons/button";

import styles from './index.module.scss';
import { useRouter } from "next/router";
import CloseIcon from "../../svg/Shared/CloseIcon";

interface AssetDropdownTypes {
    onClick?: (x: any) => void,
    t?: any,
}

export const SearchAssetInput = ({ onClick, t }: AssetDropdownTypes) => {
    const [coins, setCoins] = useState<AssetType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>('');
    const [focused, setFocused] = useState<boolean>();
    const { push } = useRouter();

    const resultLimit = useMemo(() => keyword !== '' ? 50 : 10, [keyword]);

    useEffect(() => {
        fetchAssets(keyword, resultLimit).then((response: AssetType[]) => {
            setCoins(response);
            setLoading(false);
        }).catch((err) => {
            toast.error(err);
            setLoading(false);
        })
    }, [keyword, resultLimit]);


    const onChangeKeyword = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCoins([]);
        setLoading(true);
        setKeyword(event.target.value);
    }, []);


    return (
        <Col className="relative hidden md:flex">
            <Button onClick={() => {
                if (window?.innerWidth < 768) {
                    const input = document.getElementById('searchInput');
                    input?.focus();
                }
            }}>
                <Row className="bg-transparent h-[40px] px-0 rounded-sm items-center md:bg-grey-3 md:px-4">
                    <MagnifyingGlassIcon width="20px" color="#6B7280" />
                    <input
                        className={clsx({ "w-[350px]": keyword !== null, "pr-8": keyword !== '' }, "font-bold text-sm text-white bg-transparent flex-1 pl-2 focus:outline-none focus:border-transparent focus:ring-0 border-transparent", keyword !== '' ? null : styles['input-wrapper'])}
                        type="text"
                        id="searchInput"
                        value={keyword}
                        maxLength={20}
                        placeholder={t('coin:searchAsset').toString()}
                        onFocus={() => setTimeout(() => setFocused(true), 500)}
                        onBlur={() => {
                            if (keyword !== '') {
                                return;
                            }
                            setTimeout(() => setFocused(false), 100);
                        }}
                        onChange={onChangeKeyword} />

                    {keyword !== '' && <Button className="p-1.5 bg-black-1 rounded-xl absolute right-4" onClick={() => {
                        setKeyword('');
                        setFocused(false);
                    }}>
                        <CloseIcon className="stroke-current text-[#89939F] w-2 h-2" />
                    </Button>}
                </Row>
            </Button>
            {focused && <Col className={clsx("w-[400px] h-[300px] bg-grey-2 top-16 right-0 absolute items-center rounded-md overflow-scroll p-4", styles.list)}>
                {loading ? <LoadingSpinner /> :
                    coins.length === 0 ?
                        <span className="w-full mx-4 text-center">No asset with this keyword!<br /><br />{keyword}</span>
                        :
                        coins.map(coin => {
                            return (
                                <Button className="min-h-[44px] py-1 px-2 cursor-pointer z-50 w-full" onClick={() => {
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
                                            <p className={clsx({ "text-red-1": coin.pnl < 0, "text-green-1": coin.pnl > 0, "text-grey-1": coin.pnl === 0 }, "font-bold text-xs tracking-[1px]")}>USD {coin?.currentPrice}</p>
                                        </Row>
                                    </Row>
                                </Button>
                            );
                        })
                }
            </Col>}
        </Col>
    );
};
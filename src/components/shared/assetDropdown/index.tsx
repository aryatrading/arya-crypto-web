import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Image from "next/image";
import clsx from "clsx";

import { Col, Row } from "../layout/flex";
import { fetchAssets } from "../../../services/controllers/market";
import { AssetType } from "../../../types/asset";
import LoadingSpinner from "../loading-spinner/loading-spinner";

interface AssetDropdownTypes {
  onClick: (x: any) => void;
  trigger?: ReactNode;
  title?: string;
  disabled?: boolean;
  t: any;
  sideOffset?: number;
  align?: "start" | "end" | "center";
  side?: "left" | "right" | "bottom" | "top" | any;
  showTopCoinsList?: boolean;
  showContentHeaderLabel?: boolean;
  contentHeaderLabel?: string;
}

export const AssetDropdown = ({
  onClick,
  trigger,
  title,
  showContentHeaderLabel = true,
  t,
  contentHeaderLabel,
  side,
  sideOffset = 15,
  align,
  showTopCoinsList,
  disabled,
}: AssetDropdownTypes) => {
  const [coins, setCoins] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");

  const resultLimit = useMemo(
    () => (showTopCoinsList ? (keyword !== "" ? 50 : 5) : 50),
    [keyword, showTopCoinsList]
  );

  useEffect(() => {
    fetchAssets(keyword, resultLimit)
      .then((response: AssetType[]) => {
        setCoins(response);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
  }, [keyword, resultLimit]);

  const onChangeKeyword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCoins([]);
      setLoading(true);
      setKeyword(event.target.value);
    },
    []
  );
  const dropdownItem = useCallback(
    (data: any) => {
      return (
        <DropdownMenu.Item
          key={data.id}
          id={data.id + "_" + data?.name}
          className={"h-12 py-1 px-4 cursor-pointer bg-grey-2 z-50"}
          onClick={() => {
            if (onClick) {
              onClick(data);
            }
          }}
        >
          <Row className="items-center gap-3 h-full">
            <Image
              src={data.iconUrl}
              alt={data?.name?.toLocaleLowerCase() + "_icon"}
              width={22}
              height={22}
            />
            <Row className="gap-2 items-center flex-1">
              <p className="capitalize font-extrabold text-sm">{data?.name}</p>
              <p className="capitalize font-medium text-xs">{data?.symbol}</p>
            </Row>
            <Row className="items-center justify-center gap-1">
              {data.pnl < 0 ? (
                <PlayIcon className="w-3 h-3 fill-red-1 rotate-90 stroke-0" />
              ) : data.pnl > 0 ? (
                <PlayIcon
                  className={`w-3 h-3  fill-green-1 -rotate-90 stroke-0`}
                />
              ) : null}
              <p
                className={clsx(
                  {
                    "text-red-1": data.pnl < 0,
                    "text-green-1": data.pnl > 0,
                    "text-grey-1": data.pnl === 0,
                  },
                  "font-bold text-sm tracking-[1px]"
                )}
              >
                USD {data?.currentPrice}
              </p>
            </Row>
          </Row>
        </DropdownMenu.Item>
      );
    },
    [onClick]
  );

  const dropdown = useCallback(() => {
    return (
      <DropdownMenu.Root
        onOpenChange={(opened) => {
          if (!opened) {
            setKeyword("");
          }
        }}
      >
        <DropdownMenu.Trigger asChild disabled={disabled}>
          {trigger || (
            <button
              aria-label="Customise options"
              disabled={disabled}
              className="active:outline-none"
            >
              <Row className="gap-4 items-center">
                <h3 className="font-extrabold text-white">
                  {title || t("coins")}
                </h3>
                {!disabled && (
                  <ChevronDownIcon height="20px" width="20px" color="#fff" />
                )}
              </Row>
            </button>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal className="z-10">
          <DropdownMenu.Content
            className={clsx(
              {
                "min-w-[400px] max-h-[340px]": !showTopCoinsList,
                "min-w-[500px] max-h-[440px]": showTopCoinsList,
              },
              "bg-grey-2 rounded-md overflow-auto z-50"
            )}
            sideOffset={sideOffset}
            align={align}
            side={side}
          >
            <Col
              className={clsx(
                {
                  "p-4": showContentHeaderLabel,
                  "p-2": !showContentHeaderLabel,
                },
                "gap-4 mb-3 absolute bg-grey-2 w-full rounded-lg z-[100]"
              )}
            >
              {showContentHeaderLabel && (
                <h3 className="font-extrabold text-white text-xl">
                  {contentHeaderLabel || t("selectAsset")}
                </h3>
              )}
              <Row className="bg-grey-3 w-full h-[40px] rounded-sm px-4">
                <MagnifyingGlassIcon width="20px" color="#6B7280" />
                <input
                  id="assets search"
                  className="font-bold text-sm text-white bg-transparent flex-1 pl-2 focus:ring-0 border-0"
                  type="text"
                  value={keyword}
                  placeholder={t(
                    showTopCoinsList ? "coin:searchAsset" : "searchAsset"
                  ).toString()}
                  onChange={onChangeKeyword}
                  autoFocus={showTopCoinsList}
                />
              </Row>
            </Col>
            <Col
              className={
                showContentHeaderLabel ? "mt-[120px] z-50" : "mt-[50px] z-50"
              }
            >
              {coins?.map((coin) => dropdownItem(coin))}
              {coins.length === 0 &&
                (loading ? (
                  <Col className="mb-8">
                    <LoadingSpinner />
                  </Col>
                ) : (
                  <h3 className="text-center text-base font-bold text-white mb-4">
                    {t("emptySearch")}
                  </h3>
                ))}
            </Col>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }, [
    align,
    coins,
    contentHeaderLabel,
    disabled,
    dropdownItem,
    keyword,
    loading,
    onChangeKeyword,
    showContentHeaderLabel,
    showTopCoinsList,
    side,
    sideOffset,
    t,
    title,
    trigger,
  ]);

  return dropdown();
};

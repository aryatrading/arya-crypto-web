import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import Image from "next/image";

import { Col, Row } from "../layout/flex";
import { fetchAssets } from "../../../services/controllers/market";
import { AssetType } from "../../../types/asset";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import LoadingSpinner from "../loading-spinner/loading-spinner";

interface AssetDropdownTypes {
  onClick: (x: any) => void;
  trigger?: ReactNode;
  title?: string;
  disabled?: boolean;
  t: any;
}

export const AssetDropdown = (props: AssetDropdownTypes) => {
  const [coins, setCoins] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    fetchAssets(keyword, 50)
      .then((response: AssetType[]) => {
        setCoins(response);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
  }, [keyword]);

  const onChangeKeyword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCoins([]);
      setLoading(true);
      setKeyword(event.target.value);
    },
    []
  );

  const dropdownItem = useCallback((data: any) => {
    return (
      <DropdownMenu.Item
        key={data.id}
        id={data.id + "_" + data?.name}
        className={"h-12 py-1 px-4 cursor-pointer bg-grey-2"}
        onClick={() => {
          if (props.onClick) {
            props.onClick(data);
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
          <Row className="gap-2 items-center">
            <p className="capitalize font-extrabold text-sm">{data?.name}</p>
            <p className="capitalize font-medium text-xs">{data?.symbol}</p>
          </Row>
        </Row>
      </DropdownMenu.Item>
    );
  }, []);

  const dropdown = useCallback(() => {
    return (
      <DropdownMenu.Root
        onOpenChange={(opened) => {
          if (!opened) {
            setKeyword("");
          }
        }}
      >
        <DropdownMenu.Trigger asChild disabled={props.disabled}>
          {props.trigger || (
            <button
              aria-label="Customise options"
              disabled={props.disabled}
              className="active:outline-none"
            >
              <Row className="gap-1 items-center">
                <h3 className="font-extrabold text-white">
                  {props.title || props.t("coins")}
                </h3>
                {!props.disabled && (
                  <ChevronDownIcon height="20px" width="20px" color="#fff" />
                )}
              </Row>
            </button>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal className="z-10">
          <DropdownMenu.Content
            className="min-w-[400px] bg-grey-2 rounded-md max-h-[340px] overflow-scroll"
            sideOffset={15}
          >
            <Col className="gap-4 p-4 mb-3 absolute bg-grey-2 w-full rounded-lg">
              <h3 className="font-extrabold text-white text-xl">
                {props.t("selectAsset")}
              </h3>
              <Row className="bg-grey-3 w-full h-[40px] rounded-sm px-4">
                <MagnifyingGlassIcon width="20px" color="#6B7280" />
                <input
                  id="assets search"
                  className="font-bold text-sm text-white bg-transparent flex-1 pl-2 focus:outline-none border-transparent"
                  type="text"
                  value={keyword}
                  placeholder={props.t("searchAsset").toString()}
                  onChange={onChangeKeyword}
                />
              </Row>
            </Col>
            <Col className="mt-[120px]">
              {coins?.map((coin) => dropdownItem(coin))}
              {coins.length === 0 &&
                (loading ? (
                  <Col className="mb-8">
                    <LoadingSpinner />
                  </Col>
                ) : (
                  <h3 className="text-center text-base font-bold text-white mb-4">
                    {props.t("emptySearch")}
                  </h3>
                ))}
            </Col>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }, [coins, dropdownItem, keyword, loading, onChangeKeyword, props]);

  return dropdown();
};

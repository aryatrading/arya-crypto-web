import React, { FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Row } from "./layout/flex";
import { useDispatch, useSelector } from "react-redux";
import {
  selectConnectedExchanges,
  selectSelectedExchange,
  setSelectedExchange,
} from "../../services/redux/exchangeSlice";
import ExchangeImage from "./exchange-image/exchange-image";
import { setProvider } from "../../services/redux/swapSlice";

export const ProviderDropDown: FC = () => {
  const dispatch = useDispatch();
  const selectedExchange = useSelector(selectSelectedExchange);
  const exchanges = useSelector(selectConnectedExchanges)?.filter(
    (elm) => elm.provider_id !== null
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        asChild
        className="bg-black-1 w-full flex justify-between items-center px-3 py-2 rounded-md"
      >
        <button className="IconButton" aria-label="Customise options">
          <Row className="gap-2 flex items-center">
            {selectedExchange?.provider_id ? (
              <ExchangeImage
                providerId={selectedExchange?.provider_id ?? 0}
                width={15}
                height={15}
              />
            ) : null}

            <p className="font-semibold text-base">
              {selectedExchange?.provider_id
                ? selectedExchange?.name
                : "Select"}
            </p>
          </Row>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="min-w-[410px] bg-white rounded-md p-[5px] bg-black-1">
        {exchanges?.map((elm) => {
          return (
            <DropdownMenu.Item
              onClick={() => {
                dispatch(setProvider(elm.provider_id ?? 0));
                dispatch(setSelectedExchange(elm));
              }}
            >
              <Row className="gap-2">
                <ExchangeImage
                  providerId={elm?.provider_id ?? 1}
                  width={20}
                  height={20}
                />
                <p className="text-black-1 font-semibold text-base">
                  {elm?.name ?? "No Name provided"}
                </p>
              </Row>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

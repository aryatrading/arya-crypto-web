import React, { FC, useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Row } from "./layout/flex";

interface trailingProps {
  type: string;
  onSelect: Function;
}

export const TrailingPicker: FC<trailingProps> = ({ type, onSelect }) => {
  const pickeritems = useMemo(() => {
    return ["Breakeven", "Percentage"];
  }, []);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        asChild
        className="inline-flex items-center text-blue-1 bg-black-2 rounded-md gap-0 w-full md:w-auto md:gap-6"
      >
        <button className="IconButton" aria-label="Customise options">
          <Row className="gap-2 flex items-center">
            <p className="font-semibold text-base">{type}</p>
          </Row>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="w-[--radix-dropdown-menu-trigger-width] flex flex-col bg-black-2 rounded-md p-[5px]"
        align="start"
        sideOffset={2}
      >
        {pickeritems?.map((elm, index) => {
          return (
            <DropdownMenu.Item
              key={index}
              className="text-left px-6 py-3 hover:text-blue-1"
              onClick={() => {
                onSelect(elm);
              }}
            >
              {elm}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

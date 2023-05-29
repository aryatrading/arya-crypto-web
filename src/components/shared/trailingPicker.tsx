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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        asChild
        className="bg-black-1 w-full flex justify-between items-center px-3 py-2 rounded-md"
      >
        <button className="IconButton" aria-label="Customise options">
          <Row className="gap-2 flex items-center">
            <p className="font-semibold text-base">{type}</p>
          </Row>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="min-w-[300px] bg-white rounded-md p-[5px] bg-black-1">
        {pickeritems?.map((elm, index) => {
          return (
            <DropdownMenu.Item
              key={index}
              className="py-3 px-2"
              onClick={() => {
                onSelect(elm);
              }}
            >
              <p className="text-black-1 font-semibold text-base">{elm}</p>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

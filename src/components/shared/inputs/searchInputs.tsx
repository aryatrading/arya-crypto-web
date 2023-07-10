import React from "react";
import { FC } from "react";
import SearchIcon from "../../svg/Shared/SearchIcon";
import { Row } from "../layout/flex";

type SearchInputProps = {
  onchange: Function;
  placeholder: string;
};

export const SearchInput: FC<SearchInputProps> = ({
  onchange,
  placeholder,
}) => {
  return (
    <Row className="flex items-center dark:bg-grey-2 bg-offWhite-3 rounded-lg px-4 gap-1 self-center mt-8 w-full md:w-[343px]">
      <SearchIcon className="w-4 h-4 stroke-grey-1" />
      <input
        type="text"
        id="simple-search"
        autoComplete="off"
        className="text-base text-start block w-full overflow-auto p-2.5 bg-grey-2 placeholder-grey-1 h-[48px] justify-center text-white border-none focus:ring-0 focus:outline-none focus:border-0"
        placeholder={placeholder}
        required
        onChange={(e) => onchange(e.target.value)}
      />
    </Row>
  );
};

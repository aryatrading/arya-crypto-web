import React from "react";
import { FC } from "react";

type SearchInputProps = {
  onchange: Function;
  placeholder: string;
};

export const SearchInput: FC<SearchInputProps> = ({
  onchange,
  placeholder,
}) => {
  return (
    <form className="flex items-center w-1/3">
      <label className="sr-only">Search</label>
      <div className="relative w-full ">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          className="font-medium border border-gray-300 text-gray-1 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-black-1 dark:border-black-2 dark:placeholder-gray-1 dark:text-gray-1 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={placeholder}
          required
          onChange={(e) => onchange(e.target.value)}
        />
      </div>
    </form>
  );
};

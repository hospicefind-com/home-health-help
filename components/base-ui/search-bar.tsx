'use client';

import { Search } from "iconoir-react";
import { useRef } from "react";

type SearchBarProps = {
  value: string;
  onSearchChange: (newQuery: string) => void;
};

export default function SearchBar({ onSearchChange, value }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && inputRef.current) {
      inputRef.current.blur();
    }
  };

  const secondary = 'var(--secondary)';

  return (
    <div
      className="min-w-[150px] sm:max-w-[300px] sm:w-max w-full flex px-4 py-3 bg-background border-2 border-secondary rounded-full text-foreground"
    >
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search by zip"
        className="flex-1 bg-background focus:outline-none "
      />
      <Search color={secondary} />
    </div>
  );
}

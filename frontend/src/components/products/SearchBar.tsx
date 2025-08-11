import React, { useState } from "react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Tìm kiếm sản phẩm...",
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className={`flex space-x-2 ${className}`}>
      <div className="flex-1 relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
      <Button type="submit" variant="outline">
        🔍 Tìm kiếm
      </Button>
    </form>
  );
};

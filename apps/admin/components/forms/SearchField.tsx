import { Search, X } from "lucide-react";
import React, { JSX, useEffect, useRef, useState } from "react";
import { Input } from "@igraph/ui/components/ui/input";
import { useLoading } from "@igraph/utils";
import Loader from "@igraph/ui/components/Loader";

interface SearchFieldProps<T> {
  placeholder?: string;
  onSelect: (item: T | undefined) => void;
  fetchResults: (query: string) => Promise<T[]>;
  getItemLabel: (item: T) => string;
  renderItem?: (item: T) => React.ReactNode;
  defaultItem?: T;
}

const SearchField = <T,>({
  placeholder = "Search...",
  onSelect,
  fetchResults,
  getItemLabel,
  renderItem,
  defaultItem,
}: SearchFieldProps<T>): JSX.Element => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [selected, setSelected] = useState<T | null>(defaultItem || null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    if (defaultItem) {
      setSelected(defaultItem);
      setQuery(getItemLabel(defaultItem));
    }
  }, [defaultItem]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        const data = await fetchResults(query);
        setResults(data);
        setLoading(false);
        setDropdownOpen(data.length > 0);
      } else {
        setResults([]);
        setDropdownOpen(false);
      }
    }, 300);
  }, [query, fetchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: T) => {
    setSelected(item);
    onSelect(item);
    setQuery(getItemLabel(item));
    setDropdownOpen(false);
  };

  const handleDeselect = () => {
    onSelect(undefined);
    setResults([]);
    setQuery("");
    setSelected(null);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div>
        <Input
          disabled={!!selected}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          className={`w-full p-2 pr-10 ${!selected ? "pl-10" : "pl-3"}`}
        />
        {!selected &&
          (loading && query.length > 2 ? (
            <div className="absolute left-2.5 top-2 opacity-40 scale-90">
              <Loader loading={loading} />
            </div>
          ) : (
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          ))}

        {selected && (
          <X
            className="absolute right-3 top-1.5 text-gray-500 hover:text-red-400 cursor-pointer p-1 hover:bg-slate-50 rounded-sm"
            size={27}
            onClick={handleDeselect}
          />
        )}
      </div>
      {isDropdownOpen && results.length > 0 && !!!selected && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
          <ul>
            {results.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="px-3 py-3 rounded-sm flex justify-between cursor-pointer hover:bg-gray-100 text-sm text-gray-700 hover:text-black font-medium"
              >
                {renderItem ? renderItem(item) : getItemLabel(item)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchField;

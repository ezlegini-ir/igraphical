import { Button } from "@igraph/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@igraph/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@igraph/ui/components/ui/popover";
import { cn } from "@igraph/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { JSX, useEffect, useState } from "react";

interface ComboFieldProps<T> {
  options: T[];
  getLabel: (item: T) => JSX.Element;
  getValue: (item: T) => string;
  /** Function that returns a plain text string to be used for search filtering */
  getSearchText: (item: T) => string;
  onSelect: (item: T) => void;
  placeholder?: string;
  defaultValue?: string;
}

const ComboField = <T,>({
  options,
  getLabel,
  getValue,
  getSearchText: getSearchCriteria, // optional prop for search text
  onSelect,
  placeholder = "Select",
  defaultValue,
}: ComboFieldProps<T>) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<T | null>(
    defaultValue
      ? options.find((opt) => getValue(opt) === defaultValue) || null
      : null
  );

  useEffect(() => {
    if (defaultValue) {
      const selectedOption =
        options.find((opt) => getValue(opt) === defaultValue) || null;
      setSelected(selectedOption);
    }
  }, [defaultValue, options]);

  const handleSelect = (item: T) => {
    setSelected(item);
    onSelect(item);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "justify-between w-full px-3",
            !selected && "text-muted-foreground"
          )}
        >
          {selected ? getLabel(selected) : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          {options.length > 1 && (
            <CommandInput
              placeholder="Search..."
              className="h-9"
              onValueChange={(value) => setQuery(value)}
            />
          )}

          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            {options
              .filter((item) =>
                getSearchCriteria(item)
                  .toLowerCase()
                  .split(" ")
                  .join("")
                  .includes(query.toLowerCase().split(" ").join(""))
              )
              .map((item) => (
                <CommandItem
                  key={getValue(item)}
                  value={getSearchCriteria(item)}
                  onSelect={() => handleSelect(item)}
                  className="p-3"
                >
                  {getLabel(item)}
                  <Check
                    className={cn(
                      "ml-auto",
                      selected && getValue(selected) === getValue(item)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboField;

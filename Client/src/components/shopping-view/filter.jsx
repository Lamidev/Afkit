

import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect, useRef, useMemo } from "react"; // Import useMemo
import { Input } from "../ui/input";
import { filterOptions as globalFilterOptions } from "@/config"; // Import global filterOptions

function ProductFilter({
  filters,
  onApplyFilters,
  filterOptions, // This now contains the initial structure, including accessoryCategory
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  isFilterLoading,
  priceRange,
  setPriceRange,
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [minPriceInput, setMinPriceInput] = useState(priceRange?.min === 0 ? "" : priceRange?.min?.toString() ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(priceRange?.max === 5000000 ? "" : priceRange?.max?.toString() ?? "");

  // NEW STATE: For dynamic specific accessory options
  const [dynamicSpecificAccessoryOptions, setDynamicSpecificAccessoryOptions] = useState([]);

  const MIN_PRICE_LIMIT = 0;
  const MAX_PRICE_LIMIT = 5000000;

  const isTypingMinRef = useRef(false);
  const isTypingMaxRef = useRef(false);

  // Sync local state with props
  useEffect(() => {
    setLocalFilters(filters);
    if (!isTypingMinRef.current) {
      setMinPriceInput(priceRange?.min === MIN_PRICE_LIMIT ? "" : priceRange?.min?.toString() ?? "");
    }
    if (!isTypingMaxRef.current) {
      setMaxPriceInput(priceRange?.max === MAX_PRICE_LIMIT ? "" : priceRange?.max?.toString() ?? "");
    }
    setLocalPriceRange(priceRange);
  }, [filters, priceRange]);

  // NEW EFFECT: Dynamically update specific accessory options
  // This watches the 'accessoryCategory' in localFilters
  useEffect(() => {
    const selectedAccessoryCategory = localFilters.accessoryCategory ? localFilters.accessoryCategory[0] : null;

    if (selectedAccessoryCategory && globalFilterOptions.accessories && globalFilterOptions.accessories[selectedAccessoryCategory]) {
      setDynamicSpecificAccessoryOptions(globalFilterOptions.accessories[selectedAccessoryCategory]);
    } else {
      setDynamicSpecificAccessoryOptions([]); // Clear if no accessory category is selected or found
    }
    // IMPORTANT: Also clear the specificAccessory filter if the category changes
    // to avoid filtering by a specific accessory that no longer belongs to the new category
    setLocalFilters(prevFilters => {
      if (prevFilters.specificAccessory && prevFilters.specificAccessory.length > 0 && (!selectedAccessoryCategory || !globalFilterOptions.accessories[selectedAccessoryCategory]?.some(opt => prevFilters.specificAccessory.includes(opt.id)))) {
         const newFilters = { ...prevFilters };
         delete newFilters.specificAccessory; // Clear the specificAccessory filter
         return newFilters;
      }
      return prevFilters;
    });
  }, [localFilters.accessoryCategory]); // Dependency array: re-run when accessoryCategory changes

  // Update price range when inputs change
  useEffect(() => {
    let newMin = parseInt(minPriceInput, 10);
    let newMax = parseInt(maxPriceInput, 10);

    if (minPriceInput === "") newMin = MIN_PRICE_LIMIT;
    if (maxPriceInput === "") newMax = MAX_PRICE_LIMIT;

    if (isNaN(newMin)) newMin = MIN_PRICE_LIMIT;
    if (isNaN(newMax)) newMax = MAX_PRICE_LIMIT;

    newMin = Math.max(MIN_PRICE_LIMIT, Math.min(newMin, MAX_PRICE_LIMIT));
    newMax = Math.max(MIN_PRICE_LIMIT, Math.min(newMax, MAX_PRICE_LIMIT));

    if (!isTypingMinRef.current && !isTypingMaxRef.current) {
      if (newMin > newMax) {
        newMin = newMax;
      }
      if (newMax < newMin) {
        newMax = newMin;
      }
    }

    setLocalPriceRange((prev) => {
      if (prev.min !== newMin || prev.max !== newMax) {
        return { min: newMin, max: newMax };
      }
      return prev;
    });
  }, [minPriceInput, maxPriceInput]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLocalFilter = (getSectionId, getCurrentOption, checked) => {
    let cpyFilters = { ...localFilters };

    // For 'category', 'condition', or 'accessoryCategory' where only one option can be selected
    if (getSectionId === "category" || getSectionId === "condition" || getSectionId === "accessoryCategory") {
      cpyFilters[getSectionId] = checked ? [getCurrentOption] : [];
    }
    // For other filters where multiple options can be selected
    else {
      if (!cpyFilters[getSectionId]) {
        cpyFilters[getSectionId] = [];
      }

      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (checked && indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else if (!checked && indexOfCurrentOption !== -1) {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setLocalFilters(cpyFilters);
  };

  const handleApply = () => {
    let finalMin = parseInt(minPriceInput, 10);
    let finalMax = parseInt(maxPriceInput, 10);

    if (minPriceInput === "") finalMin = MIN_PRICE_LIMIT;
    if (maxPriceInput === "") finalMax = MAX_PRICE_LIMIT;

    if (isNaN(finalMin)) finalMin = MIN_PRICE_LIMIT;
    if (isNaN(finalMax)) finalMax = MAX_PRICE_LIMIT;

    finalMin = Math.max(MIN_PRICE_LIMIT, Math.min(finalMin, MAX_PRICE_LIMIT));
    finalMax = Math.max(MIN_PRICE_LIMIT, Math.min(finalMax, MAX_PRICE_LIMIT));

    if (finalMin > finalMax) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    setLocalPriceRange({ min: finalMin, max: finalMax });
    setMinPriceInput(finalMin === MIN_PRICE_LIMIT ? "" : finalMin.toString());
    setMaxPriceInput(finalMax === MAX_PRICE_LIMIT ? "" : finalMax.toString());

    onApplyFilters(localFilters, { min: finalMin, max: finalMax });
    setIsMobileFilterOpen(false);
    scrollToTop();
  };

  const handleReset = () => {
    setLocalFilters({});
    setLocalPriceRange({ min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
    setMinPriceInput("");
    setMaxPriceInput("");
    setDynamicSpecificAccessoryOptions([]); // Reset dynamic options too

    onApplyFilters({}, { min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
    setIsMobileFilterOpen(false);
    scrollToTop();
  };

  const handlePriceInputChange = (type, value) => {
    const numericValue = value.replace(/\D/g, "");

    if (type === "min") {
      setMinPriceInput(numericValue);
    } else {
      setMaxPriceInput(numericValue);
    }
  };

  const handleMinInputFocus = () => {
    isTypingMinRef.current = true;
  };

  const handleMaxInputFocus = () => {
    isTypingMaxRef.current = true;
  };

  const handleMinInputBlur = () => {
    isTypingMinRef.current = false;
    let parsedMin = parseInt(minPriceInput, 10);

    if (minPriceInput === "") parsedMin = MIN_PRICE_LIMIT;
    if (isNaN(parsedMin)) parsedMin = MIN_PRICE_LIMIT;

    if (parsedMin > localPriceRange.max) {
      parsedMin = localPriceRange.max;
    }

    setLocalPriceRange((prev) => ({
      min: parsedMin,
      max: prev.max,
    }));
    setMinPriceInput(parsedMin === MIN_PRICE_LIMIT ? "" : parsedMin.toString());
  };

  const handleMaxInputBlur = () => {
    isTypingMaxRef.current = false;
    let parsedMax = parseInt(maxPriceInput, 10);

    if (maxPriceInput === "") parsedMax = MAX_PRICE_LIMIT;
    if (isNaN(parsedMax)) parsedMax = MAX_PRICE_LIMIT;

    if (parsedMax < localPriceRange.min) {
      parsedMax = localPriceRange.min;
    }

    setLocalPriceRange((prev) => ({
      min: prev.min,
      max: parsedMax,
    }));
    setMaxPriceInput(parsedMax === MAX_PRICE_LIMIT ? "" : parsedMax.toString());
  };

  const formatKeyForDisplay = (key) => {
    if (key === "accessoryCategory") return "Accessory Type";
    if (key === "specificAccessory") return "Specific Accessory";
    return key
      .replace(/-/g, " ")
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (firstChar) => firstChar.toUpperCase());
  };

  // Filter out priceRange and condition from the dynamic keys to render,
  // and handle 'specificAccessory' dynamically.
  const filterKeysToRender = useMemo(() => {
    return Object.keys(filterOptions).filter(
      (key) => key !== "priceRange" && key !== "condition" && key !== "specificAccessory" // Exclude specificAccessory here
    );
  }, [filterOptions]);


  return (
    <div className={`bg-background rounded-lg shadow-sm h-full ${isMobileFilterOpen ? "" : "block w-full"}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Filters</h2>
        {isMobileFilterOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileFilterOpen(false)}
            className="md:hidden"
            disabled={isFilterLoading}
          >
            {isFilterLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)]">
        {/* Price Range Filter */}
        <div>
          <div className="mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">The highest price is ₦{MAX_PRICE_LIMIT.toLocaleString()}</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-1">
                <span className="text-xl text-muted-foreground">₦</span>
                <div className="relative flex-1 h-12 border border-input rounded-md flex items-center bg-background">
                  <Label
                    htmlFor="min-price"
                    className={`absolute left-3 transition-all duration-200 ease-in-out cursor-text
                      ${(minPriceInput !== "" || isTypingMinRef.current)
                        ? "top-1 text-xs text-muted-foreground italic"
                        : "top-1/2 -translate-y-1/2 text-base text-muted-foreground italic"
                      }`}
                  >
                    From
                  </Label>
                  <Input
                    id="min-price"
                    type="text"
                    inputMode="numeric"
                    value={minPriceInput}
                    onChange={(e) => handlePriceInputChange("min", e.target.value)}
                    onFocus={handleMinInputFocus}
                    onBlur={handleMinInputBlur}
                    className="flex-1 h-full bg-transparent border-none focus:outline-none pl-3 pr-3 pt-4 pb-2 text-foreground"
                    disabled={isFilterLoading}
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-1">
                <span className="text-xl text-muted-foreground">₦</span>
                <div className="relative flex-1 h-12 border border-input rounded-md flex items-center bg-background">
                  <Label
                    htmlFor="max-price"
                    className={`absolute left-3 transition-all duration-200 ease-in-out cursor-text
                      ${(maxPriceInput !== "" || isTypingMaxRef.current)
                        ? "top-1 text-xs text-muted-foreground italic"
                        : "top-1/2 -translate-y-1/2 text-base text-muted-foreground italic"
                      }`}
                  >
                    To
                  </Label>
                  <Input
                    id="max-price"
                    type="text"
                    inputMode="numeric"
                    value={maxPriceInput}
                    onChange={(e) => handlePriceInputChange("max", e.target.value)}
                    onFocus={handleMaxInputFocus}
                    onBlur={handleMaxInputBlur}
                    className="flex-1 h-full bg-transparent border-none focus:outline-none pl-3 pr-3 pt-4 pb-2 text-foreground"
                    disabled={isFilterLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Condition Filter (Always visible) */}
        {filterOptions.condition && filterOptions.condition.length > 0 && (
          <Fragment>
            <div>
              <h3 className="text-base font-semibold">Condition</h3>
              <div className="mt-2 space-y-2">
                {filterOptions.condition.map((optionItem) => (
                  <div key={optionItem.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`condition-${optionItem.id}`}
                      checked={localFilters.condition?.includes(optionItem.id) || false}
                      onCheckedChange={(checked) =>
                        handleLocalFilter("condition", optionItem.id, checked)
                      }
                      disabled={isFilterLoading}
                      className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
                    />
                    <Label htmlFor={`condition-${optionItem.id}`}>{optionItem.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        )}

        {/* Dynamic Category-Specific Filters */}
        {filterKeysToRender.map((keyItem) => {
          const options = filterOptions[keyItem];
          // Ensure options is an array before mapping
          if (!Array.isArray(options) || options.length === 0) return null;

          return (
            <Fragment key={keyItem}>
              <div>
                <h3 className="text-base font-semibold capitalize">
                  {formatKeyForDisplay(keyItem)}
                </h3>
                <div className="mt-2 space-y-2">
                  {options.map((optionItem) => (
                    <div key={optionItem.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`${keyItem}-${optionItem.id}`}
                        checked={localFilters[keyItem]?.includes(optionItem.id) || false}
                        onCheckedChange={(checked) =>
                          handleLocalFilter(keyItem, optionItem.id, checked)
                        }
                        disabled={isFilterLoading}
                        className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
                      />
                      <Label htmlFor={`${keyItem}-${optionItem.id}`}>{optionItem.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </Fragment>
          );
        })}

        {/* NEW: Specific Accessory Filter (dynamically rendered) */}
        {/* Only show this section if accessoryCategory is selected and there are dynamic options */}
        {localFilters.accessoryCategory && localFilters.accessoryCategory.length > 0 && dynamicSpecificAccessoryOptions.length > 0 && (
          <Fragment>
            <div>
              <h3 className="text-base font-semibold capitalize">
                Specific Accessory
              </h3>
              <div className="mt-2 space-y-2">
                {dynamicSpecificAccessoryOptions.map((optionItem) => (
                  <div key={optionItem.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`specificAccessory-${optionItem.id}`}
                      checked={localFilters.specificAccessory?.includes(optionItem.id) || false}
                      onCheckedChange={(checked) =>
                        handleLocalFilter("specificAccessory", optionItem.id, checked)
                      }
                      disabled={isFilterLoading}
                      className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
                    />
                    <Label htmlFor={`specificAccessory-${optionItem.id}`}>{optionItem.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        )}

      </div>

      <div className="p-4 border-t sticky bottom-0 bg-background grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isFilterLoading}
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          disabled={isFilterLoading}
          className="bg-blue-900 hover:bg-blue-800"
        >
          {isFilterLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            "Apply Filters"
          )}
        </Button>
      </div>
    </div>
  );
}

export default ProductFilter;
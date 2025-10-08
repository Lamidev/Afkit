

import { Fragment, useState, useEffect, useRef, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";

function AdminProductFilter({
  filters,
  onApplyFilters,
  onResetFilters,
  onCloseFilter,
  filterOptions,
  priceRange,
  setPriceRange,
  isDropdown = false,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  isFilterLoading,
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [minPriceInput, setMinPriceInput] = useState(
    priceRange?.min === 0 ? "" : priceRange?.min?.toString() ?? ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    priceRange?.max === 5000000 ? "" : priceRange?.max?.toString() ?? ""
  );
  const [dynamicSpecificAccessoryOptions, setDynamicSpecificAccessoryOptions] = useState([]);

  const MIN_PRICE_LIMIT = 0;
  const MAX_PRICE_LIMIT = 5000000;

  const isTypingMinRef = useRef(false);
  const isTypingMaxRef = useRef(false);

  useEffect(() => {
    setLocalFilters(filters);
    if (!isTypingMinRef.current) {
      setMinPriceInput(
        priceRange?.min === MIN_PRICE_LIMIT ? "" : priceRange?.min?.toString() ?? ""
      );
    }
    if (!isTypingMaxRef.current) {
      setMaxPriceInput(
        priceRange?.max === MAX_PRICE_LIMIT ? "" : priceRange?.max?.toString() ?? ""
      );
    }
    setLocalPriceRange(priceRange);
  }, [filters, priceRange]);

  useEffect(() => {
    const selectedAccessoryCategory = localFilters.accessoryCategory?.[0];
    
    if (selectedAccessoryCategory && filterOptions.accessories?.[selectedAccessoryCategory]) {
      setDynamicSpecificAccessoryOptions(
        filterOptions.accessories[selectedAccessoryCategory]
      );
    } else {
      setDynamicSpecificAccessoryOptions([]);
    }
    
    if (localFilters.specificAccessory && 
        (!selectedAccessoryCategory || 
         !filterOptions.accessories?.[selectedAccessoryCategory])) {
      setLocalFilters(prev => {
        const newFilters = {...prev};
        delete newFilters.specificAccessory;
        return newFilters;
      });
    }
  }, [localFilters.accessoryCategory, filterOptions.accessories]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLocalFilter = (getSectionId, getCurrentOption, checked) => {
    let cpyFilters = { ...localFilters };

    if (getSectionId === "category" && checked) {
      const previousCategory = cpyFilters.category?.[0];
      if (previousCategory && previousCategory !== getCurrentOption) {
        const filtersToRemove = ['brand', 'storage', 'ram', 'processor', 'laptopType', 'extraFeatures', 'screenSize', 'frameStyle', 'screenResolution', 'ports', 'monitorType', 'accessoryCategory', 'specificAccessory'];
        filtersToRemove.forEach(filter => {
          delete cpyFilters[filter];
        });
      }
    }

    if (getSectionId === "condition" || getSectionId === "accessoryCategory") {
      cpyFilters[getSectionId] = checked ? [getCurrentOption] : [];
    } else {
      if (!cpyFilters[getSectionId]) {
        cpyFilters[getSectionId] = [];
      }

      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (checked && indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else if (!checked && indexOfCurrentOption !== -1) {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        if (cpyFilters[getSectionId].length === 0) {
          delete cpyFilters[getSectionId];
        }
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
    if (setIsMobileFilterOpen) {
      setIsMobileFilterOpen(false);
    }
    scrollToTop();
  };

  const handleReset = () => {
    setLocalFilters({});
    setLocalPriceRange({ min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
    setMinPriceInput("");
    setMaxPriceInput("");
    setDynamicSpecificAccessoryOptions([]);

    onResetFilters();
    if (setIsMobileFilterOpen) {
      setIsMobileFilterOpen(false);
    }
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

  const filterKeysToRender = useMemo(() => {
    return Object.keys(filterOptions).filter(
      (key) => key !== "priceRange" && key !== "condition" && key !== "specificAccessory" && key !== "accessories"
    );
  }, [filterOptions]);

  return (
    <div className={isDropdown ? "p-4" : "bg-background rounded-lg shadow-sm h-full flex flex-col"}>
      {!isDropdown && (
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Filters</h2>
        </div>
      )}

      <div className={isDropdown ? "space-y-4" : "p-4 space-y-4 flex-1 overflow-y-auto"}>
        <div>
          <div className="space-y-4">
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

        {filterKeysToRender.map((keyItem) => {
          const options = filterOptions[keyItem];
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

        {localFilters.accessoryCategory && 
         localFilters.accessoryCategory.length > 0 && 
         dynamicSpecificAccessoryOptions.length > 0 && (
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

      <div className={isDropdown ? "p-4 border-t bg-muted/50" : "p-4 border-t sticky bottom-0 bg-background grid grid-cols-2 gap-2"}>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isFilterLoading}
          size={isDropdown ? "sm" : "default"}
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          disabled={isFilterLoading}
          size={isDropdown ? "sm" : "default"}
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

export default AdminProductFilter;
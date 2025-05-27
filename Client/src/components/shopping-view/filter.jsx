

// import { Fragment } from "react";
// import { Label } from "../ui/label";
// import { Checkbox } from "../ui/checkbox";
// import { Separator } from "../ui/separator";
// import { X, Loader2 } from "lucide-react";
// import { Button } from "../ui/button";
// import { Slider } from "../ui/slider";
// import { useState, useEffect, useRef } from "react";
// import { Input } from "../ui/input";

// function ProductFilter({
//   filters,
//   onApplyFilters,
//   filterOptions,
//   isMobileFilterOpen,
//   setIsMobileFilterOpen,
//   isFilterLoading,
//   priceRange,
//   setPriceRange,
// }) {
//   const [localFilters, setLocalFilters] = useState(filters);
//   const [localPriceRange, setLocalPriceRange] = useState(priceRange);
//   const [minPriceInput, setMinPriceInput] = useState(priceRange?.min?.toString() ?? '0');
//   const [maxPriceInput, setMaxPriceInput] = useState(priceRange?.max?.toString() ?? '5000000');

//   const MIN_PRICE_LIMIT = 0;
//   const MAX_PRICE_LIMIT = 5000000;

//   const isTypingMinRef = useRef(false);
//   const isTypingMaxRef = useRef(false);

//   useEffect(() => {
//     setLocalFilters(filters);
//     setLocalPriceRange(priceRange);
//     if (!isTypingMinRef.current) {
//       setMinPriceInput(priceRange?.min?.toString() ?? '0');
//     }
//     if (!isTypingMaxRef.current) {
//       setMaxPriceInput(priceRange?.max?.toString() ?? '5000000');
//     }
//   }, [filters, priceRange]);

//   useEffect(() => {
//     let newMin = parseInt(minPriceInput, 10);
//     let newMax = parseInt(maxPriceInput, 10);

//     if (isNaN(newMin)) newMin = MIN_PRICE_LIMIT;
//     if (isNaN(newMax)) newMax = MAX_PRICE_LIMIT;

//     newMin = Math.max(MIN_PRICE_LIMIT, Math.min(newMin, MAX_PRICE_LIMIT));
//     newMax = Math.max(MIN_PRICE_LIMIT, Math.min(newMax, MAX_PRICE_LIMIT));

//     if (!isTypingMinRef.current && !isTypingMaxRef.current) {
//         if (newMin > newMax) {
//             newMin = newMax;
//         }
//         if (newMax < newMin) {
//             newMax = newMin;
//         }
//     }

//     setLocalPriceRange(prev => {
//         if (prev.min !== newMin || prev.max !== newMax) {
//             return { min: newMin, max: newMax };
//         }
//         return prev;
//     });
//   }, [minPriceInput, maxPriceInput]);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth"
//     });
//   };

//   const handleLocalFilter = (getSectionId, getCurrentOption, checked) => {
//     let cpyFilters = { ...localFilters };

//     if (getSectionId === "category" || getSectionId === "condition") {
//       cpyFilters[getSectionId] = checked ? [getCurrentOption] : [];
//     } else {
//       if (!cpyFilters[getSectionId]) {
//         cpyFilters[getSectionId] = [];
//       }

//       const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
//       if (checked && indexOfCurrentOption === -1) {
//         cpyFilters[getSectionId].push(getCurrentOption);
//       } else if (!checked && indexOfCurrentOption !== -1) {
//         cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
//       }
//     }
//     setLocalFilters(cpyFilters);
//   };

//   const handleApply = () => {
//     let finalMin = parseInt(minPriceInput, 10) || MIN_PRICE_LIMIT;
//     let finalMax = parseInt(maxPriceInput, 10) || MAX_PRICE_LIMIT;

//     finalMin = Math.max(MIN_PRICE_LIMIT, Math.min(finalMin, MAX_PRICE_LIMIT));
//     finalMax = Math.max(MIN_PRICE_LIMIT, Math.min(finalMax, MAX_PRICE_LIMIT));

//     if (finalMin > finalMax) {
//       [finalMin, finalMax] = [finalMax, finalMin];
//     }

//     setLocalPriceRange({ min: finalMin, max: finalMax });
//     setMinPriceInput(finalMin.toString());
//     setMaxPriceInput(finalMax.toString());

//     // Call onApplyFilters first
//     onApplyFilters(localFilters, { min: finalMin, max: finalMax });
    
//     // Then close the mobile filter if open
//     setIsMobileFilterOpen(false);
    
//     // Finally scroll to top
//     scrollToTop();
//   };

//   const handleReset = () => {
//     setLocalFilters({});
//     setLocalPriceRange({ min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
//     setMinPriceInput(MIN_PRICE_LIMIT.toString());
//     setMaxPriceInput(MAX_PRICE_LIMIT.toString());
    
//     // Call onApplyFilters first
//     onApplyFilters({}, { min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
    
//     // Then close the mobile filter if open
//     setIsMobileFilterOpen(false);
    
//     // Finally scroll to top
//     scrollToTop();
//   };

//   const handlePriceInputChange = (type, value) => {
//     const numericValue = value.replace(/\D/g, '');

//     if (type === 'min') {
//       setMinPriceInput(numericValue);
//     } else {
//       setMaxPriceInput(numericValue);
//     }
//   };

//   const handleMinInputFocus = () => {
//     isTypingMinRef.current = true;
//     if (minPriceInput === '0') {
//       setMinPriceInput('');
//     }
//   };

//   const handleMaxInputFocus = () => {
//     isTypingMaxRef.current = true;
//     if (maxPriceInput === '0') {
//       setMaxPriceInput('');
//     }
//   };

//   const handleMinInputBlur = () => {
//     isTypingMinRef.current = false;
//     if (minPriceInput === '') {
//       setMinPriceInput('0');
//     }
//     let parsedMin = parseInt(minPriceInput, 10) || MIN_PRICE_LIMIT;
//     let parsedMax = parseInt(maxPriceInput, 10) || MAX_PRICE_LIMIT;

//     if (parsedMin > parsedMax) {
//       parsedMin = parsedMax;
//       setMinPriceInput(parsedMin.toString());
//     }

//     setLocalPriceRange(prev => ({
//         min: parsedMin,
//         max: prev.max
//     }));
//   };

//   const handleMaxInputBlur = () => {
//     isTypingMaxRef.current = false;
//     if (maxPriceInput === '') {
//       setMaxPriceInput('0');
//     }
//     let parsedMin = parseInt(minPriceInput, 10) || MIN_PRICE_LIMIT;
//     let parsedMax = parseInt(maxPriceInput, 10) || MAX_PRICE_LIMIT;

//     if (parsedMax < parsedMin) {
//         parsedMax = parsedMin;
//         setMaxPriceInput(parsedMax.toString());
//     }

//     setLocalPriceRange(prev => ({
//         min: prev.min,
//         max: parsedMax
//     }));
//   };

//   const handlePriceSliderChange = (value) => {
//     setLocalPriceRange({ min: value[0], max: value[1] });
//     setMinPriceInput(value[0].toString());
//     setMaxPriceInput(value[1].toString());
//     isTypingMinRef.current = false;
//     isTypingMaxRef.current = false;
//   };

//   const filterKeys = Object.keys(filterOptions).filter(key => Array.isArray(filterOptions[key]) && key !== 'category');
//   if (filterOptions.category) {
//     filterKeys.unshift('category');
//   }

//   return (
//     <div className={`bg-background rounded-lg shadow-sm h-full ${isMobileFilterOpen ? "" : "block w-full"}`}>
//       <div className="p-4 border-b flex items-center justify-between">
//         <h2 className="text-lg font-extrabold">Filters</h2>
//         {isMobileFilterOpen && (
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setIsMobileFilterOpen(false)}
//             className="md:hidden"
//             disabled={isFilterLoading}
//           >
//             {isFilterLoading ? (
//               <Loader2 className="h-5 w-5 animate-spin" />
//             ) : (
//               <X className="h-5 w-5" />
//             )}
//           </Button>
//         )}
//       </div>

//       <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)]">
//         <div>
//           <h3 className="text-base font-semibold">Price Range</h3>
//           <div className="mt-2 space-y-4">
//             <Slider
//               min={MIN_PRICE_LIMIT}
//               max={MAX_PRICE_LIMIT}
//               step={1000}
//               value={[
//                 localPriceRange?.min ?? MIN_PRICE_LIMIT,
//                 localPriceRange?.max ?? MAX_PRICE_LIMIT,
//               ]}
//               onValueChange={handlePriceSliderChange}
//               className="w-full"
//               disabled={isFilterLoading}
//             />

//             <div className="flex items-center gap-3">
//               <div className="flex-1">
//                 <Label htmlFor="min-price" className="text-xs text-muted-foreground">
//                   Min Price
//                 </Label>
//                 <div className="relative mt-1">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//                     ₦
//                   </span>
//                   <Input
//                     id="min-price"
//                     type="text"
//                     inputMode="numeric"
//                     value={minPriceInput}
//                     onChange={(e) => handlePriceInputChange('min', e.target.value)}
//                     onFocus={handleMinInputFocus}
//                     onBlur={handleMinInputBlur}
//                     className="pl-8"
//                     placeholder="Min"
//                     disabled={isFilterLoading}
//                   />
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <Label htmlFor="max-price" className="text-xs text-muted-foreground">
//                   Max Price
//                 </Label>
//                 <div className="relative mt-1">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//                     ₦
//                   </span>
//                   <Input
//                     id="max-price"
//                     type="text"
//                     inputMode="numeric"
//                     value={maxPriceInput}
//                     onChange={(e) => handlePriceInputChange('max', e.target.value)}
//                     onFocus={handleMaxInputFocus}
//                     onBlur={handleMaxInputBlur}
//                     className="pl-8"
//                     placeholder="Max"
//                     disabled={isFilterLoading}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between text-sm text-muted-foreground">
//               <span>₦{(localPriceRange?.min ?? 0).toLocaleString()}</span>
//               <span>₦{(localPriceRange?.max ?? 5000000).toLocaleString()}</span>
//             </div>
//           </div>
//         </div>

//         <Separator />

//         {filterKeys.map((keyItem) => {
//           const options = filterOptions[keyItem];
//           if (!Array.isArray(options)) return null;

//           return (
//             <Fragment key={keyItem}>
//               <div>
//                 <h3 className="text-base font-semibold capitalize">{keyItem.replace(/-/g, ' ')}</h3>
//                 <div className="mt-2 space-y-2">
//                   {options.map((optionItem) => (
//                     <div key={optionItem.id} className="flex items-center gap-2">
//                       <Checkbox
//                         id={`${keyItem}-${optionItem.id}`}
//                         checked={localFilters[keyItem]?.includes(optionItem.id) || false}
//                         onCheckedChange={(checked) =>
//                           handleLocalFilter(keyItem, optionItem.id, checked)
//                         }
//                         disabled={isFilterLoading}
//                         className="data-[state=checked]:bg-blue-800 data-[state=checked]:border-blue-800"
//                       />
//                       <Label htmlFor={`${keyItem}-${optionItem.id}`}>{optionItem.label}</Label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <Separator />
//             </Fragment>
//           );
//         })}
//       </div>

//       <div className="p-4 border-t sticky bottom-0 bg-background grid grid-cols-2 gap-2">
//         <Button
//           variant="outline"
//           onClick={handleReset}
//           disabled={isFilterLoading}
//         >
//           Reset
//         </Button>
//         <Button
//           onClick={handleApply}
//           disabled={isFilterLoading}
//           className="bg-blue-900 hover:bg-blue-800"
//         >
//           {isFilterLoading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Applying...
//             </>
//           ) : (
//             "Apply Filters"
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default ProductFilter;

import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";

function ProductFilter({
  filters,
  onApplyFilters,
  filterOptions,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  isFilterLoading,
  priceRange,
  setPriceRange,
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [minPriceInput, setMinPriceInput] = useState(priceRange?.min?.toString() ?? '0');
  const [maxPriceInput, setMaxPriceInput] = useState(priceRange?.max?.toString() ?? '5000000');

  const MIN_PRICE_LIMIT = 0;
  const MAX_PRICE_LIMIT = 5000000;

  const isTypingMinRef = useRef(false);
  const isTypingMaxRef = useRef(false);

  useEffect(() => {
    setLocalFilters(filters);
    setLocalPriceRange(priceRange);
    if (!isTypingMinRef.current) {
      setMinPriceInput(priceRange?.min?.toString() ?? '0');
    }
    if (!isTypingMaxRef.current) {
      setMaxPriceInput(priceRange?.max?.toString() ?? '5000000');
    }
  }, [filters, priceRange]);

  useEffect(() => {
    let newMin = parseInt(minPriceInput, 10);
    let newMax = parseInt(maxPriceInput, 10);

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

    setLocalPriceRange(prev => {
        if (prev.min !== newMin || prev.max !== newMax) {
            return { min: newMin, max: newMax };
        }
        return prev;
    });
  }, [minPriceInput, maxPriceInput]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLocalFilter = (getSectionId, getCurrentOption, checked) => {
    let cpyFilters = { ...localFilters };

    if (getSectionId === "category" || getSectionId === "condition") {
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
      }
    }
    setLocalFilters(cpyFilters);
  };

  const handleApply = () => {
    let finalMin = parseInt(minPriceInput, 10) || MIN_PRICE_LIMIT;
    let finalMax = parseInt(maxPriceInput, 10) || MAX_PRICE_LIMIT;

    finalMin = Math.max(MIN_PRICE_LIMIT, Math.min(finalMin, MAX_PRICE_LIMIT));
    finalMax = Math.max(MIN_PRICE_LIMIT, Math.min(finalMax, MAX_PRICE_LIMIT));

    if (finalMin > finalMax) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    setLocalPriceRange({ min: finalMin, max: finalMax });
    setMinPriceInput(finalMin.toString());
    setMaxPriceInput(finalMax.toString());

    // Call onApplyFilters first
    onApplyFilters(localFilters, { min: finalMin, max: finalMax });
    
    // Then close the mobile filter if open
    setIsMobileFilterOpen(false);
    
    // Finally scroll to top
    scrollToTop();
  };

  const handleReset = () => {
    setLocalFilters({});
    setLocalPriceRange({ min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
    setMinPriceInput(MIN_PRICE_LIMIT.toString());
    setMaxPriceInput(MAX_PRICE_LIMIT.toString());
    
    // Call onApplyFilters first
    onApplyFilters({}, { min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
    
    // Then close the mobile filter if open
    setIsMobileFilterOpen(false);
    
    // Finally scroll to top
    scrollToTop();
  };

  const handlePriceInputChange = (type, value) => {
    const numericValue = value.replace(/\D/g, '');

    if (type === 'min') {
      setMinPriceInput(numericValue);
    } else {
      setMaxPriceInput(numericValue);
    }
  };

  const handleMinInputFocus = () => {
    isTypingMinRef.current = true;
    if (minPriceInput === '0') {
      setMinPriceInput('');
    }
  };

  const handleMaxInputFocus = () => {
    isTypingMaxRef.current = true;
    if (maxPriceInput === '0') {
      setMaxPriceInput('');
    }
  };

  const handleMinInputBlur = () => {
    isTypingMinRef.current = false;
    if (minPriceInput === '') {
      setMinPriceInput('0');
    }
    let parsedMin = parseInt(minPriceInput, 10) || MIN_PRICE_LIMIT;
    let parsedMax = parseInt(maxPriceInput, 10) || MAX_PRICE_LIMIT;

    if (parsedMin > parsedMax) {
      parsedMin = parsedMax;
      setMinPriceInput(parsedMin.toString());
    }

    setLocalPriceRange(prev => ({
        min: parsedMin,
        max: prev.max
    }));
  };

  const handleMaxInputBlur = () => {
    isTypingMaxRef.current = false;
    if (maxPriceInput === '') {
      setMaxPriceInput('0');
    }
    let parsedMin = parseInt(minPriceInput, 10) || MIN_PRICE_LIMIT;
    let parsedMax = parseInt(maxPriceInput, 10) || MAX_PRICE_LIMIT;

    if (parsedMax < parsedMin) {
        parsedMax = parsedMin;
        setMaxPriceInput(parsedMax.toString());
    }

    setLocalPriceRange(prev => ({
        min: prev.min,
        max: parsedMax
    }));
  };

  const handlePriceSliderChange = (value) => {
    setLocalPriceRange({ min: value[0], max: value[1] });
    setMinPriceInput(value[0].toString());
    setMaxPriceInput(value[1].toString());
    isTypingMinRef.current = false;
    isTypingMaxRef.current = false;
  };

  const filterKeys = Object.keys(filterOptions).filter(key => Array.isArray(filterOptions[key]) && key !== 'category');
  if (filterOptions.category) {
    filterKeys.unshift('category');
  }

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
        <div>
          <h3 className="text-base font-semibold">Price Range</h3>
          <div className="mt-2 space-y-4">
            <Slider
              min={MIN_PRICE_LIMIT}
              max={MAX_PRICE_LIMIT}
              step={1000}
              value={[
                localPriceRange?.min ?? MIN_PRICE_LIMIT,
                localPriceRange?.max ?? MAX_PRICE_LIMIT,
              ]}
              onValueChange={handlePriceSliderChange}
              className="w-full"
              disabled={isFilterLoading}
            />

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                  Min Price
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₦
                  </span>
                  <Input
                    id="min-price"
                    type="text"
                    inputMode="numeric"
                    value={minPriceInput}
                    onChange={(e) => handlePriceInputChange('min', e.target.value)}
                    onFocus={handleMinInputFocus}
                    onBlur={handleMinInputBlur}
                    className="pl-8"
                    placeholder="Min"
                    disabled={isFilterLoading}
                  />
                </div>
              </div>
              <div className="flex-1">
                <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                  Max Price
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₦
                  </span>
                  <Input
                    id="max-price"
                    type="text"
                    inputMode="numeric"
                    value={maxPriceInput}
                    onChange={(e) => handlePriceInputChange('max', e.target.value)}
                    onFocus={handleMaxInputFocus}
                    onBlur={handleMaxInputBlur}
                    className="pl-8"
                    placeholder="Max"
                    disabled={isFilterLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₦{(localPriceRange?.min ?? 0).toLocaleString()}</span>
              <span>₦{(localPriceRange?.max ?? 5000000).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {filterKeys.map((keyItem) => {
          const options = filterOptions[keyItem];
          if (!Array.isArray(options)) return null;

          return (
            <Fragment key={keyItem}>
              <div>
                <h3 className="text-base font-semibold capitalize">{keyItem.replace(/-/g, ' ')}</h3>
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
                        className="data-[state=checked]:bg-blue-800 data-[state=checked]:border-blue-800"
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
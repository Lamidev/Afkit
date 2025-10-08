

// import { Fragment, useState, useEffect, useRef, useMemo } from "react";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X, Loader2 } from "lucide-react";

// function AdminProductFilter({
//   filters,
//   onApplyFilters,
//   onResetFilters,
//   onCloseFilter,
//   filterOptions,
//   priceRange,
//   setPriceRange,
//   isDropdown = false,
//   isMobileFilterOpen,
//   setIsMobileFilterOpen,
//   isFilterLoading,
// }) {
//   const [localFilters, setLocalFilters] = useState(filters);
//   const [localPriceRange, setLocalPriceRange] = useState(priceRange);
//   const [minPriceInput, setMinPriceInput] = useState(
//     priceRange?.min === 0 ? "" : priceRange?.min?.toString() ?? ""
//   );
//   const [maxPriceInput, setMaxPriceInput] = useState(
//     priceRange?.max === 5000000 ? "" : priceRange?.max?.toString() ?? ""
//   );
//   const [dynamicSpecificAccessoryOptions, setDynamicSpecificAccessoryOptions] = useState([]);

//   const MIN_PRICE_LIMIT = 0;
//   const MAX_PRICE_LIMIT = 5000000;

//   const isTypingMinRef = useRef(false);
//   const isTypingMaxRef = useRef(false);

//   useEffect(() => {
//     setLocalFilters(filters);
//     if (!isTypingMinRef.current) {
//       setMinPriceInput(
//         priceRange?.min === MIN_PRICE_LIMIT ? "" : priceRange?.min?.toString() ?? ""
//       );
//     }
//     if (!isTypingMaxRef.current) {
//       setMaxPriceInput(
//         priceRange?.max === MAX_PRICE_LIMIT ? "" : priceRange?.max?.toString() ?? ""
//       );
//     }
//     setLocalPriceRange(priceRange);
//   }, [filters, priceRange]);

//   useEffect(() => {
//     const selectedAccessoryCategory = localFilters.accessoryCategory?.[0];
    
//     if (selectedAccessoryCategory && filterOptions.accessories?.[selectedAccessoryCategory]) {
//       setDynamicSpecificAccessoryOptions(
//         filterOptions.accessories[selectedAccessoryCategory]
//       );
//     } else {
//       setDynamicSpecificAccessoryOptions([]);
//     }
    
//     if (localFilters.specificAccessory && 
//         (!selectedAccessoryCategory || 
//          !filterOptions.accessories?.[selectedAccessoryCategory])) {
//       setLocalFilters(prev => {
//         const newFilters = {...prev};
//         delete newFilters.specificAccessory;
//         return newFilters;
//       });
//     }
//   }, [localFilters.accessoryCategory, filterOptions.accessories]);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handleLocalFilter = (getSectionId, getCurrentOption, checked) => {
//     let cpyFilters = { ...localFilters };

//     if (getSectionId === "category" && checked) {
//       const previousCategory = cpyFilters.category?.[0];
//       if (previousCategory && previousCategory !== getCurrentOption) {
//         const filtersToRemove = ['brand', 'storage', 'ram', 'processor', 'laptopType', 'extraFeatures', 'screenSize', 'frameStyle', 'screenResolution', 'ports', 'monitorType', 'accessoryCategory', 'specificAccessory'];
//         filtersToRemove.forEach(filter => {
//           delete cpyFilters[filter];
//         });
//       }
//     }

//     if (getSectionId === "condition" || getSectionId === "accessoryCategory") {
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
//         if (cpyFilters[getSectionId].length === 0) {
//           delete cpyFilters[getSectionId];
//         }
//       }
//     }
    
//     setLocalFilters(cpyFilters);
//   };

//   const handleApply = () => {
//     let finalMin = parseInt(minPriceInput, 10);
//     let finalMax = parseInt(maxPriceInput, 10);

//     if (minPriceInput === "") finalMin = MIN_PRICE_LIMIT;
//     if (maxPriceInput === "") finalMax = MAX_PRICE_LIMIT;

//     if (isNaN(finalMin)) finalMin = MIN_PRICE_LIMIT;
//     if (isNaN(finalMax)) finalMax = MAX_PRICE_LIMIT;

//     finalMin = Math.max(MIN_PRICE_LIMIT, Math.min(finalMin, MAX_PRICE_LIMIT));
//     finalMax = Math.max(MIN_PRICE_LIMIT, Math.min(finalMax, MAX_PRICE_LIMIT));

//     if (finalMin > finalMax) {
//       [finalMin, finalMax] = [finalMax, finalMin];
//     }

//     setLocalPriceRange({ min: finalMin, max: finalMax });
//     setMinPriceInput(finalMin === MIN_PRICE_LIMIT ? "" : finalMin.toString());
//     setMaxPriceInput(finalMax === MAX_PRICE_LIMIT ? "" : finalMax.toString());

//     onApplyFilters(localFilters, { min: finalMin, max: finalMax });
//     if (setIsMobileFilterOpen) {
//       setIsMobileFilterOpen(false);
//     }
//     scrollToTop();
//   };

//   const handleReset = () => {
//     setLocalFilters({});
//     setLocalPriceRange({ min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
//     setMinPriceInput("");
//     setMaxPriceInput("");
//     setDynamicSpecificAccessoryOptions([]);

//     onResetFilters();
//     if (setIsMobileFilterOpen) {
//       setIsMobileFilterOpen(false);
//     }
//     scrollToTop();
//   };

//   const handlePriceInputChange = (type, value) => {
//     const numericValue = value.replace(/\D/g, "");

//     if (type === "min") {
//       setMinPriceInput(numericValue);
//     } else {
//       setMaxPriceInput(numericValue);
//     }
//   };

//   const handleMinInputFocus = () => {
//     isTypingMinRef.current = true;
//   };

//   const handleMaxInputFocus = () => {
//     isTypingMaxRef.current = true;
//   };

//   const handleMinInputBlur = () => {
//     isTypingMinRef.current = false;
//     let parsedMin = parseInt(minPriceInput, 10);

//     if (minPriceInput === "") parsedMin = MIN_PRICE_LIMIT;
//     if (isNaN(parsedMin)) parsedMin = MIN_PRICE_LIMIT;

//     if (parsedMin > localPriceRange.max) {
//       parsedMin = localPriceRange.max;
//     }

//     setLocalPriceRange((prev) => ({
//       min: parsedMin,
//       max: prev.max,
//     }));
//     setMinPriceInput(parsedMin === MIN_PRICE_LIMIT ? "" : parsedMin.toString());
//   };

//   const handleMaxInputBlur = () => {
//     isTypingMaxRef.current = false;
//     let parsedMax = parseInt(maxPriceInput, 10);

//     if (maxPriceInput === "") parsedMax = MAX_PRICE_LIMIT;
//     if (isNaN(parsedMax)) parsedMax = MAX_PRICE_LIMIT;

//     if (parsedMax < localPriceRange.min) {
//       parsedMax = localPriceRange.min;
//     }

//     setLocalPriceRange((prev) => ({
//       min: prev.min,
//       max: parsedMax,
//     }));
//     setMaxPriceInput(parsedMax === MAX_PRICE_LIMIT ? "" : parsedMax.toString());
//   };

//   const formatKeyForDisplay = (key) => {
//     if (key === "accessoryCategory") return "Accessory Type";
//     if (key === "specificAccessory") return "Specific Accessory";
//     return key
//       .replace(/-/g, " ")
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, (firstChar) => firstChar.toUpperCase());
//   };

//   const filterKeysToRender = useMemo(() => {
//     return Object.keys(filterOptions).filter(
//       (key) => key !== "priceRange" && key !== "condition" && key !== "specificAccessory" && key !== "accessories"
//     );
//   }, [filterOptions]);

//   return (
//     <div className={isDropdown ? "p-4" : "bg-background rounded-lg shadow-sm h-full flex flex-col"}>
//       {!isDropdown && (
//         <div className="p-4 border-b flex items-center justify-between">
//           <h2 className="text-lg font-extrabold">Filters</h2>
//         </div>
//       )}

//       <div className={isDropdown ? "space-y-4" : "p-4 space-y-4 flex-1 overflow-y-auto"}>
//         <div>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-base font-semibold">The highest price is ₦{MAX_PRICE_LIMIT.toLocaleString()}</h3>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="flex-1 flex items-center gap-1">
//                 <span className="text-xl text-muted-foreground">₦</span>
//                 <div className="relative flex-1 h-12 border border-input rounded-md flex items-center bg-background">
//                   <Label
//                     htmlFor="min-price"
//                     className={`absolute left-3 transition-all duration-200 ease-in-out cursor-text
//                       ${(minPriceInput !== "" || isTypingMinRef.current)
//                         ? "top-1 text-xs text-muted-foreground italic"
//                         : "top-1/2 -translate-y-1/2 text-base text-muted-foreground italic"
//                       }`}
//                   >
//                     From
//                   </Label>
//                   <Input
//                     id="min-price"
//                     type="text"
//                     inputMode="numeric"
//                     value={minPriceInput}
//                     onChange={(e) => handlePriceInputChange("min", e.target.value)}
//                     onFocus={handleMinInputFocus}
//                     onBlur={handleMinInputBlur}
//                     className="flex-1 h-full bg-transparent border-none focus:outline-none pl-3 pr-3 pt-4 pb-2 text-foreground"
//                     disabled={isFilterLoading}
//                   />
//                 </div>
//               </div>
//               <div className="flex-1 flex items-center gap-1">
//                 <span className="text-xl text-muted-foreground">₦</span>
//                 <div className="relative flex-1 h-12 border border-input rounded-md flex items-center bg-background">
//                   <Label
//                     htmlFor="max-price"
//                     className={`absolute left-3 transition-all duration-200 ease-in-out cursor-text
//                       ${(maxPriceInput !== "" || isTypingMaxRef.current)
//                         ? "top-1 text-xs text-muted-foreground italic"
//                         : "top-1/2 -translate-y-1/2 text-base text-muted-foreground italic"
//                       }`}
//                   >
//                     To
//                   </Label>
//                   <Input
//                     id="max-price"
//                     type="text"
//                     inputMode="numeric"
//                     value={maxPriceInput}
//                     onChange={(e) => handlePriceInputChange("max", e.target.value)}
//                     onFocus={handleMaxInputFocus}
//                     onBlur={handleMaxInputBlur}
//                     className="flex-1 h-full bg-transparent border-none focus:outline-none pl-3 pr-3 pt-4 pb-2 text-foreground"
//                     disabled={isFilterLoading}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <Separator />

//         {filterOptions.condition && filterOptions.condition.length > 0 && (
//           <Fragment>
//             <div>
//               <h3 className="text-base font-semibold">Condition</h3>
//               <div className="mt-2 space-y-2">
//                 {filterOptions.condition.map((optionItem) => (
//                   <div key={optionItem.id} className="flex items-center gap-2">
//                     <Checkbox
//                       id={`condition-${optionItem.id}`}
//                       checked={localFilters.condition?.includes(optionItem.id) || false}
//                       onCheckedChange={(checked) =>
//                         handleLocalFilter("condition", optionItem.id, checked)
//                       }
//                       disabled={isFilterLoading}
//                       className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
//                     />
//                     <Label htmlFor={`condition-${optionItem.id}`}>{optionItem.label}</Label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Separator />
//           </Fragment>
//         )}

//         {filterKeysToRender.map((keyItem) => {
//           const options = filterOptions[keyItem];
//           if (!Array.isArray(options) || options.length === 0) return null;

//           return (
//             <Fragment key={keyItem}>
//               <div>
//                 <h3 className="text-base font-semibold capitalize">
//                   {formatKeyForDisplay(keyItem)}
//                 </h3>
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
//                         className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
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

//         {localFilters.accessoryCategory && 
//          localFilters.accessoryCategory.length > 0 && 
//          dynamicSpecificAccessoryOptions.length > 0 && (
//           <Fragment>
//             <div>
//               <h3 className="text-base font-semibold capitalize">
//                 Specific Accessory
//               </h3>
//               <div className="mt-2 space-y-2">
//                 {dynamicSpecificAccessoryOptions.map((optionItem) => (
//                   <div key={optionItem.id} className="flex items-center gap-2">
//                     <Checkbox
//                       id={`specificAccessory-${optionItem.id}`}
//                       checked={localFilters.specificAccessory?.includes(optionItem.id) || false}
//                       onCheckedChange={(checked) =>
//                         handleLocalFilter("specificAccessory", optionItem.id, checked)
//                       }
//                       disabled={isFilterLoading}
//                       className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
//                     />
//                     <Label htmlFor={`specificAccessory-${optionItem.id}`}>{optionItem.label}</Label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Separator />
//           </Fragment>
//         )}
//       </div>

//       <div className={isDropdown ? "p-4 border-t bg-muted/50" : "p-4 border-t sticky bottom-0 bg-background grid grid-cols-2 gap-2"}>
//         <Button
//           variant="outline"
//           onClick={handleReset}
//           disabled={isFilterLoading}
//           size={isDropdown ? "sm" : "default"}
//         >
//           Reset
//         </Button>
//         <Button
//           onClick={handleApply}
//           disabled={isFilterLoading}
//           size={isDropdown ? "sm" : "default"}
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

// export default AdminProductFilter;



import {
  sortOptions,
  categoryOptionsMap,
  getFilterOptionsForCategory,
} from "@/config";
import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  SlidersHorizontal,
  MessageCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useMemo } from "react";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSearchParams, useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getOrCreateSessionId } from "@/components/utils/session";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-hightolow"); // Default set to high to low
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [minimumLoaderTime, setMinimumLoaderTime] = useState(false);
  const [showWhatsAppHint, setShowWhatsAppHint] = useState(false);

  // Custom dropdown states
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isMobileSortDropdownOpen, setIsMobileSortDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 5000000,
  });

  const abortControllerRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // WhatsApp configuration
  const WHATSAPP_NUMBER = "2348164014304";
  const COMPANY_NAME = "Afkit";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleWhatsAppRedirect = () => {
    const category = searchParams.get("category");
    const message = category 
      ? `Hi ${COMPANY_NAME}, I'm browsing your ${categoryOptionsMap[category] || category} category but couldn't find what I need. Can you help me?`
      : `Hi ${COMPANY_NAME}, I'm browsing your products but couldn't find what I'm looking for. Can you help me?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Show WhatsApp hint when no products are found
  useEffect(() => {
    if (!isFilterLoading && !minimumLoaderTime && productList.length === 0) {
      const timer = setTimeout(() => {
        setShowWhatsAppHint(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowWhatsAppHint(false);
    }
  }, [isFilterLoading, minimumLoaderTime, productList.length]);

  const currentFilterOptions = useMemo(() => {
    const categoryFromUrl = searchParams.get("category") || "all-products";
    return getFilterOptionsForCategory(categoryFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = user?.id;
        const sessionId = userId ? null : getOrCreateSessionId();

        if (!userId && !sessionId) {
          return;
        }

        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        if (!user) {
          localStorage.removeItem("guestSessionId");
        }
      }
    };
    fetchCart();
  }, [dispatch, user]);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsFilterLoading(true);
    setMinimumLoaderTime(true);
    const startTime = Date.now();

    setCurrentPage(1);

    const params = Object.fromEntries(searchParams.entries());
    const initialFilters = {};
    let initialMinPrice = 0;
    let initialMaxPrice = 5000000;
    let initialSort = "price-hightolow"; // Changed from "latest-arrival" to "price-hightolow"

    for (const [key, value] of Object.entries(params)) {
      if (key === "minPrice") {
        initialMinPrice = parseInt(value) || 0;
      } else if (key === "maxPrice") {
        initialMaxPrice = parseInt(value) || 5000000;
      } else if (key === "sort") {
        initialSort = value;
      } else if (value.includes(",")) {
        initialFilters[key] = value.split(",");
      } else {
        initialFilters[key] = [value];
      }
    }

    if (searchParams.has("category") && !initialFilters.category) {
      initialFilters.category = [searchParams.get("category")];
    }

    setFilters(initialFilters);
    setPriceRange({ min: initialMinPrice, max: initialMaxPrice });
    setSort(initialSort);

    dispatch(
      fetchAllFilteredProducts({
        filterParams: initialFilters,
        sortParams: initialSort,
        priceRange: { min: initialMinPrice, max: initialMaxPrice },
        signal: abortController.signal,
      })
    ).finally(() => {
      if (!abortController.signal.aborted) {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsed);

        setTimeout(() => {
          setIsFilterLoading(false);
          setMinimumLoaderTime(false);
          setIsMobileFilterOpen(false);
        }, remainingTime);
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      abortController.abort();
    };
  }, [dispatch, searchParams]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  function handleSort(value) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsFilterLoading(true);
    setMinimumLoaderTime(true);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("sort", value);

    setSearchParams(newSearchParams);
    setIsSortDropdownOpen(false);
    setIsMobileSortDropdownOpen(false);
  }

  const onApplyFilters = (newFilters, newPriceRange) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsFilterLoading(true);
    setMinimumLoaderTime(true);

    const newSearchParams = new URLSearchParams();

    if (newFilters.category?.length > 0) {
      newSearchParams.set("category", newFilters.category[0]);
    }

    Object.keys(newFilters).forEach(key => {
      if (key !== "category" && newFilters[key]?.length > 0) {
        newSearchParams.set(key, newFilters[key].join(","));
      }
    });

    if (newPriceRange.min !== 0) {
      newSearchParams.set("minPrice", newPriceRange.min.toString());
    }
    if (newPriceRange.max !== 5000000) {
      newSearchParams.set("maxPrice", newPriceRange.max.toString());
    }

    if (sort !== "price-hightolow") { // Changed from "latest-arrival" to "price-hightolow"
      newSearchParams.set("sort", sort);
    }

    setSearchParams(newSearchParams);
    setIsMobileFilterOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewProductDetails = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const handleAddToCart = async (getCurrentProductId, getTotalStock) => {
    try {
      const userId = user?.id;
      const sessionId = userId ? null : getOrCreateSessionId();

      if (!userId && !sessionId) {
        toast.error("Session information missing. Please try again.", {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      const currentCartItems = cartItems?.items || [];
      const existingItem = currentCartItems.find(
        (item) => item.productId === getCurrentProductId
      );

      if (existingItem && existingItem.quantity >= getTotalStock) {
        toast.error(`Maximum available quantity (${getTotalStock}) reached`, {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      const response = await dispatch(
        addToCart({
          userId,
          productId: getCurrentProductId,
          quantity: 1,
          sessionId,
        })
      ).unwrap();

      if (response.success) {
        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
        toast.success("Product added to cart!", {
          icon: <CheckCircle className="text-green-500" />,
        });
      } else {
        toast.error(response.message || "Failed to add product to cart.", {
          icon: <AlertCircle className="text-red-500" />,
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to add product to cart.");
    }
  };

  const handleClearCategory = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsFilterLoading(true);
    setMinimumLoaderTime(true);

    const newSearchParams = new URLSearchParams();
    if (sort !== "price-hightolow") { // Changed from "latest-arrival" to "price-hightolow"
      newSearchParams.set("sort", sort);
    }

    setSearchParams(newSearchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productList.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(productList.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / 3) * 3;
    return new Array(Math.min(3, totalPages - start))
      .fill()
      .map((_, idx) => start + idx + 1);
  };

  const pageTitle = searchParams.get("category")
    ? categoryOptionsMap[searchParams.get("category")] || "Products"
    : "All Products";

  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find(option => option.id === sort);
    return currentOption ? currentOption.label : "Sort By";
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:hidden flex justify-between items-center mb-4">
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 mr-2 flex items-center justify-center space-x-2 border-r pr-2"
                disabled={isFilterLoading || minimumLoaderTime}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[80vw] sm:max-w-xs md:max-w-sm overflow-y-auto"
            >
              <ProductFilter
                filters={filters}
                onApplyFilters={onApplyFilters}
                filterOptions={currentFilterOptions}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                isFilterLoading={isFilterLoading || minimumLoaderTime}
                setIsMobileFilterOpen={setIsMobileFilterOpen}
              />
            </SheetContent>
          </Sheet>

          {/* Mobile Custom Dropdown */}
          <div className="flex-1 ml-2 relative" ref={mobileDropdownRef}>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
              onClick={() => setIsMobileSortDropdownOpen(!isMobileSortDropdownOpen)}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{getCurrentSortLabel()}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {isMobileSortDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${
                        sort === option.id ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                      onClick={() => handleSort(option.id)}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        sort === option.id ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row">
          <div className="hidden sm:block w-full sm:w-1/4 pr-0 sm:pr-8 mb-6 sm:mb-0">
            <ProductFilter
              filters={filters}
              onApplyFilters={onApplyFilters}
              filterOptions={currentFilterOptions}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              isFilterLoading={isFilterLoading || minimumLoaderTime}
              setIsMobileFilterOpen={setIsMobileFilterOpen}
            />
          </div>

          <div className="w-full sm:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                {pageTitle}
                {searchParams.has("category") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCategory}
                    className="ml-4 text-red-500 hover:text-red-700"
                    disabled={isFilterLoading || minimumLoaderTime}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Clear Category
                  </Button>
                )}
              </h2>
              
              {/* Desktop Custom Dropdown */}
              <div className="hidden sm:block relative" ref={dropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span>{getCurrentSortLabel()}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {isSortDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 min-w-[200px]">
                    <div className="p-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${
                            sort === option.id ? 'bg-blue-50 text-blue-700' : ''
                          }`}
                          onClick={() => handleSort(option.id)}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            sort === option.id ? 'bg-blue-600' : 'bg-gray-300'
                          }`} />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isFilterLoading || minimumLoaderTime ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
              </div>
            ) : (
              <>
                {currentProducts && currentProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {currentProducts.map((productItem, index) => (
                        <motion.div
                          key={productItem._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <ShoppingProductTile
                            product={productItem}
                            handleAddToCart={handleAddToCart}
                            handleViewDetails={handleViewProductDetails}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      className="mt-12 text-center border-t pt-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <p className="text-gray-600 mb-4">
                        Couldn't find what you're looking for?
                      </p>
                      <Button
                        onClick={handleWhatsAppRedirect}
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Ask us on WhatsApp
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <div className="mb-6">
                      <p className="text-lg mb-4">No products found matching your criteria.</p>
                      <p className="text-sm text-gray-500 mb-6">
                        Try adjusting your filters or browse different categories.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={handleClearCategory}
                        >
                          Clear Filters
                        </Button>
                        <Button
                          onClick={handleWhatsAppRedirect}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Ask on WhatsApp
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showWhatsAppHint && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto"
                        >
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                              <h3 className="font-semibold text-blue-900 mb-1">
                                Need something specific?
                              </h3>
                              <p className="text-blue-700 text-sm mb-3">
                                We might have exactly what you're looking for! Message us on WhatsApp and we'll help you find the perfect product.
                              </p>
                              <Button
                                onClick={handleWhatsAppRedirect}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Contact us on WhatsApp
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {productList.length > productsPerPage && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={isPrevDisabled}
                      variant="outline"
                      size="icon"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {getPaginationGroup().map((item) => (
                      <Button
                        key={item}
                        onClick={() => paginate(item)}
                        variant={currentPage === item ? "default" : "outline"}
                        className={
                          currentPage === item ? "bg-blue-900 text-white" : ""
                        }
                      >
                        {item}
                      </Button>
                    ))}
                    <Button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={isNextDisabled}
                      variant="outline"
                      size="icon"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
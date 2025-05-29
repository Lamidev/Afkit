

import {  sortOptions, categoryOptionsMap, getFilterOptionsForCategory } from "@/config";
import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2, CheckCircle, AlertCircle, XCircle, SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useMemo } from "react";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSearchParams, useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getOrCreateSessionId } from "@/components/utils/session";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categorySearchParams = searchParams.get("category"); // This will be the active category (e.g., "smartphones" or null for "all-products")

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [minimumLoaderTime, setMinimumLoaderTime] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  // const [isLoading, setIsLoading] = useState(false); // This state isn't used. Can be removed if not needed elsewhere.

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 5000000,
  });

  const isInitialMount = useRef(true);
  const abortControllerRef = useRef(null);

  // --- Use getFilterOptionsForCategory from config.js ---
  const currentFilterOptions = useMemo(() => {
    // Pass the category from search params, or "all-products" if none is specified
    return getFilterOptionsForCategory(categorySearchParams || "all-products");
  }, [categorySearchParams]);

  // Cart initialization
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = user?.id;
        const sessionId = userId ? null : getOrCreateSessionId();

        if (!userId && !sessionId) {
          console.warn("No user or session info available");
          return;
        }

        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        if (!user) {
          localStorage.removeItem('guestSessionId');
        }
      }
    };
    fetchCart();
  }, [dispatch, user]);

  // Main data fetching effect (Triggers on initial load and categorySearchParams change)
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsFilterLoading(true);
    setMinimumLoaderTime(true);
    const startTime = Date.now();

    setCurrentPage(1); // Reset page on category change or initial load

    // Initialize filters based on the current categorySearchParams
    const initialFilters = {};
    if (categorySearchParams) {
      initialFilters.category = [categorySearchParams];
    } else {
      // If no category in URL, clear any category filter that might be present
      // from a previous navigation or reset action.
      // This ensures "all-products" doesn't implicitly filter by a category.
      delete initialFilters.category;
    }

    setFilters(initialFilters);
    setSort("price-lowtohigh");
    setPriceRange({ min: 0, max: 5000000 });

    dispatch(
      fetchAllFilteredProducts({
        filterParams: initialFilters, // Use the dynamically set initialFilters
        sortParams: "price-lowtohigh",
        priceRange: { min: 0, max: 5000000 },
        signal: abortController.signal
      })
    ).finally(() => {
      if (!abortController.signal.aborted) {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsed);

        setTimeout(() => {
          setIsFilterLoading(false);
          setMinimumLoaderTime(false);
          setIsMobileFilterOpen(false); // Ensure the sheet is closed on initial load/category change
        }, remainingTime);
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Mark as not initial mount after the first render cycle completes.
    // This isn't strictly necessary for the logic here, but good practice if you had
    // conditional logic based on initial mount elsewhere.
    isInitialMount.current = false;

    return () => {
      abortController.abort();
    };
  }, [dispatch, categorySearchParams]); // Rerun when categorySearchParams changes

  // Clean up abort controller on unmount
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

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsFilterLoading(true);
    setMinimumLoaderTime(true);
    setSort(value);

    const startTime = Date.now();
    dispatch(
      fetchAllFilteredProducts({
        filterParams: filters,
        sortParams: value,
        priceRange,
        signal: abortController.signal
      })
    ).finally(() => {
      if (!abortController.signal.aborted) {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsed);
        setTimeout(() => setMinimumLoaderTime(false), remainingTime);
        setIsFilterLoading(false);
      }
    });
  }

  const onApplyFilters = (newFilters, newPriceRange) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsFilterLoading(true);
    setMinimumLoaderTime(true);

    const categoryFilterValue = newFilters.category && newFilters.category.length > 0
      ? newFilters.category[0]
      : null;

    // --- Logic to update URL search params for category ---
    if (categoryFilterValue && categoryFilterValue !== categorySearchParams) {
      // Category selected and it's different from current URL param
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("category", categoryFilterValue);
      setSearchParams(newSearchParams); // This will trigger the main useEffect
    } else if (!categoryFilterValue && categorySearchParams) {
      // Category filter was cleared while a category param existed
      setSearchParams({}); // Clear the category search param
    } else {
      // Category param remains the same or no category filter was involved,
      // so proceed with dispatching the fetch action directly.
      // This is for other filters (brand, storage, etc.) or price range.
      setFilters(newFilters);
      setPriceRange(newPriceRange);
      sessionStorage.setItem("filters", JSON.stringify(newFilters)); // Consider storing priceRange too if you want it persistent

      const startTime = Date.now();
      dispatch(
        fetchAllFilteredProducts({
          filterParams: newFilters,
          sortParams: sort,
          priceRange: newPriceRange,
          signal: abortController.signal
        })
      ).finally(() => {
        if (!abortController.signal.aborted) {
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, 500 - elapsed);
          setTimeout(() => setMinimumLoaderTime(false), remainingTime);
          setIsFilterLoading(false);
        }
      });
    }
    // If the URL is updated, the useEffect for categorySearchParams will handle the actual filter dispatch.
    // If not, the dispatch happens immediately in this else block.
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
        item => item.productId === getCurrentProductId
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
    if (categorySearchParams) {
      setSearchParams({}); // Clear the 'category' search parameter
      // The useEffect listening to categorySearchParams will handle re-fetching products
      // and resetting filters to default ("all-products" state).
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productList.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / 3) * 3;
    return new Array(Math.min(3, totalPages - start)).fill().map((_, idx) => start + idx + 1);
  };

  const pageTitle = categorySearchParams
    ? categoryOptionsMap[categorySearchParams] || "Products"
    : "All Products";

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter & Sort Controls - Only visible on mobile */}
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
            <SheetContent side="right" className="w-[80vw] sm:max-w-xs md:max-w-sm overflow-y-auto">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 ml-2 flex items-center justify-center space-x-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort By</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.id} value={option.id}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col sm:flex-row">
          {/* Desktop Filters - Only visible on desktop */}
          <div className="hidden sm:block w-full sm:w-1/4 pr-0 sm:pr-8 mb-6 sm:mb-0">
            <ProductFilter
              filters={filters}
              onApplyFilters={onApplyFilters}
              filterOptions={currentFilterOptions} 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              isFilterLoading={isFilterLoading || minimumLoaderTime}
              // currentCategory is not needed in ProductFilter anymore as filterOptions is already specific
            />
          </div>

          {/* Product Listing */}
          <div className="w-full sm:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                {pageTitle}
                {categorySearchParams && (
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
              {/* Desktop Sort By - Only visible on desktop */}
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Sort By</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                      {sortOptions.map((option) => (
                        <DropdownMenuRadioItem key={option.id} value={option.id}>
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {(isFilterLoading || minimumLoaderTime) ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
              </div>
            ) : (
              <>
                {currentProducts && currentProducts.length > 0 ? (
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
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No products found matching your criteria.
                  </div>
                )}

                {/* Pagination */}
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
                        className={currentPage === item ? "bg-blue-900 text-white" : ""}
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




import {
  sortOptions,
  categoryOptionsMap,
  getFilterOptionsForCategory,
} from "@/config";
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
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";
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
  const [sort, setSort] = useState("latest-arrival");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [minimumLoaderTime, setMinimumLoaderTime] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 5000000,
  });

  const abortControllerRef = useRef(null);

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
    let initialSort = "latest-arrival";

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

    if (sort !== "latest-arrival") {
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
    if (sort !== "latest-arrival") {
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 ml-2 flex items-center justify-center space-x-2"
              >
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
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Sort By</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={handleSort}
                    >
                      {sortOptions.map((option) => (
                        <DropdownMenuRadioItem
                          key={option.id}
                          value={option.id}
                        >
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isFilterLoading || minimumLoaderTime ? (
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
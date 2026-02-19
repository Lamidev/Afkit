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
  ChevronDown,
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
import RecentlyViewed from "@/components/shopping-view/recently-viewed";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [minimumLoaderTime, setMinimumLoaderTime] = useState(false);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isMobileSortDropdownOpen, setIsMobileSortDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(() => {
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    return pageFromUrl;
  });
  const [productsPerPage] = useState(12);

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 5000000,
  });

  const abortControllerRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const WHATSAPP_NUMBER = "2348164014304";
  const COMPANY_NAME = "Afkit";

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

  const scrollToTop = () => {
    try {
      window.scrollTo(0, 0);
      
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        const scrollDuration = 300;
        const scrollStep = -window.scrollY / (scrollDuration / 15);
        
        const scrollInterval = setInterval(() => {
          if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
          } else {
            clearInterval(scrollInterval);
          }
        }, 15);
      }
      
      if (document.body.scrollTop > 0) {
        document.body.scrollTo(0, 0);
      }
      if (document.documentElement.scrollTop > 0) {
        document.documentElement.scrollTo(0, 0);
      }
    } catch (error) {
      console.log("Scroll to top error:", error);
      window.scrollTo(0, 0);
    }
  };

  const handleWhatsAppRedirect = () => {
    const category = searchParams.get("category");
    const message = category 
      ? `Hi ${COMPANY_NAME}, I'm browsing your ${categoryOptionsMap[category] || category} category but couldn't find what I need. Can you help me?`
      : `Hi ${COMPANY_NAME}, I'm browsing your products but couldn't find what I'm looking for. Can you help me?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

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

    const params = Object.fromEntries(searchParams.entries());
    const initialFilters = {};
    let initialMinPrice = 0;
    let initialMaxPrice = 5000000;
    let initialSort = "price-lowtohigh";
    let initialPage = 1;

    for (const [key, value] of Object.entries(params)) {
      if (key === "minPrice") {
        initialMinPrice = parseInt(value) || 0;
      } else if (key === "maxPrice") {
        initialMaxPrice = parseInt(value) || 5000000;
      } else if (key === "sort") {
        initialSort = value;
      } else if (key === "page") {
        initialPage = parseInt(value) || 1;
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
    setCurrentPage(initialPage);

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

    setTimeout(() => {
      scrollToTop();
    }, 100);

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
    
    if (currentPage !== 1) {
      newSearchParams.set("page", currentPage.toString());
    }

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

    if (sort !== "price-lowtohigh") {
      newSearchParams.set("sort", sort);
    }

    if (currentPage !== 1) {
      newSearchParams.set("page", currentPage.toString());
    }

    setSearchParams(newSearchParams);
    setIsMobileFilterOpen(false);
    
    setTimeout(() => {
      scrollToTop();
    }, 100);
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
    if (sort !== "price-lowtohigh") {
      newSearchParams.set("sort", sort);
    }

    setSearchParams(newSearchParams);
    
    setTimeout(() => {
      scrollToTop();
    }, 100);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productList.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(productList.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", pageNumber.toString());
    setSearchParams(newSearchParams);
    
    setTimeout(() => {
      scrollToTop();
    }, 100);
  };

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
        {/* Mobile Control Bar */}
        <div className="sm:hidden flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                {pageTitle}
              </h2>
              {searchParams.has("category") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCategory}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest h-7 px-2"
                  disabled={isFilterLoading || minimumLoaderTime}
                >
                  <XCircle className="h-3 w-3 mr-1" /> Reset
                </Button>
              )}
          </div>
          
          <div className="flex gap-2">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 h-11 bg-white border-slate-200 rounded-xl shadow-sm flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest"
                  disabled={isFilterLoading || minimumLoaderTime}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-xs p-0 border-0"
              >
                <div className="h-full flex flex-col">
                   <div className="p-6 border-b border-slate-100 italic">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Filters</h3>
                   </div>
                   <div className="flex-1 overflow-y-auto">
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
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex-1 relative" ref={mobileDropdownRef}>
              <Button
                variant="outline"
                className="w-full h-11 bg-white border-slate-200 rounded-xl shadow-sm flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest"
                onClick={() => setIsMobileSortDropdownOpen(!isMobileSortDropdownOpen)}
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                Sort Order
              </Button>
              
              {isMobileSortDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-1.5">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`w-full flex items-center px-4 py-3 text-[11px] font-bold rounded-xl hover:bg-slate-50 transition-colors ${
                          sort === option.id ? 'bg-primary/5 text-primary' : 'text-slate-500'
                        }`}
                        onClick={() => handleSort(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8">
          <div className="hidden sm:block w-72 shrink-0">
             <div className="sticky top-24">
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
          </div>

          <div className="flex-1">
            <div className="hidden sm:flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  {pageTitle}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  DISCOVERED {productList.length} GADGETS
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {searchParams.has("category") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCategory}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest h-9"
                    disabled={isFilterLoading || minimumLoaderTime}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reset Category
                  </Button>
                )}

                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="outline"
                    className="h-10 border-slate-200 rounded-xl px-4 flex items-center gap-3 bg-white hover:bg-slate-50 transition-all shadow-sm"
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  >
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{getCurrentSortLabel()}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {isSortDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 min-w-[220px] overflow-hidden">
                      <div className="p-1.5">
                        {sortOptions.map((option) => (
                          <button
                            key={option.id}
                            className={`w-full flex items-center px-4 py-2.5 text-[11px] font-bold rounded-xl hover:bg-slate-50 transition-colors ${
                              sort === option.id ? 'bg-primary/5 text-primary' : 'text-slate-500'
                            }`}
                            onClick={() => handleSort(option.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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

                    <section className="max-w-7xl mx-auto w-full mt-12">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 sm:p-8 shadow-lg"
                      >
                        <div className="text-center">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                            Can't find the product you are looking for?
                          </h3>
                          <Button
                            onClick={handleWhatsAppRedirect}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg font-semibold"
                            size="lg"
                          >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            ASK US ON WHATSAPP
                          </Button>
                        </div>
                      </motion.div>
                    </section>
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
                      </div>
                    </div>

                    <section className="max-w-7xl mx-auto w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 sm:p-8 shadow-lg"
                      >
                        <div className="text-center">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                            Can't find the product you are looking for?
                          </h3>
                          <Button
                            onClick={handleWhatsAppRedirect}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg font-semibold"
                            size="lg"
                          >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            ASK US ON WHATSAPP
                          </Button>
                        </div>
                      </motion.div>
                    </section>
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

                <RecentlyViewed />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
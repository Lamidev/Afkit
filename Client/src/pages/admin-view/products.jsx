


// import { Fragment, useState, useEffect, useRef, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTrigger,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import ProductImageUpload from "@/components/admin-view/image-upload";
// import CommonForm from "@/components/common/form";
// import AdminProductTile from "@/components/admin-view/product-tile";
// import AdminProductSearch from "@/components/admin-view/search";
// import { addProductFormElements, filterOptions, adminSortOptions, getFilterOptionsForCategory } from "@/config";
// import {
//   addNewProduct,
//   editProduct,
//   fetchAllProducts,
// } from "@/store/admin/products-slice";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ArrowUpDown, Filter, X, Plus } from "lucide-react";
// import AdminProductFilter from "@/components/admin-view/admin-product-filter";
// import { useLocation , Link} from "react-router-dom";

// const initialFormData = {
//   images: [],
//   title: "",
//   description: "",
//   category: "",
//   brand: "",
//   price: "",
//   storage: "",
//   ram: "",
//   processor: "",
//   extraFeatures: "",
//   laptopType: "",
//   screenSize: "",
//   frameStyle: "",
//   screenResolution: "",
//   ports: "",
//   monitorType: "",
//   accessoryCategory: "",
//   specificAccessory: "",
//   totalStock: "",
//   condition: "Brand New",
// };

// const adminMenuItems = [
//   { id: "all-products", label: "All Products", path: "/admin/products" },
//   { id: "smartphones", label: "Smartphones", path: "/admin/products?category=smartphones" },
//   { id: "laptops", label: "Laptops", path: "/admin/products?category=laptops" },
//   { id: "monitors", label: "Monitors", path: "/admin/products?category=monitors" },
//   { id: "accessories", label: "Accessories", path: "/admin/products?category=accessories" },
// ];

// function AdminProducts() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { productList, isLoading } = useSelector(
//     (state) => state.adminProducts
//   );
  
//   const urlParams = new URLSearchParams(location.search);
//   const urlCategory = urlParams.get('category');
  
//   const [openCreateProductsDialog, setOpenCreateProductsDialog] =
//     useState(false);
//   const [formData, setFormData] = useState(initialFormData);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
//   const [imageLoadingState, setImageLoadingState] = useState(false);
//   const [currentEditedId, setCurrentEditedId] = useState(null);
//   const [activeTab, setActiveTab] = useState("active");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("latest-arrival");
  
//   const [filters, setFilters] = useState(() => {
//     const initialFilters = {};
//     if (urlCategory && urlCategory !== 'all-products') {
//       initialFilters.category = [urlCategory];
//     }
//     return initialFilters;
//   });
  
//   const [priceRange, setPriceRange] = useState({
//     min: 0,
//     max: 5000000,
//   });
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
//   const productsPerPage = 16;
//   const topRef = useRef(null);

//   const currentFilterOptions = useMemo(() => {
//     const selectedCategory = filters.category?.[0] || urlCategory;
//     return getFilterOptionsForCategory(selectedCategory || "all-products");
//   }, [filters.category, urlCategory]);

//   useEffect(() => {
//     if (urlCategory === 'all-products') {
//       setFilters(prev => {
//         const newFilters = { ...prev };
//         delete newFilters.category;
//         return newFilters;
//       });
//       setCurrentPage(1);
//     } else if (urlCategory) {
//       setFilters(prev => ({
//         ...prev,
//         category: [urlCategory]
//       }));
//       setCurrentPage(1);
//     } else {
//       setFilters(prev => {
//         const newFilters = { ...prev };
//         delete newFilters.category;
//         return newFilters;
//       });
//       setCurrentPage(1);
//     }
//   }, [urlCategory]);

//   useEffect(() => {
//     loadProducts();
//   }, [filters, sortBy, priceRange, activeTab]);

//   const loadProducts = () => {
//     const filterParams = {
//       ...filters,
//       ...(activeTab === "hidden" && { isHidden: true }),
//       ...(activeTab === "active" && { isHidden: false }),
//     };

//     dispatch(fetchAllProducts({
//       filterParams,
//       sortParams: sortBy,
//       priceRange: { min: priceRange.min, max: priceRange.max }
//     }));
//   };

//   useEffect(() => {
//     if (topRef.current) {
//       topRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [currentPage, activeTab]);

//   const getFilteredProducts = (products) => {
//     let filtered = products;
    
//     if (urlCategory && urlCategory !== 'all-products') {
//       filtered = filtered.filter(product => product.category === urlCategory);
//     }
    
//     if (searchQuery) {
//       filtered = filtered.filter(product => 
//         product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//     }
    
//     return filtered;
//   };

//   const activeProducts = getFilteredProducts(productList.filter(product => !product.isHidden));
//   const hiddenProducts = getFilteredProducts(productList.filter(product => product.isHidden));

//   const getPaginatedProducts = (products) => {
//     const startIndex = (currentPage - 1) * productsPerPage;
//     const endIndex = startIndex + productsPerPage;
//     return products.slice(startIndex, endIndex);
//   };

//   const totalActivePages = Math.ceil(activeProducts.length / productsPerPage);
//   const totalHiddenPages = Math.ceil(hiddenProducts.length / productsPerPage);

//   const resetForm = () => {
//     setFormData(initialFormData);
//     setImageFiles([]);
//     setUploadedImageUrls([]);
//     setCurrentEditedId(null);
//   };

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     const productData = {
//       ...formData,
//       images:
//         uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images,
//       price: Number(formData.price),
//       totalStock: Number(formData.totalStock),
//     };

//     try {
//       const action = currentEditedId
//         ? dispatch(editProduct({ id: currentEditedId, productData }))
//         : dispatch(addNewProduct(productData));

//       const result = await action;

//       if (result?.payload?.success) {
//         toast.success(currentEditedId ? "Product updated" : "Product added");
//         loadProducts();
//         setOpenCreateProductsDialog(false);
//         resetForm();
//       } else {
//         throw new Error(result?.payload?.message || "Operation failed");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const isFormValid = () => {
//     const commonRequiredFields = [
//       "title",
//       "description",
//       "category",
//       "price",
//       "totalStock",
//       "condition",
//     ];

//     const basicValid = commonRequiredFields.every((field) => {
//       const value = formData[field];
//       return (
//         (typeof value === "string" && value.trim() !== "") ||
//         (typeof value === "number" &&
//           value !== null &&
//           value !== undefined &&
//           value >= 0)
//       );
//     });

//     let categorySpecificValid = true;
//     switch (formData.category) {
//       case "smartphones":
//         categorySpecificValid =
//           !!formData.brand && !!formData.storage && !!formData.ram;
//         break;
//       case "laptops":
//         categorySpecificValid =
//           !!formData.brand &&
//           !!formData.storage &&
//           !!formData.ram &&
//           !!formData.processor &&
//           !!formData.extraFeatures &&
//           !!formData.laptopType;
//         break;
//       case "monitors":
//         categorySpecificValid =
//           !!formData.brand &&
//           !!formData.screenSize &&
//           !!formData.frameStyle &&
//           !!formData.screenResolution &&
//           !!formData.ports &&
//           !!formData.monitorType;
//         break;
//       case "accessories":
//         categorySpecificValid =
//           !!formData.accessoryCategory && !!formData.specificAccessory;
//         break;
//       default:
//         break;
//     }

//     const imagesValid = currentEditedId
//       ? formData.images && formData.images.length > 0
//       : uploadedImageUrls.length > 0;

//     return basicValid && categorySpecificValid && imagesValid;
//   };

//   const getDynamicFormControls = () => {
//     const dynamicControls = addProductFormElements
//       .map((control) => {
//         let newControl = { ...control };

//         if (newControl.componentType === "select") {
//           if (
//             (formData.category === "smartphones" ||
//               formData.category === "laptops") &&
//             (newControl.name === "brand" ||
//               newControl.name === "storage" ||
//               newControl.name === "ram")
//           ) {
//             newControl.options =
//               filterOptions[formData.category]?.[newControl.name] || [];
//           } else if (
//             formData.category === "laptops" &&
//             (newControl.name === "processor" ||
//               newControl.name === "extraFeatures" ||
//               newControl.name === "laptopType")
//           ) {
//             newControl.options = filterOptions.laptops?.[newControl.name] || [];
//           } else if (
//             formData.category === "monitors" &&
//             (newControl.name === "brand" ||
//               newControl.name === "screenSize" ||
//               newControl.name === "frameStyle" ||
//               newControl.name === "screenResolution" ||
//               newControl.name === "ports" ||
//               newControl.name === "monitorType")
//           ) {
//             newControl.options =
//               filterOptions.monitors?.[newControl.name] || [];
//           } else if (newControl.name === "accessoryCategory") {
//             newControl.options = filterOptions.accessories?.accessoryCategory || [];
//           } else if (
//             newControl.name === "specificAccessory" &&
//             formData.accessoryCategory
//           ) {
//             newControl.options =
//               filterOptions.accessories?.[formData.accessoryCategory] || [];
//           } else if (newControl.name === "condition") {
//             newControl.options = filterOptions.condition || [];
//           } else if (newControl.name === "category") {
//             newControl.options = [
//               { id: "smartphones", label: "Smartphones" },
//               { id: "laptops", label: "Laptops" },
//               { id: "monitors", label: "Monitors" },
//               { id: "accessories", label: "Accessories" },
//             ];
//           }
//         }
//         return newControl;
//       })
//       .filter((control) => {
//         if (!control.visibleIf) return true;
        
//         const { field, value } = control.visibleIf;
//         const fieldValue = formData[field];

//         if (control.name === "specificAccessory") {
//           return formData.category === "accessories" && formData.accessoryCategory;
//         }

//         if (Array.isArray(value)) {
//           return value.includes(fieldValue);
//         }
//         return fieldValue === value;
//       });
//     return dynamicControls;
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleSortChange = (value) => {
//     setSortBy(value);
//     setCurrentPage(1);
//   };

//   const handleApplyFilters = (newFilters, newPriceRange) => {
//     setFilters(newFilters);
//     setPriceRange(newPriceRange);
//     setCurrentPage(1);
//     setIsFilterOpen(false);
//     setIsMobileFilterOpen(false);
//   };

//   const handleResetFilters = () => {
//     setFilters({});
//     setPriceRange({
//       min: 0,
//       max: 5000000,
//     });
//     setCurrentPage(1);
//     setIsFilterOpen(false);
//     setIsMobileFilterOpen(false);
//   };

//   const handleCloseFilter = () => {
//     setIsFilterOpen(false);
//     setIsMobileFilterOpen(false);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setCurrentPage(1);
//     setSearchQuery("");
//     setFilters({});
//     setPriceRange({
//       min: 0,
//       max: 5000000,
//     });
//   };

//   const hasActiveFilters = Object.keys(filters).length > 0 || 
//     priceRange.min !== 0 || 
//     priceRange.max !== 5000000;

//   const getCurrentCategoryName = () => {
//     if (!urlCategory || urlCategory === 'all-products') return 'All Products';
//     return adminMenuItems.find(item => item.id === urlCategory)?.label || urlCategory;
//   };

//   return (
//     <Fragment>
//       <div ref={topRef} className="space-y-6">
//         <motion.div
//           className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="flex items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold">Manage Products</h1>
//               {urlCategory && (
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Category: <span className="font-medium">{getCurrentCategoryName()}</span>
//                 </p>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="flex items-center space-x-2"
//                   >
//                     <ArrowUpDown className="h-4 w-4" />
//                     <span>Sort</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="start" className="w-48">
//                   <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
//                     {adminSortOptions.map((option) => (
//                       <DropdownMenuRadioItem key={option.id} value={option.id}>
//                         {option.label}
//                       </DropdownMenuRadioItem>
//                     ))}
//                   </DropdownMenuRadioGroup>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <div className="hidden sm:block">
//                 <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="flex items-center space-x-2 relative"
//                     >
//                       <Filter className="h-4 w-4" />
//                       <span>Filter</span>
//                       {hasActiveFilters && (
//                         <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></span>
//                       )}
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="start" className="w-80 p-0">
//                     <div className="p-4 border-b flex items-center justify-between">
//                       <h3 className="font-semibold">Filters</h3>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={handleCloseFilter}
//                         className="h-8 w-8 p-0 hover:bg-gray-100"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <div className="max-h-96 overflow-y-auto">
//                       <AdminProductFilter
//                         filters={filters}
//                         onApplyFilters={handleApplyFilters}
//                         onResetFilters={handleResetFilters}
//                         onCloseFilter={handleCloseFilter}
//                         filterOptions={currentFilterOptions}
//                         priceRange={priceRange}
//                         setPriceRange={setPriceRange}
//                         isDropdown={true}
//                       />
//                     </div>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>

//               <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
//                 <SheetTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="flex items-center space-x-2 sm:hidden relative"
//                   >
//                     <Filter className="h-4 w-4" />
//                     <span>Filter</span>
//                     {hasActiveFilters && (
//                       <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></span>
//                     )}
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent
//                   side="right"
//                   className="w-[85vw] sm:max-w-md overflow-y-auto p-0"
//                 >
//                   <div className="flex-1 overflow-y-auto">
//                     <AdminProductFilter
//                       filters={filters}
//                       onApplyFilters={handleApplyFilters}
//                       onResetFilters={handleResetFilters}
//                       onCloseFilter={handleCloseFilter}
//                       filterOptions={currentFilterOptions}
//                       priceRange={priceRange}
//                       setPriceRange={setPriceRange}
//                       isDropdown={false}
//                       isMobileFilterOpen={isMobileFilterOpen}
//                       setIsMobileFilterOpen={setIsMobileFilterOpen}
//                     />
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             <AdminProductSearch 
//               onSearch={setSearchQuery}
//               placeholder="Search products..."
//               className="w-full sm:w-64"
//             />
//             <Button 
//               onClick={() => setOpenCreateProductsDialog(true)}
//               className="hidden sm:flex bg-blue-900 hover:bg-blue-600"
//             >
//               Add New Product
//             </Button>
//           </div>
//         </motion.div>

//         {urlCategory && urlCategory !== 'all-products' && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-blue-50 border border-blue-200 rounded-lg p-4"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold text-blue-900">
//                   Viewing {getCurrentCategoryName()}
//                 </h3>
//                 <p className="text-sm text-blue-700 mt-1">
//                   Showing {activeProducts.length} active products in this category
//                   {hiddenProducts.length > 0 && `, ${hiddenProducts.length} hidden`}
//                 </p>
//               </div>
//               <Button
//                 asChild
//                 variant="outline"
//                 size="sm"
//               >
//                 <Link to="/admin/products">
//                   View All Products
//                 </Link>
//               </Button>
//             </div>
//           </motion.div>
//         )}

//         {hasActiveFilters && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap"
//           >
//             <span>Active filters:</span>
//             {filters.category && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 Category: {filters.category.join(", ")}
//               </span>
//             )}
//             {filters.brand && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 Brand: {filters.brand.join(", ")}
//               </span>
//             )}
//             {filters.condition && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 Condition: {filters.condition.join(", ")}
//               </span>
//             )}
//             {filters.storage && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 Storage: {filters.storage.join(", ")}
//               </span>
//             )}
//             {filters.ram && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 RAM: {filters.ram.join(", ")}
//               </span>
//             )}
//             {filters.processor && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 Processor: {filters.processor.join(", ")}
//               </span>
//             )}
//             {filters.accessoryCategory && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 Accessory Type: {filters.accessoryCategory.join(", ")}
//               </span>
//             )}
//             {filters.specificAccessory && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 Specific Accessory: {filters.specificAccessory.join(", ")}
//               </span>
//             )}
//             {(priceRange.min !== 0 || priceRange.max !== 5000000) && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
//                 Price: ₦{priceRange.min.toLocaleString()} - ₦{priceRange.max.toLocaleString()}
//               </span>
//             )}
//           </motion.div>
//         )}

//         <div className="flex justify-between items-center">
//           <div className="text-sm text-muted-foreground">
//             Showing {activeTab === "active" ? activeProducts.length : hiddenProducts.length} products
//             {sortBy !== "latest-arrival" && ` • Sorted by ${adminSortOptions.find(opt => opt.id === sortBy)?.label}`}
//           </div>
//         </div>

//         <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="active">
//               Active Products
//             </TabsTrigger>
//             <TabsTrigger value="hidden">
//               Hidden Products {hiddenProducts.length > 0 && (
//                 <span className="ml-1 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
//                   {hiddenProducts.length}
//                 </span>
//               )}
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="active" className="mt-6">
//             {isLoading ? (
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                 {Array.from({ length: 8 }).map((_, i) => (
//                   <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
//                 ))}
//               </div>
//             ) : activeProducts.length > 0 ? (
//               <>
//                 <motion.div
//                   className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4"
//                   initial="hidden"
//                   animate="visible"
//                   variants={{
//                     hidden: { opacity: 0 },
//                     visible: {
//                       opacity: 1,
//                       transition: { staggerChildren: 0.1 },
//                     },
//                   }}
//                 >
//                   <AnimatePresence>
//                     {getPaginatedProducts(activeProducts).map((product) => (
//                       <AdminProductTile
//                         key={product._id}
//                         product={product}
//                         setFormData={(data) => {
//                           setFormData({
//                             images: data.images || [],
//                             title: data.title || "",
//                             description: data.description || "",
//                             category: data.category || "",
//                             brand: data.brand || "",
//                             price: data.price || "",
//                             storage: data.storage || "",
//                             ram: data.ram || "",
//                             processor: data.processor || "",
//                             extraFeatures: data.extraFeatures || "",
//                             laptopType: data.laptopType || "",
//                             screenSize: data.screenSize || "",
//                             frameStyle: data.frameStyle || "",
//                             screenResolution: data.screenResolution || "",
//                             ports: data.ports || "",
//                             monitorType: data.monitorType || "",
//                             accessoryCategory: data.accessoryCategory || "",
//                             specificAccessory: data.specificAccessory || "",
//                             totalStock: data.totalStock || "",
//                             condition: data.condition || "Brand New",
//                           });
//                           setUploadedImageUrls(data.images || []);
//                         }}
//                         setOpenCreateProductsDialog={setOpenCreateProductsDialog}
//                         setCurrentEditedId={setCurrentEditedId}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </motion.div>
                
//                 {totalActivePages > 1 && (
//                   <div className="flex justify-center mt-6">
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                       >
//                         Previous
//                       </Button>
//                       {Array.from({ length: totalActivePages }, (_, i) => i + 1).map((page) => (
//                         <Button
//                           key={page}
//                           variant={page === currentPage ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => handlePageChange(page)}
//                         >
//                           {page}
//                         </Button>
//                       ))}
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalActivePages}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <p className="text-muted-foreground">
//                   {urlCategory && urlCategory !== 'all-products' 
//                     ? `No active ${getCurrentCategoryName().toLowerCase()} found`
//                     : "No active products found"
//                   }
//                 </p>
//                 <Button
//                   className="mt-4 bg-blue-900 hover:bg-blue-600"
//                   onClick={() => setOpenCreateProductsDialog(true)}
//                 >
//                   Add Your First Product
//                 </Button>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="hidden" className="mt-6">
//             {hiddenProducts.length > 0 ? (
//               <>
//                 <motion.div
//                   className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4"
//                   initial="hidden"
//                   animate="visible"
//                   variants={{
//                     hidden: { opacity: 0 },
//                     visible: {
//                       opacity: 1,
//                       transition: { staggerChildren: 0.1 },
//                     },
//                   }}
//                 >
//                   <AnimatePresence>
//                     {getPaginatedProducts(hiddenProducts).map((product) => (
//                       <AdminProductTile
//                         key={product._id}
//                         product={product}
//                         setFormData={(data) => {
//                           setFormData({
//                             images: data.images || [],
//                             title: data.title || "",
//                             description: data.description || "",
//                             category: data.category || "",
//                             brand: data.brand || "",
//                             price: data.price || "",
//                             storage: data.storage || "",
//                             ram: data.ram || "",
//                             processor: data.processor || "",
//                             extraFeatures: data.extraFeatures || "",
//                             laptopType: data.laptopType || "",
//                             screenSize: data.screenSize || "",
//                             frameStyle: data.frameStyle || "",
//                             screenResolution: data.screenResolution || "",
//                             ports: data.ports || "",
//                             monitorType: data.monitorType || "",
//                             accessoryCategory: data.accessoryCategory || "",
//                             specificAccessory: data.specificAccessory || "",
//                             totalStock: data.totalStock || "",
//                             condition: data.condition || "Brand New",
//                           });
//                           setUploadedImageUrls(data.images || []);
//                         }}
//                         setOpenCreateProductsDialog={setOpenCreateProductsDialog}
//                         setCurrentEditedId={setCurrentEditedId}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </motion.div>
                
//                 {totalHiddenPages > 1 && (
//                   <div className="flex justify-center mt-6">
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                       >
//                         Previous
//                       </Button>
//                       {Array.from({ length: totalHiddenPages }, (_, i) => i + 1).map((page) => (
//                         <Button
//                           key={page}
//                           variant={page === currentPage ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => handlePageChange(page)}
//                         >
//                           {page}
//                         </Button>
//                       ))}
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalHiddenPages}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <p className="text-muted-foreground">
//                   {urlCategory && urlCategory !== 'all-products'
//                     ? `No hidden ${getCurrentCategoryName().toLowerCase()} found`
//                     : "No hidden products found"
//                   }
//                 </p>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>

//         {/* Floating Add Product Button */}
//         <motion.div
//           className="fixed bottom-6 right-6 z-50"
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Button
//             onClick={() => setOpenCreateProductsDialog(true)}
//             size="lg"
//             className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-900 hover:bg-blue-600"
//           >
//             <Plus className="h-6 w-6" />
//             <span className="sr-only">Add New Product</span>
//           </Button>
//         </motion.div>

//         <Sheet
//           open={openCreateProductsDialog}
//           onOpenChange={(open) => {
//             if (!open) {
//               setOpenCreateProductsDialog(false);
//               resetForm();
//             }
//           }}
//         >
//           <SheetContent
//             side="right"
//             className="overflow-y-auto w-full sm:max-w-lg"
//           >
//             <SheetHeader>
//               <SheetTitle>
//                 {currentEditedId ? "Edit Product" : "Add New Product"}
//               </SheetTitle>
//             </SheetHeader>

//             <div className="py-4 space-y-6">
//               <ProductImageUpload
//                 imageFiles={imageFiles}
//                 setImageFiles={setImageFiles}
//                 uploadedImageUrls={uploadedImageUrls}
//                 setUploadedImageUrls={setUploadedImageUrls}
//                 setImageLoadingState={setImageLoadingState}
//                 imageLoadingState={imageLoadingState}
//                 isEditMode={!!currentEditedId}
//               />

//               <CommonForm
//                 onSubmit={onSubmit}
//                 formData={formData}
//                 setFormData={setFormData}
//                 buttonText={currentEditedId ? "Update Product" : "Add Product"}
//                 formControls={getDynamicFormControls()}
//                 isBtnDisabled={!isFormValid()}
//               />
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>
//     </Fragment>
//   );
// }

// export default AdminProducts;

import { Fragment, useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import AdminProductTile from "@/components/admin-view/product-tile";
import AdminProductSearch from "@/components/admin-view/search";
import { addProductFormElements, filterOptions, adminSortOptions, getFilterOptionsForCategory } from "@/config";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { ArrowUpDown, Filter, X, Plus, ChevronDown } from "lucide-react";
import AdminProductFilter from "@/components/admin-view/admin-product-filter";
import { useLocation , Link} from "react-router-dom";

const initialFormData = {
  images: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  storage: "",
  ram: "",
  processor: "",
  extraFeatures: "",
  laptopType: "",
  screenSize: "",
  frameStyle: "",
  screenResolution: "",
  ports: "",
  monitorType: "",
  accessoryCategory: "",
  specificAccessory: "",
  totalStock: "",
  condition: "Brand New",
};

const adminMenuItems = [
  { id: "all-products", label: "All Products", path: "/admin/products" },
  { id: "smartphones", label: "Smartphones", path: "/admin/products?category=smartphones" },
  { id: "laptops", label: "Laptops", path: "/admin/products?category=laptops" },
  { id: "monitors", label: "Monitors", path: "/admin/products?category=monitors" },
  { id: "accessories", label: "Accessories", path: "/admin/products?category=accessories" },
];

function AdminProducts() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { productList, isLoading } = useSelector(
    (state) => state.adminProducts
  );
  
  const urlParams = new URLSearchParams(location.search);
  const urlCategory = urlParams.get('category');
  
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest-arrival");
  
  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    if (urlCategory && urlCategory !== 'all-products') {
      initialFilters.category = [urlCategory];
    }
    return initialFilters;
  });
  
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 5000000,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const productsPerPage = 16;
  const topRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentFilterOptions = useMemo(() => {
    const selectedCategory = filters.category?.[0] || urlCategory;
    return getFilterOptionsForCategory(selectedCategory || "all-products");
  }, [filters.category, urlCategory]);

  useEffect(() => {
    if (urlCategory === 'all-products') {
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters.category;
        return newFilters;
      });
      setCurrentPage(1);
    } else if (urlCategory) {
      setFilters(prev => ({
        ...prev,
        category: [urlCategory]
      }));
      setCurrentPage(1);
    } else {
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters.category;
        return newFilters;
      });
      setCurrentPage(1);
    }
  }, [urlCategory]);

  useEffect(() => {
    loadProducts();
  }, [filters, sortBy, priceRange, activeTab]);

  const loadProducts = () => {
    const filterParams = {
      ...filters,
      ...(activeTab === "hidden" && { isHidden: true }),
      ...(activeTab === "active" && { isHidden: false }),
    };

    dispatch(fetchAllProducts({
      filterParams,
      sortParams: sortBy,
      priceRange: { min: priceRange.min, max: priceRange.max }
    }));
  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, activeTab]);

  const getFilteredProducts = (products) => {
    let filtered = products;
    
    if (urlCategory && urlCategory !== 'all-products') {
      filtered = filtered.filter(product => product.category === urlCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const activeProducts = getFilteredProducts(productList.filter(product => !product.isHidden));
  const hiddenProducts = getFilteredProducts(productList.filter(product => product.isHidden));

  const getPaginatedProducts = (products) => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const totalActivePages = Math.ceil(activeProducts.length / productsPerPage);
  const totalHiddenPages = Math.ceil(hiddenProducts.length / productsPerPage);

  const resetForm = () => {
    setFormData({
      images: [],
      title: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      storage: "",
      ram: "",
      processor: "",
      extraFeatures: "",
      laptopType: "",
      screenSize: "",
      frameStyle: "",
      screenResolution: "",
      ports: "",
      monitorType: "",
      accessoryCategory: "",
      specificAccessory: "",
      totalStock: "",
      condition: "Brand New",
    });
    setImageFiles([]);
    setUploadedImageUrls([]);
    setCurrentEditedId(null);
    setImageLoadingState(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const productData = {
      ...formData,
      images: uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images,
      price: Number(formData.price),
      totalStock: Number(formData.totalStock),
    };

    try {
      const action = currentEditedId
        ? dispatch(editProduct({ id: currentEditedId, productData }))
        : dispatch(addNewProduct(productData));

      const result = await action;

      if (result?.payload?.success) {
        toast.success(currentEditedId ? "Product updated" : "Product added");
        loadProducts();
        setOpenCreateProductsDialog(false);
        resetForm();
      } else {
        throw new Error(result?.payload?.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isFormValid = () => {
    const commonRequiredFields = [
      "title",
      "description",
      "category",
      "price",
      "totalStock",
      "condition",
    ];

    const basicValid = commonRequiredFields.every((field) => {
      const value = formData[field];
      return (
        (typeof value === "string" && value.trim() !== "") ||
        (typeof value === "number" &&
          value !== null &&
          value !== undefined &&
          value >= 0)
      );
    });

    let categorySpecificValid = true;
    switch (formData.category) {
      case "smartphones":
        categorySpecificValid =
          !!formData.brand && !!formData.storage && !!formData.ram;
        break;
      case "laptops":
        categorySpecificValid =
          !!formData.brand &&
          !!formData.storage &&
          !!formData.ram &&
          !!formData.processor &&
          !!formData.extraFeatures &&
          !!formData.laptopType;
        break;
      case "monitors":
        categorySpecificValid =
          !!formData.brand &&
          !!formData.screenSize &&
          !!formData.frameStyle &&
          !!formData.screenResolution &&
          !!formData.ports &&
          !!formData.monitorType;
        break;
      case "accessories":
        categorySpecificValid =
          !!formData.accessoryCategory && !!formData.specificAccessory;
        break;
      default:
        break;
    }

    const imagesValid = currentEditedId
      ? formData.images && formData.images.length > 0
      : uploadedImageUrls.length > 0;

    return basicValid && categorySpecificValid && imagesValid;
  };

  const getDynamicFormControls = () => {
    const dynamicControls = addProductFormElements
      .map((control) => {
        let newControl = { ...control };

        if (newControl.componentType === "select") {
          if (
            (formData.category === "smartphones" ||
              formData.category === "laptops") &&
            (newControl.name === "brand" ||
              newControl.name === "storage" ||
              newControl.name === "ram")
          ) {
            newControl.options =
              filterOptions[formData.category]?.[newControl.name] || [];
          } else if (
            formData.category === "laptops" &&
            (newControl.name === "processor" ||
              newControl.name === "extraFeatures" ||
              newControl.name === "laptopType")
          ) {
            newControl.options = filterOptions.laptops?.[newControl.name] || [];
          } else if (
            formData.category === "monitors" &&
            (newControl.name === "brand" ||
              newControl.name === "screenSize" ||
              newControl.name === "frameStyle" ||
              newControl.name === "screenResolution" ||
              newControl.name === "ports" ||
              newControl.name === "monitorType")
          ) {
            newControl.options =
              filterOptions.monitors?.[newControl.name] || [];
          } else if (newControl.name === "accessoryCategory") {
            newControl.options = filterOptions.accessories?.accessoryCategory || [];
          } else if (
            newControl.name === "specificAccessory" &&
            formData.accessoryCategory
          ) {
            newControl.options =
              filterOptions.accessories?.[formData.accessoryCategory] || [];
          } else if (newControl.name === "condition") {
            newControl.options = filterOptions.condition || [];
          } else if (newControl.name === "category") {
            newControl.options = [
              { id: "smartphones", label: "Smartphones" },
              { id: "laptops", label: "Laptops" },
              { id: "monitors", label: "Monitors" },
              { id: "accessories", label: "Accessories" },
            ];
          }
        }
        return newControl;
      })
      .filter((control) => {
        if (!control.visibleIf) return true;
        
        const { field, value } = control.visibleIf;
        const fieldValue = formData[field];

        if (control.name === "specificAccessory") {
          return formData.category === "accessories" && formData.accessoryCategory;
        }

        if (Array.isArray(value)) {
          return value.includes(fieldValue);
        }
        return fieldValue === value;
      });
    return dynamicControls;
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
    setIsSortDropdownOpen(false);
  };

  const handleApplyFilters = (newFilters, newPriceRange) => {
    setFilters(newFilters);
    setPriceRange(newPriceRange);
    setCurrentPage(1);
    setIsFilterOpen(false);
    setIsMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPriceRange({
      min: 0,
      max: 5000000,
    });
    setCurrentPage(1);
    setIsFilterOpen(false);
    setIsMobileFilterOpen(false);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
    setIsMobileFilterOpen(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
    setFilters({});
    setPriceRange({
      min: 0,
      max: 5000000,
    });
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || 
    priceRange.min !== 0 || 
    priceRange.max !== 5000000;

  const getCurrentCategoryName = () => {
    if (!urlCategory || urlCategory === 'all-products') return 'All Products';
    return adminMenuItems.find(item => item.id === urlCategory)?.label || urlCategory;
  };

  const getCurrentSortLabel = () => {
    const currentOption = adminSortOptions.find(option => option.id === sortBy);
    return currentOption ? currentOption.label : "Sort By";
  };

  return (
    <Fragment>
      <div ref={topRef} className="space-y-6">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Manage Products</h1>
              {urlCategory && (
                <p className="text-sm text-muted-foreground mt-1">
                  Category: <span className="font-medium">{getCurrentCategoryName()}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative" ref={sortDropdownRef}>
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
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 min-w-[200px]">
                    <div className="p-2">
                      {adminSortOptions.map((option) => (
                        <button
                          key={option.id}
                          className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${
                            sortBy === option.id ? 'bg-blue-50 text-blue-700' : ''
                          }`}
                          onClick={() => handleSortChange(option.id)}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            sortBy === option.id ? 'bg-blue-600' : 'bg-gray-300'
                          }`} />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block relative" ref={filterDropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 relative"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></span>
                  )}
                </Button>
                
                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-80">
                    <div className="p-4 border-b flex items-center justify-between">
                      <h3 className="font-semibold">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFilterOpen(false)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <AdminProductFilter
                        filters={filters}
                        onApplyFilters={handleApplyFilters}
                        onResetFilters={handleResetFilters}
                        onCloseFilter={handleCloseFilter}
                        filterOptions={currentFilterOptions}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        isDropdown={true}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 sm:hidden relative"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[85vw] sm:max-w-md overflow-y-auto p-0"
                >
                  <div className="flex-1 overflow-y-auto">
                    <AdminProductFilter
                      filters={filters}
                      onApplyFilters={handleApplyFilters}
                      onResetFilters={handleResetFilters}
                      onCloseFilter={handleCloseFilter}
                      filterOptions={currentFilterOptions}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      isDropdown={false}
                      isMobileFilterOpen={isMobileFilterOpen}
                      setIsMobileFilterOpen={setIsMobileFilterOpen}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <AdminProductSearch 
              onSearch={setSearchQuery}
              placeholder="Search products..."
              className="w-full sm:w-64"
            />
            <Button 
              onClick={() => setOpenCreateProductsDialog(true)}
              className="hidden sm:flex bg-blue-900 hover:bg-blue-600"
            >
              Add New Product
            </Button>
          </div>
        </motion.div>

        {urlCategory && urlCategory !== 'all-products' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">
                  Viewing {getCurrentCategoryName()}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Showing {activeProducts.length} active products in this category
                  {hiddenProducts.length > 0 && `, ${hiddenProducts.length} hidden`}
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link to="/admin/products">
                  View All Products
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap"
          >
            <span>Active filters:</span>
            {filters.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                Category: {filters.category.join(", ")}
              </span>
            )}
            {filters.brand && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                Brand: {filters.brand.join(", ")}
              </span>
            )}
            {filters.condition && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                Condition: {filters.condition.join(", ")}
              </span>
            )}
            {filters.storage && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                Storage: {filters.storage.join(", ")}
              </span>
            )}
            {filters.ram && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                RAM: {filters.ram.join(", ")}
              </span>
            )}
            {filters.processor && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                Processor: {filters.processor.join(", ")}
              </span>
            )}
            {filters.accessoryCategory && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                Accessory Type: {filters.accessoryCategory.join(", ")}
              </span>
            )}
            {filters.specificAccessory && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                Specific Accessory: {filters.specificAccessory.join(", ")}
              </span>
            )}
            {(priceRange.min !== 0 || priceRange.max !== 5000000) && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                Price: ₦{priceRange.min.toLocaleString()} - ₦{priceRange.max.toLocaleString()}
              </span>
            )}
          </motion.div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {activeTab === "active" ? activeProducts.length : hiddenProducts.length} products
            {sortBy !== "latest-arrival" && ` • Sorted by ${adminSortOptions.find(opt => opt.id === sortBy)?.label}`}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active Products
            </TabsTrigger>
            <TabsTrigger value="hidden">
              Hidden Products {hiddenProducts.length > 0 && (
                <span className="ml-1 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                  {hiddenProducts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : activeProducts.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  <AnimatePresence>
                    {getPaginatedProducts(activeProducts).map((product) => (
                      <AdminProductTile
                        key={product._id}
                        product={product}
                        setFormData={(data) => {
                          setFormData({
                            images: data.images || [],
                            title: data.title || "",
                            description: data.description || "",
                            category: data.category || "",
                            brand: data.brand || "",
                            price: data.price || "",
                            storage: data.storage || "",
                            ram: data.ram || "",
                            processor: data.processor || "",
                            extraFeatures: data.extraFeatures || "",
                            laptopType: data.laptopType || "",
                            screenSize: data.screenSize || "",
                            frameStyle: data.frameStyle || "",
                            screenResolution: data.screenResolution || "",
                            ports: data.ports || "",
                            monitorType: data.monitorType || "",
                            accessoryCategory: data.accessoryCategory || "",
                            specificAccessory: data.specificAccessory || "",
                            totalStock: data.totalStock || "",
                            condition: data.condition || "Brand New",
                          });
                          setUploadedImageUrls(data.images || []);
                        }}
                        setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                        setCurrentEditedId={setCurrentEditedId}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
                
                {totalActivePages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalActivePages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalActivePages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  {urlCategory && urlCategory !== 'all-products' 
                    ? `No active ${getCurrentCategoryName().toLowerCase()} found`
                    : "No active products found"
                  }
                </p>
                <Button
                  className="mt-4 bg-blue-900 hover:bg-blue-600"
                  onClick={() => setOpenCreateProductsDialog(true)}
                >
                  Add Your First Product
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hidden" className="mt-6">
            {hiddenProducts.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  <AnimatePresence>
                    {getPaginatedProducts(hiddenProducts).map((product) => (
                      <AdminProductTile
                        key={product._id}
                        product={product}
                        setFormData={(data) => {
                          setFormData({
                            images: data.images || [],
                            title: data.title || "",
                            description: data.description || "",
                            category: data.category || "",
                            brand: data.brand || "",
                            price: data.price || "",
                            storage: data.storage || "",
                            ram: data.ram || "",
                            processor: data.processor || "",
                            extraFeatures: data.extraFeatures || "",
                            laptopType: data.laptopType || "",
                            screenSize: data.screenSize || "",
                            frameStyle: data.frameStyle || "",
                            screenResolution: data.screenResolution || "",
                            ports: data.ports || "",
                            monitorType: data.monitorType || "",
                            accessoryCategory: data.accessoryCategory || "",
                            specificAccessory: data.specificAccessory || "",
                            totalStock: data.totalStock || "",
                            condition: data.condition || "Brand New",
                          });
                          setUploadedImageUrls(data.images || []);
                        }}
                        setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                        setCurrentEditedId={setCurrentEditedId}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
                
                {totalHiddenPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalHiddenPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalHiddenPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  {urlCategory && urlCategory !== 'all-products'
                    ? `No hidden ${getCurrentCategoryName().toLowerCase()} found`
                    : "No hidden products found"
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => setOpenCreateProductsDialog(true)}
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-900 hover:bg-blue-600"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add New Product</span>
          </Button>
        </motion.div>

        <Sheet
          open={openCreateProductsDialog}
          onOpenChange={(open) => {
            setOpenCreateProductsDialog(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <SheetContent
            side="right"
            className="w-full sm:max-w-2xl p-0 flex flex-col"
          >
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 py-4 border-b bg-muted/50 shrink-0">
                <SheetTitle className="text-xl">
                  {currentEditedId ? "Edit Product" : "Add New Product"}
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentEditedId ? "Update your product details" : "Add a new product to your store"}
                </p>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Product Images</h3>
                      <ProductImageUpload
                        imageFiles={imageFiles}
                        setImageFiles={setImageFiles}
                        uploadedImageUrls={uploadedImageUrls}
                        setUploadedImageUrls={setUploadedImageUrls}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={!!currentEditedId}
                      />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                      <CommonForm
                        onSubmit={onSubmit}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={currentEditedId ? "Update Product" : "Add Product"}
                        formControls={getDynamicFormControls()}
                        isBtnDisabled={!isFormValid()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Fragment>
  );
}

export default AdminProducts;

import { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import AdminProductTile from "@/components/admin-view/product-tile";
import AdminProductSearch from "@/components/admin-view/search";
import { addProductFormElements, filterOptions } from "@/config";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";

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

function AdminProducts() {
  const dispatch = useDispatch();
  const { productList, isLoading } = useSelector(
    (state) => state.adminProducts
  );
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
  const productsPerPage = 16;
  const topRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, activeTab]);

  const activeProducts = productList.filter(product => !product.isHidden);
  const hiddenProducts = productList.filter(product => product.isHidden);

  const filterProducts = (products) => {
    if (!searchQuery) return products;
    
    return products.filter(product => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const getPaginatedProducts = (products) => {
    const filteredProducts = filterProducts(products);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const totalActivePages = Math.ceil(filterProducts(activeProducts).length / productsPerPage);
  const totalHiddenPages = Math.ceil(filterProducts(hiddenProducts).length / productsPerPage);

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFiles([]);
    setUploadedImageUrls([]);
    setCurrentEditedId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const productData = {
      ...formData,
      images:
        uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images,
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
        dispatch(fetchAllProducts());
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

  return (
    <Fragment>
      <div ref={topRef} className="space-y-6">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <AdminProductSearch 
              onSearch={setSearchQuery}
              placeholder="Search products by title, description, or category..."
              className="w-full sm:w-96"
            />
            <Button onClick={() => setOpenCreateProductsDialog(true)}>
              Add New Product
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="active" 
              onClick={() => {
                setActiveTab("active");
                setCurrentPage(1);
                setSearchQuery("");
              }}
            >
              Active Products
            </TabsTrigger>
            <TabsTrigger 
              value="hidden" 
              onClick={() => {
                setActiveTab("hidden");
                setCurrentPage(1);
                setSearchQuery("");
              }}
            >
              Hidden Products {hiddenProducts.length > 0 && (
                <span className="ml-1 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                  {hiddenProducts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filterProducts(activeProducts).length > 0 ? (
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
                <p className="text-muted-foreground">No active products found</p>
                <Button
                  className="mt-4"
                  onClick={() => setOpenCreateProductsDialog(true)}
                >
                  Add Your First Product
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hidden">
            {filterProducts(hiddenProducts).length > 0 ? (
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
                <p className="text-muted-foreground">No hidden products found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Sheet
          open={openCreateProductsDialog}
          onOpenChange={(open) => {
            if (!open) {
              setOpenCreateProductsDialog(false);
              resetForm();
            }
          }}
        >
          <SheetContent
            side="right"
            className="overflow-y-auto w-full sm:max-w-lg"
          >
            <SheetHeader>
              <SheetTitle>
                {currentEditedId ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>

            <div className="py-4 space-y-6">
              <ProductImageUpload
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                uploadedImageUrls={uploadedImageUrls}
                setUploadedImageUrls={setUploadedImageUrls}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={!!currentEditedId}
              />

              <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText={currentEditedId ? "Update Product" : "Add Product"}
                formControls={getDynamicFormControls()}
                isBtnDisabled={!isFormValid()}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Fragment>
  );
}

export default AdminProducts;
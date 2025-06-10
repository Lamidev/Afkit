import { Fragment, useState, useEffect } from "react";
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
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import AdminProductTile from "@/components/admin-view/product-tile";
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
  // Removed productToDelete and showDeleteModal states - these are no longer needed
  // const [productToDelete, setProductToDelete] = useState(null);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFiles([]);
    setUploadedImageUrls([]);
    setCurrentEditedId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("Final form data before submission:", formData);

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

  // Removed handleDelete function - delete logic is now in AdminProductTile

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
            newControl.options = filterOptions.accessories?.category || [];
          } else if (
            newControl.name === "specificAccessory" &&
            formData.accessoryCategory
          ) {
            switch (formData.accessoryCategory) {
              case "smartphone-accessories":
                newControl.options =
                  filterOptions.accessories?.smartphoneAccessories || [];
                break;
              case "laptop-accessories":
                newControl.options =
                  filterOptions.accessories?.laptopAccessories || [];
                break;
              case "monitor-accessories":
                newControl.options =
                  filterOptions.accessories?.monitorAccessories || [];
                break;
              case "other-accessories":
                newControl.options =
                  filterOptions.accessories?.otherAccessories || [];
                break;
              default:
                newControl.options = [];
                break;
            }
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
        const fieldToCheck = formData[control.visibleIf.field];
        if (Array.isArray(control.visibleIf.value)) {
          return control.visibleIf.value.includes(fieldToCheck);
        }
        return fieldToCheck === control.visibleIf.value;
      });
    return dynamicControls;
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header and Add Button */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Button onClick={() => setOpenCreateProductsDialog(true)}>
            Add New Product
          </Button>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : productList.length > 0 ? (
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
              {productList.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <AdminProductTile
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
                    // Removed setProductToDelete and setShowDeleteModal props - no longer needed here
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No products found</p>
            <Button
              className="mt-4"
              onClick={() => setOpenCreateProductsDialog(true)}
            >
              Add Your First Product
            </Button>
          </div>
        )}
      </div>

      {/* Product Form Sheet */}
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
              isFormValid={isFormValid}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Removed Global Delete Confirmation Modal entirely */}
    </Fragment>
  );
}

export default AdminProducts;



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
  deleteProduct,
} from "@/store/admin/products-slice";
import { Loader2, Trash2 } from "lucide-react";

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
  displayType: "",
  laptopType: "",
  screenSize: "",
  frameStyle: "",
  screenResolution: "",
  ports: "",
  accessoryCategory: "",
  specificAccessory: "",
  totalStock: "",
  condition: "Brand New",
};

function AdminProducts() {
  const dispatch = useDispatch();
  const { productList, isLoading } = useSelector((state) => state.adminProducts);
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // <--- Add this state

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

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const result = await dispatch(deleteProduct(productToDelete)).unwrap();
      if (result.success) {
        toast.success("Product deleted");
        dispatch(fetchAllProducts());
      } else {
        throw new Error(result.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProductToDelete(null);
      setShowDeleteModal(false); // Close the delete modal after handling
    }
  };

  const isFormValid = () => {
    const commonRequiredFields = [
      'title', 'description', 'category', 'price', 'totalStock', 'condition'
    ];

    const basicValid = commonRequiredFields.every(field => {
      const value = formData[field];
      return (typeof value === 'string' && value.trim() !== '') ||
             (typeof value === 'number' && value !== null && value !== undefined && value >= 0);
    });

    let categorySpecificValid = true;
    switch (formData.category) {
      case 'smartphones':
        categorySpecificValid = !!formData.brand && !!formData.storage && !!formData.ram;
        break;
      case 'laptops':
        categorySpecificValid = !!formData.brand && !!formData.storage && !!formData.ram &&
                               !!formData.processor && !!formData.displayType && !!formData.laptopType;
        break;
      case 'monitors':
        categorySpecificValid = !!formData.brand && !!formData.screenSize && !!formData.frameStyle &&
                               !!formData.screenResolution && !!formData.ports;
        break;
      case 'accessories':
        categorySpecificValid = !!formData.accessoryCategory && !!formData.specificAccessory;
        break;
      default:
        break;
    }

    const imagesValid = currentEditedId
      ? (formData.images && formData.images.length > 0)
      : uploadedImageUrls.length > 0;

    return basicValid && categorySpecificValid && imagesValid;
  };

  const getDynamicFormControls = () => {
    const dynamicControls = addProductFormElements.map(control => {
      let newControl = { ...control };

      if (newControl.componentType === 'select') {
        if (
          (formData.category === 'smartphones' || formData.category === 'laptops') &&
          (newControl.name === 'brand' || newControl.name === 'storage' || newControl.name === 'ram')
        ) {
          newControl.options = filterOptions[formData.category]?.[newControl.name] || [];
        } else if (
          formData.category === 'laptops' &&
          (newControl.name === 'processor' || newControl.name === 'displayType' || newControl.name === 'laptopType')
        ) {
          newControl.options = filterOptions.laptops?.[newControl.name] || [];
        }
        else if (
          formData.category === 'monitors' &&
          (newControl.name === 'brand' || newControl.name === 'screenSize' || newControl.name === 'frameStyle' || newControl.name === 'screenResolution' || newControl.name === 'ports')
        ) {
          newControl.options = filterOptions.monitors?.[newControl.name] || [];
        }
        else if (newControl.name === 'accessoryCategory') {
          newControl.options = filterOptions.accessories?.category || [];
        } else if (newControl.name === 'specificAccessory' && formData.accessoryCategory) {
          switch (formData.accessoryCategory) {
            case 'smartphone-accessories':
              newControl.options = filterOptions.accessories?.smartphoneAccessories || [];
              break;
            case 'laptop-accessories':
              newControl.options = filterOptions.accessories?.laptopAccessories || [];
              break;
            case 'monitor-accessories':
              newControl.options = filterOptions.accessories?.monitorAccessories || [];
              break;
            case 'other-accessories':
              newControl.options = filterOptions.accessories?.otherAccessories || [];
              break;
            default:
              newControl.options = [];
              break;
          }
        }
        else if (newControl.name === 'condition') {
          newControl.options = filterOptions.condition || [];
        }
        else if (newControl.name === 'category') {
            newControl.options = [
                { id: "smartphones", label: "Smartphones" },
                { id: "laptops", label: "Laptops" },
                { id: "monitors", label: "Monitors" },
                { id: "accessories", label: "Accessories" },
            ];
        }
      }
      return newControl;
    }).filter(control => {
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
              transition: { staggerChildren: 0.1 }
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
                        displayType: data.displayType || "",
                        laptopType: data.laptopType || "",
                        screenSize: data.screenSize || "",
                        frameStyle: data.frameStyle || "",
                        screenResolution: data.screenResolution || "",
                        ports: data.ports || "",
                        accessoryCategory: data.accessoryCategory || "",
                        specificAccessory: data.specificAccessory || "",
                        totalStock: data.totalStock || "",
                        condition: data.condition || "Brand New",
                      });
                      setUploadedImageUrls(data.images || []);
                    }}
                    setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                    setCurrentEditedId={setCurrentEditedId}
                    setProductToDelete={setProductToDelete}
                    setShowDeleteModal={setShowDeleteModal} 
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

      {/* Global Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)} // Close when clicking outside
          >
            <div
              className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
}

export default AdminProducts;
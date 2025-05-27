


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
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} from "@/store/admin/products-slice";

const initialFormData = {
  images: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  laptopType: "",
  storage: "",
  ram: "",
  processor: "",
  displayType: "",
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
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async (productId) => {
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteProduct(productId)).unwrap();
      if (result.success) {
        toast.success("Product deleted");
        dispatch(fetchAllProducts());
      } else {
        throw new Error(result.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      'title', 'description', 'category', 'brand', 
      'price', 'totalStock', 'condition'
    ];
    
    const basicValid = requiredFields.every(field => {
      const value = formData[field];
      return value !== "" && value !== undefined && value !== null;
    });
    
    let categoryValid = true;
    if (formData.category === 'laptops') {
      categoryValid = !!formData.processor && !!formData.laptopType;
    }
    if (['laptops', 'smartphones'].includes(formData.category)) {
      categoryValid = categoryValid && !!formData.ram;
    }
    
    const imagesValid = currentEditedId 
      ? true 
      : uploadedImageUrls.length > 0;
    
    return basicValid && categoryValid && imagesValid;
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
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                    setFormData={setFormData}
                    setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                    setCurrentEditedId={setCurrentEditedId}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
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
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || imageLoadingState}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
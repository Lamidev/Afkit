


// import { Fragment, useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import ProductImageUpload from "@/components/admin-view/image-upload";
// import CommonForm from "@/components/common/form";
// import AdminProductTile from "@/components/admin-view/product-tile";
// import { addProductFormElements } from "@/config";
// import {
//   addNewProduct,
//   editProduct,
//   fetchAllProducts,
//   deleteProduct,
// } from "@/store/admin/products-slice";

// const initialFormData = {
//   images: [],
//   title: "",
//   description: "",
//   category: "",
//   brand: "",
//   price: "",
//   laptopType: "",
//   storage: "",
//   ram: "",
//   processor: "",
//   displayType: "",
//   totalStock: "",
//   condition: "Brand New",
// };

// function AdminProducts() {
//   const dispatch = useDispatch();
//   const { productList, isLoading } = useSelector((state) => state.adminProducts);
//   const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
//   const [formData, setFormData] = useState(initialFormData);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
//   const [imageLoadingState, setImageLoadingState] = useState(false);
//   const [currentEditedId, setCurrentEditedId] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllProducts());
//   }, [dispatch]);

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
//       images: uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images,
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
//         dispatch(fetchAllProducts());
//         setOpenCreateProductsDialog(false);
//         resetForm();
//       } else {
//         throw new Error(result?.payload?.message || "Operation failed");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleDelete = async (productId) => {
//     setIsDeleting(true);
//     try {
//       const result = await dispatch(deleteProduct(productId)).unwrap();
//       if (result.success) {
//         toast.success("Product deleted");
//         dispatch(fetchAllProducts());
//       } else {
//         throw new Error(result.message || "Delete failed");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const isFormValid = () => {
//     const requiredFields = [
//       'title', 'description', 'category', 'brand', 
//       'price', 'totalStock', 'condition'
//     ];
    
//     const basicValid = requiredFields.every(field => {
//       const value = formData[field];
//       return value !== "" && value !== undefined && value !== null;
//     });
    
//     let categoryValid = true;
//     if (formData.category === 'laptops') {
//       categoryValid = !!formData.processor && !!formData.laptopType;
//     }
//     if (['laptops', 'smartphones'].includes(formData.category)) {
//       categoryValid = categoryValid && !!formData.ram;
//     }
    
//     const imagesValid = currentEditedId 
//       ? true 
//       : uploadedImageUrls.length > 0;
    
//     return basicValid && categoryValid && imagesValid;
//   };

//   return (
//     <Fragment>
//       <div className="space-y-6">
//         {/* Header and Add Button */}
//         <motion.div
//           className="flex justify-between items-center"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <h1 className="text-2xl font-bold">Manage Products</h1>
//           <Button onClick={() => setOpenCreateProductsDialog(true)}>
//             Add New Product
//           </Button>
//         </motion.div>

//         {/* Products Grid */}
//         {isLoading ? (
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
//             ))}
//           </div>
//         ) : productList.length > 0 ? (
//           <motion.div
//             className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//             initial="hidden"
//             animate="visible"
//             variants={{
//               hidden: { opacity: 0 },
//               visible: { 
//                 opacity: 1, 
//                 transition: { staggerChildren: 0.1 } 
//               },
//             }}
//           >
//             <AnimatePresence>
//               {productList.map((product) => (
//                 <motion.div
//                   key={product._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <AdminProductTile
//                     product={product}
//                     setFormData={setFormData}
//                     setOpenCreateProductsDialog={setOpenCreateProductsDialog}
//                     setCurrentEditedId={setCurrentEditedId}
//                     handleDelete={handleDelete}
//                     isDeleting={isDeleting}
//                   />
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </motion.div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-12">
//             <p className="text-muted-foreground">No products found</p>
//             <Button 
//               className="mt-4"
//               onClick={() => setOpenCreateProductsDialog(true)}
//             >
//               Add Your First Product
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Product Form Sheet */}
//       <Sheet
//         open={openCreateProductsDialog}
//         onOpenChange={(open) => {
//           if (!open) {
//             setOpenCreateProductsDialog(false);
//             resetForm();
//           }
//         }}
//       >
//         <SheetContent
//           side="right"
//           className="overflow-y-auto w-full sm:max-w-lg"
//         >
//           <SheetHeader>
//             <SheetTitle>
//               {currentEditedId ? "Edit Product" : "Add New Product"}
//             </SheetTitle>
//           </SheetHeader>

//           <div className="py-4 space-y-6">
//             <ProductImageUpload
//               imageFiles={imageFiles}
//               setImageFiles={setImageFiles}
//               uploadedImageUrls={uploadedImageUrls}
//               setUploadedImageUrls={setUploadedImageUrls}
//               setImageLoadingState={setImageLoadingState}
//               imageLoadingState={imageLoadingState}
//               isEditMode={!!currentEditedId}
//             />

//             <CommonForm
//               onSubmit={onSubmit}
//               formData={formData}
//               setFormData={setFormData}
//               buttonText={currentEditedId ? "Update Product" : "Add Product"}
//               formControls={addProductFormElements}
//               isBtnDisabled={!isFormValid() || imageLoadingState}
//             />
//           </div>
//         </SheetContent>
//       </Sheet>
//     </Fragment>
//   );
// }

// export default AdminProducts;

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
import { addProductFormElements, filterOptions } from "@/config"; // Import filterOptions
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
  storage: "",
  ram: "",
  processor: "",
  displayType: "",
  laptopType: "",
  screenSize: "",        // NEW
  frameStyle: "",        // NEW
  screenResolution: "",  // NEW
  ports: "",             // NEW
  accessoryCategory: "", // NEW
  specificAccessory: "", // NEW
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
    const commonRequiredFields = [
      'title', 'description', 'category', 'price', 'totalStock', 'condition'
    ];

    const basicValid = commonRequiredFields.every(field => {
      const value = formData[field];
      // Ensure the value is not empty for strings, and not null/undefined/zero for numbers
      return (typeof value === 'string' && value.trim() !== '') ||
             (typeof value === 'number' && value !== null && value !== undefined && value >= 0); // Price and Stock can be 0, but not null/undefined
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
      ? (formData.images && formData.images.length > 0) // For edit, check existing images
      : uploadedImageUrls.length > 0; // For new, check newly uploaded images

    return basicValid && categorySpecificValid && imagesValid;
  };

  // Function to dynamically get form controls with updated options
  const getDynamicFormControls = () => {
    const dynamicControls = addProductFormElements.map(control => {
      let newControl = { ...control }; // Create a shallow copy

      if (newControl.componentType === 'select') {
        // Handle options based on the current category
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
        // Logic for Monitor specific fields
        else if (
          formData.category === 'monitors' &&
          (newControl.name === 'brand' || newControl.name === 'screenSize' || newControl.name === 'frameStyle' || newControl.name === 'screenResolution' || newControl.name === 'ports')
        ) {
          newControl.options = filterOptions.monitors?.[newControl.name] || [];
        }
        // Logic for Accessory category and specific accessory
        else if (newControl.name === 'accessoryCategory') {
          // This category's options are already static in addProductFormElements, but ensure it's pulled from filterOptions.accessories.category if needed
          newControl.options = filterOptions.accessories?.category || [];
        } else if (newControl.name === 'specificAccessory' && formData.accessoryCategory) {
          // This is crucial: specificAccessory options depend on accessoryCategory
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
        // Condition options are universal, so they can remain static or be pulled from filterOptions.condition
        else if (newControl.name === 'condition') {
          newControl.options = filterOptions.condition || [];
        }
        // Ensure category options are always available (even if set statically in config)
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
      // Apply the visibleIf logic to show/hide controls
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
                    setFormData={(data) => {
                      // When editing, populate all fields from the product object
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
                      setUploadedImageUrls(data.images || []); // Set uploaded images for edit mode
                    }}
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
              formControls={getDynamicFormControls()} // Pass the dynamically generated controls here
              isFormValid={isFormValid}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
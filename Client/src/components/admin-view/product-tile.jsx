
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, Trash2, Pencil, Check, X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteProduct, hideProduct, unhideProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { toast } from "sonner";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
}) {
  const dispatch = useDispatch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmHide, setShowConfirmHide] = useState(false);
  const [showConfirmUnhide, setShowConfirmUnhide] = useState(false);

  const handleDeleteLocally = async (productId) => {
    try {
      const result = await dispatch(deleteProduct(productId)).unwrap();
      if (result.success) {
        toast.success("Product deleted successfully!");
        dispatch(fetchAllProducts());
      } else {
        throw new Error(result.message || "Failed to delete product.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during deletion.");
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const handleHideProduct = async (productId) => {
    try {
      const result = await dispatch(hideProduct(productId)).unwrap();
      if (result.success) {
        toast.success("Product hidden successfully!");
        dispatch(fetchAllProducts());
      } else {
        throw new Error(result.message || "Failed to hide product.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while hiding product.");
      console.error("Hide product error:", error);
    } finally {
      setShowConfirmHide(false);
    }
  };

  const handleUnhideProduct = async (productId) => {
    try {
      const result = await dispatch(unhideProduct(productId)).unwrap();
      if (result.success) {
        toast.success("Product unhidden successfully!");
        dispatch(fetchAllProducts());
      } else {
        throw new Error(result.message || "Failed to unhide product.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while unhiding product.");
      console.error("Unhide product error:", error);
    } finally {
      setShowConfirmUnhide(false);
    }
  };

  return (
    <motion.div
      className={`w-full rounded-lg shadow-md overflow-hidden transition-all relative group ${
        product.isHidden 
          ? "border-2 border-dashed border-purple-400 bg-purple-50" 
          : "border-2 border-transparent bg-white hover:shadow-lg"
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {product.isHidden && (
        <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <EyeOff className="h-3 w-3" />
          <span>HIDDEN</span>
        </span>
      )}

      <div className="relative aspect-square">
        {product?.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <ImageOff className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
        Stock: {product.totalStock}
      </div>

      <div className="p-3 space-y-1">
        <h2 className="text-sm font-semibold line-clamp-1">{product.title}</h2>

        <div className="flex items-center justify-between">
          <span className="text-primary text-sm font-medium">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.condition}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[100px] text-xs h-8"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product._id);
              setFormData({
                ...product,
                images: product.images || [],
              });
            }}
          >
            <Pencil className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">Edit</span>
          </Button>

          {product.isHidden ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-[100px] text-xs h-8 bg-green-100 border-green-400 text-green-800 hover:bg-green-200 hover:text-green-900"
              onClick={() => setShowConfirmUnhide(true)}
            >
              <Eye className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Make Visible</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-[100px] text-xs h-8 bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200 hover:text-purple-900"
              onClick={() => setShowConfirmHide(true)}
            >
              <EyeOff className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Hide</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[100px] text-xs h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => setShowConfirmDelete(true)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>

        <AnimatePresence>
          {showConfirmDelete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-white/95 rounded-lg p-4 border-2 border-red-400"
            >
              <div className="bg-red-100 p-3 rounded-full mb-3">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-sm font-bold mb-1">Confirm Delete Product</h2>
              <p className="text-xs text-gray-600 mb-3 text-center">
                This action cannot be undone. The product will be permanently removed.
              </p>
              <div className="flex flex-wrap justify-center gap-3 w-full px-2">
                <Button
                  onClick={() => handleDeleteLocally(product._id)}
                  className="min-w-[120px] bg-red-500 hover:bg-red-600 text-white h-8"
                  size="sm"
                >
                  <Check className="mr-1 h-3 w-3" /> Delete
                </Button>
                <Button
                  onClick={() => setShowConfirmDelete(false)}
                  className="min-w-[120px] h-8"
                  variant="outline"
                  size="sm"
                >
                  <X className="mr-1 h-3 w-3" /> Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConfirmHide && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-white/95 rounded-lg p-4 border-2 border-purple-400"
            >
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <EyeOff className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-sm font-bold mb-1">Confirm Hide Product</h2>
              <p className="text-xs text-gray-600 mb-3 text-center">
                This product will be hidden from customers but remain in your inventory.
              </p>
              <div className="flex flex-wrap justify-center gap-3 w-full px-2">
                <Button
                  onClick={() => handleHideProduct(product._id)}
                  className="min-w-[120px] bg-purple-500 hover:bg-purple-600 text-white h-8"
                  size="sm"
                >
                  <Check className="mr-1 h-3 w-3" /> Hide
                </Button>
                <Button
                  onClick={() => setShowConfirmHide(false)}
                  className="min-w-[120px] h-8"
                  variant="outline"
                  size="sm"
                >
                  <X className="mr-1 h-3 w-3" /> Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConfirmUnhide && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-white/95 rounded-lg p-4 border-2 border-green-400"
            >
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-sm font-bold mb-1">Confirm Make Product Visible</h2>
              <p className="text-xs text-gray-600 mb-3 text-center">
                This product will be visible to customers in your store.
              </p>
              <div className="flex flex-wrap justify-center gap-3 w-full px-2">
                <Button
                  onClick={() => handleUnhideProduct(product._id)}
                  className="min-w-[120px] bg-green-500 hover:bg-green-600 text-white h-8"
                  size="sm"
                >
                  <Check className="mr-1 h-3 w-3" /> Unhide
                </Button>
                <Button
                  onClick={() => setShowConfirmUnhide(false)}
                  className="min-w-[120px] h-8"
                  variant="outline"
                  size="sm"
                >
                  <X className="mr-1 h-3 w-3" /> Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default AdminProductTile;
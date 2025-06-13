import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, Trash2, Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteProduct } from "@/store/admin/products-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
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

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
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

        <div className="flex gap-2 pt-2">
          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8"
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
            Edit
          </Button>

          {/* Delete Button - Now visible by default and matches Edit button style */}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => setShowConfirmDelete(true)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        </div>

        {/* Delete Confirmation Overlay */}
        <AnimatePresence>
          {showConfirmDelete && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-white/90 rounded-lg p-4"
            >
              <h2 className="text-sm font-semibold mb-3 text-center">
                Are you sure you want to delete this product?
              </h2>
              <div className="flex justify-center gap-3 w-full px-2">
                <Button
                  onClick={() => handleDeleteLocally(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white flex-1 h-8"
                  size="sm"
                >
                  <Check className="mr-1 h-3 w-3" /> Delete
                </Button>
                <Button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 h-8"
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
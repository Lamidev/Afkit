import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { ImageOff, Trash2, Pencil, Check, X } from "lucide-react"; // Import Check and X for confirmation
import { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { deleteProduct } from "@/store/admin/products-slice"; // Import deleteProduct action
import { fetchAllProducts } from "@/store/admin/products-slice"; // Import fetchAllProducts for refresh
import { toast } from "sonner"; // Import toast

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  // Removed setProductToDelete, setShowDeleteModal props as they are no longer needed here
}) {
  const dispatch = useDispatch(); // Initialize useDispatch

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Local state for delete confirmation

  const handleDeleteLocally = async (productId) => {
    try {
      const result = await dispatch(deleteProduct(productId)).unwrap();
      if (result.success) {
        toast.success("Product deleted successfully!");
        dispatch(fetchAllProducts()); // Refresh the product list immediately
      } else {
        throw new Error(result.message || "Failed to delete product.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during deletion.");
    } finally {
      setShowConfirmDelete(false); // Always close the confirmation overlay
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

        <div className="flex gap-1 pt-2">
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

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
            onClick={() => setShowConfirmDelete(true)} // Show local confirmation
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Local Delete Confirmation Overlay */}
        <AnimatePresence>
          {showConfirmDelete && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-white/90 rounded-lg p-2" // Removed backdrop-blur-sm
            >
              <h2 className="text-sm font-semibold mb-2">Confirm Delete?</h2>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => handleDeleteLocally(product._id)} // Call local delete function
                  className="bg-red-500 hover:bg-red-600 text-white text-xs h-8 px-2"
                  size="sm"
                >
                  <Check className="mr-1 h-3 w-3" /> Yes
                </Button>
                <Button
                  onClick={() => setShowConfirmDelete(false)} // Cancel local confirmation
                  className="bg-gray-300 hover:bg-gray-400 text-black text-xs h-8 px-2"
                  size="sm"
                >
                  <X className="mr-1 h-3 w-3" /> No
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

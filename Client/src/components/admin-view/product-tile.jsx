
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ImageOff, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  setProductToDelete,
  setShowDeleteModal,
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN"
    }).format(price);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
                images: product.images || []
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
            onClick={() => setShowConfirmDelete(true)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {showConfirmDelete && (
          <div className="absolute inset-0 flex justify-center items-center z-50 bg-white bg-opacity-90 rounded-lg">
            <div className="p-2 text-center">
              <h2 className="text-sm font-semibold mb-2">
                Confirm Deletion
              </h2>
              <p className="text-xs mb-3">
                Are you sure you want to delete this product?
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => {
                    setProductToDelete(product._id);
                    setShowDeleteModal(true);
                    setShowConfirmDelete(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs h-8 px-2"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
                <Button
                  onClick={() => setShowConfirmDelete(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black text-xs h-8 px-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default AdminProductTile;
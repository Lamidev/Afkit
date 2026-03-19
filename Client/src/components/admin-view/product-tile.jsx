
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, Trash2, Pencil, Check, X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteProduct,
  hideProduct,
  unhideProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { toast } from "sonner";
import { formatAestheticId } from "@/utils/common";

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
      maximumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmHide, setShowConfirmHide] = useState(false);
  const [showConfirmUnhide, setShowConfirmUnhide] = useState(false);

  const handleDeleteLocally = async (productId) => {
    try {
      const result = await dispatch(deleteProduct(productId)).unwrap();
      if (result.success) {
        toast.success("Product deleted!");
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
        toast.success("Product hidden!");
        dispatch(fetchAllProducts());
      } else {
        throw new Error(result.message || "Failed to hide product.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while hiding product.");
    } finally {
      setShowConfirmHide(false);
    }
  };

  const handleUnhideProduct = async (productId) => {
    try {
      const result = await dispatch(unhideProduct(productId)).unwrap();
      if (result.success) {
        toast.success("Product visible!");
        dispatch(fetchAllProducts());
      } else {
        throw new Error(result.message || "Failed to unhide product.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setShowConfirmUnhide(false);
    }
  };

  return (
    <div
      className={`min-w-0 w-full rounded-xl overflow-hidden relative flex flex-col transition-all duration-200 ${
        product.isHidden
          ? "border-2 border-dashed border-purple-400 bg-purple-50"
          : "border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-primary/30"
      }`}
    >
      {/* Hidden badge */}
      {product.isHidden && (
        <span className="absolute top-1.5 left-1.5 z-10 bg-purple-500 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 uppercase">
          <EyeOff className="h-2 w-2" />
          Hidden
        </span>
      )}

      {/* Stock badge */}
      <span className="absolute top-1.5 right-1.5 z-10 bg-red-500 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full">
        {product.totalStock}
      </span>

      {/* Image */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden shrink-0">
        {product?.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <ImageOff className="h-8 w-8 text-slate-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Title — fully visible, wraps naturally */}
        <h2 className="text-xs font-semibold text-slate-800 leading-snug break-words">
          {product.title}
        </h2>

        {/* Price */}
        <div className="flex flex-col">
          {product.salePrice > 0 ? (
            <>
              <span className="text-xs text-slate-900 line-through font-bold leading-none mb-0.5">
                {formatPrice(product.price)}
              </span>
              <p className="text-xs font-bold text-red-600 leading-none">
                {formatPrice(product.salePrice)}
              </p>
            </>
          ) : (
            <p className="text-xs font-bold text-red-600 leading-none">
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        {/* Condition */}
        <p className="text-[10px] text-slate-500 font-medium leading-none">
          {product.condition}
        </p>

        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] text-slate-600 font-semibold leading-none truncate">
            {product.brand}
          </p>
        )}

        {/* Category & ID */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.category && (
            <span className="text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full capitalize">
              {product.category}
            </span>
          )}
          <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest">
            {formatAestheticId(product._id, "GAD")}
          </span>
        </div>

        {/* Storage / RAM for phones & laptops */}
        {(product.storage || product.ram) && (
          <p className="text-[9px] text-slate-500 leading-snug">
            {[product.storage, product.ram].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-1 pt-1.5 mt-auto border-t border-slate-100">
          <button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product._id);
              setFormData({ ...product, images: product.images || [] });
            }}
            title="Edit"
            className="flex items-center justify-center gap-0.5 h-7 rounded-lg bg-primary hover:bg-primary/90 text-white text-[9px] font-semibold transition-colors"
          >
            <Pencil className="h-3 w-3" />
            <span>Edit</span>
          </button>

          {product.isHidden ? (
            <button
              onClick={() => setShowConfirmUnhide(true)}
              title="Make Visible"
              className="flex items-center justify-center gap-0.5 h-7 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[9px] font-semibold transition-colors"
            >
              <Eye className="h-3 w-3" />
              <span>Show</span>
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmHide(true)}
              title="Hide"
              className="flex items-center justify-center gap-0.5 h-7 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-semibold transition-colors"
            >
              <EyeOff className="h-3 w-3" />
              <span>Hide</span>
            </button>
          )}

          <button
            onClick={() => setShowConfirmDelete(true)}
            title="Delete"
            className="flex items-center justify-center gap-0.5 h-7 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[9px] font-semibold transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            <span>Del</span>
          </button>
        </div>
      </div>

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-3 bg-white/97 rounded-xl border-2 border-red-400"
          >
            <div className="bg-red-100 p-2.5 rounded-full mb-2">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-xs font-bold text-slate-800 text-center mb-1">Delete this product?</p>
            <p className="text-[10px] text-slate-500 text-center mb-3">This cannot be undone.</p>
            <div className="flex gap-2 w-full">
              <Button
                onClick={() => handleDeleteLocally(product._id)}
                className="flex-1 h-8 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg"
              >
                <Check className="h-3 w-3 mr-1" /> Yes
              </Button>
              <Button
                onClick={() => setShowConfirmDelete(false)}
                variant="outline"
                className="flex-1 h-8 text-xs font-bold rounded-lg"
              >
                <X className="h-3 w-3 mr-1" /> No
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hide Confirm ── */}
      <AnimatePresence>
        {showConfirmHide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-3 bg-white/97 rounded-xl border-2 border-purple-400"
          >
            <div className="bg-purple-100 p-2.5 rounded-full mb-2">
              <EyeOff className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs font-bold text-slate-800 text-center mb-1">Hide from customers?</p>
            <p className="text-[10px] text-slate-500 text-center mb-3">Product stays in inventory.</p>
            <div className="flex gap-2 w-full">
              <Button
                onClick={() => handleHideProduct(product._id)}
                className="flex-1 h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg"
              >
                <Check className="h-3 w-3 mr-1" /> Hide
              </Button>
              <Button
                onClick={() => setShowConfirmHide(false)}
                variant="outline"
                className="flex-1 h-8 text-xs font-bold rounded-lg"
              >
                <X className="h-3 w-3 mr-1" /> Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Unhide Confirm ── */}
      <AnimatePresence>
        {showConfirmUnhide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-3 bg-white/97 rounded-xl border-2 border-green-400"
          >
            <div className="bg-green-100 p-2.5 rounded-full mb-2">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-xs font-bold text-slate-800 text-center mb-1">Make visible to customers?</p>
            <p className="text-[10px] text-slate-500 text-center mb-3">Shows in store for shoppers.</p>
            <div className="flex gap-2 w-full">
              <Button
                onClick={() => handleUnhideProduct(product._id)}
                className="flex-1 h-8 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg"
              >
                <Check className="h-3 w-3 mr-1" /> Show
              </Button>
              <Button
                onClick={() => setShowConfirmUnhide(false)}
                variant="outline"
                className="flex-1 h-8 text-xs font-bold rounded-lg"
              >
                <X className="h-3 w-3 mr-1" /> Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminProductTile;

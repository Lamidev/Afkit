

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, CheckCircle, AlertCircle, Share2 } from "lucide-react";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { toast } from "sonner";
import {
  fetchProductsByBrand,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import LoadingSpinner from "@/components/shopping-view/loading-spinner";
import { getOrCreateSessionId } from "@/components/utils/session";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { recordLinkShare } from "@/store/common-slice/share-slice/index"; // CORRECTED IMPORT PATH

export default function ShoppingProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productDetails, relatedProducts } = useSelector(
    (state) => state.shopProducts
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showInstagramModal, setShowInstagramModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      window.scrollTo(0, 0);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!productDetails) return;
    const cartItem = cartItems.items?.find(
      (item) => item.productId === productDetails._id
    );
    setQuantity(cartItem ? cartItem.quantity : 1);
  }, [productDetails, cartItems.items]);

  useEffect(() => {
    if (productDetails?.brand) {
      dispatch(fetchProductsByBrand(productDetails.brand));
    }
  }, [productDetails, dispatch]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = user?.id;
        const sessionId = userId ? null : getOrCreateSessionId();

        if (!userId && !sessionId) {
          console.warn("No user or session info available");
          return;
        }

        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        if (!user) {
          localStorage.removeItem("guestSessionId");
        }
      }
    };

    fetchCart();
  }, [dispatch, user]);

  const handleAddToCart = useCallback(
    async (productIdToAdd, stockAvailable) => {
      try {
        const userId = user?.id;
        const sessionId = userId ? null : getOrCreateSessionId();

        if (!userId && !sessionId) {
          navigate("/auth/login");
          toast.error("Please login to add items to the cart");
          return;
        }

        const currentCartItems = cartItems?.items || [];
        const existingItem = currentCartItems.find(
          (item) => item.productId === productIdToAdd
        );

        // Always add just 1 for existing items, use quantity picker for new items
        const quantityToAdd = existingItem ? 1 : quantity;

        if (
          existingItem &&
          existingItem.quantity + quantityToAdd > stockAvailable
        ) {
          toast.error(
            `Maximum available quantity (${stockAvailable}) reached`,
            {
              icon: <AlertCircle className="text-red-500" />,
            }
          );
          return;
        }

        if (quantityToAdd > stockAvailable) {
          toast.error(`Only ${stockAvailable} quantity can be added`, {
            icon: <AlertCircle className="text-red-500" />,
          });
          return;
        }

        const response = await dispatch(
          addToCart({
            userId,
            productId: productIdToAdd,
            quantity: quantityToAdd,
            sessionId,
          })
        ).unwrap();

        if (response.success) {
          await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
          toast.success("Product added to cart", {
            icon: <CheckCircle className="text-green-500" />,
          });
        }
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error("Failed to add product to cart");
      }
    },
    [user, dispatch, navigate, cartItems, quantity]
  );

  const handleUpdateQuantity = (type) => {
    if (type === "plus") {
      if (quantity + 1 > productDetails.totalStock) {
        toast.error(`Only ${productDetails.totalStock} available`);
        return;
      }
      setQuantity(quantity + 1);
    } else {
      if (quantity - 1 < 1) return;
      setQuantity(quantity - 1);
    }
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/shop/product/${productId}`);
    window.scrollTo(0, 0);
  };

  const handleOrderOnWhatsApp = () => {
    const phoneNumber = "2348164014304";
    const productLink = `${window.location.origin}/shop/product/${productDetails._id}`;
    const message = `Hello AFKiT,\n\nI'm interested in *"${productDetails.title}"* for *₦${Number(
      productDetails.price
    ).toLocaleString("en-NG")}*.\n\n*Quantity:* ${quantity}\n\nIs it still available?\n\n🔗 Product Link:\n${productLink}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    // Record the share
    dispatch(
      recordLinkShare({
        productId: productDetails._id,
        productTitle: productDetails.title,
        shareDestination: "WhatsApp",
        sourcePage: "ProductDetails",
        sessionId: user?.id ? null : getOrCreateSessionId(),
      })
    );
  };

  const handleOrderOnInstagram = () => {
    setShowInstagramModal(true);
  };

  const copyInstagramMessage = () => {
    const productLink = `${window.location.origin}/shop/product/${productDetails._id}`;
    const message = `Hello AFKiT,\n\nI'm interested in "${productDetails.title}" for ₦${Number(
      productDetails.price
    ).toLocaleString("en-NG")}.\n\nQuantity: ${quantity}.\n\nIs it still available?\n\nProduct Link: ${productLink}`;

    navigator.clipboard.writeText(message);
    toast.success("Message copied to clipboard");
    window.open(
      "https://www.instagram.com/afkit_official?igsh=MXZ2MGZyOGowaDlmYw==",
      "_blank"
    );
    setShowInstagramModal(false);

    // Record the share
    dispatch(
      recordLinkShare({
        productId: productDetails._id,
        productTitle: productDetails.title,
        shareDestination: "Instagram",
        sourcePage: "ProductDetails",
        sessionId: user?.id ? null : getOrCreateSessionId(),
      })
    );
  };

  const handleCopyLink = () => {
    const productLink = `${window.location.origin}/shop/product/${productDetails._id}`;
    navigator.clipboard.writeText(productLink);
    toast.success("Product link copied to clipboard!");

    // Record the share
    dispatch(
      recordLinkShare({
        productId: productDetails._id,
        productTitle: productDetails.title,
        shareDestination: "CopyLink",
        sourcePage: "ProductDetails",
        sessionId: user?.id ? null : getOrCreateSessionId(),
      })
    );
  };

  const filteredRelatedProducts =
    productDetails?.brand && relatedProducts
      ? relatedProducts?.filter((p) => p._id !== productDetails?._id)?.slice(0, 4)
      : [];

  if (!productDetails) {
    return (
      <div className="container py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const productImages =
    productDetails.images?.length > 0
      ? productDetails.images
      : productDetails.image
      ? [productDetails.image]
      : [];

  const renderDescription = (description) => {
    if (!description) return null;

    const desc = typeof description === "string" ? description : String(description);

    return (
      <div className="whitespace-pre-wrap font-normal text-base text-gray-700">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="mb-4" {...props} />,
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5 mb-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5 mb-4" {...props} />
            ),
            li: ({ node, ...props }) => <li className="mb-2" {...props} />,
            strong: ({ node, ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
            em: ({ node, ...props }) => <em className="italic" {...props} />,
          }}
        >
          {desc}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col md:flex-row gap-4">
          {productImages.length > 1 && (
            <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productDetails.title} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div
            className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center ${
              productImages.length > 1 ? "order-1 md:order-2 flex-1" : "w-full"
            }`}
          >
            <img
              src={productImages[selectedImageIndex]}
              alt={productDetails.title}
              className="object-contain w-full max-h-full p-6"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {productDetails.title}
            </h1>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <p className="text-2xl font-semibold text-primary">
              ₦{Number(productDetails.price).toLocaleString("en-NG")}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                disabled={quantity === 1}
                onClick={() => handleUpdateQuantity("minus")}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleUpdateQuantity("plus")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            className="h-12 w-full bg-blue-800 hover:bg-blue-600 text-white font-bold"
            onClick={() =>
              handleAddToCart(productDetails._id, productDetails.totalStock)
            }
            disabled={productDetails.totalStock === 0}
          >
            {productDetails.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {" "}
            {/* Changed to 3 columns for Share Link */}
            <Button
              className="h-12 bg-green-700 hover:bg-green-600 text-white font-bold"
              onClick={handleOrderOnWhatsApp}
            >
              Order on WhatsApp
            </Button>
            <Button
              className="h-12 bg-pink-700 hover:bg-pink-600 text-white font-bold"
              onClick={handleOrderOnInstagram}
            >
              Order on Instagram
            </Button>
            <Button
              className="h-12 bg-gray-600 hover:bg-gray-700 text-white font-bold flex items-center justify-center gap-2"
              onClick={handleCopyLink}
            >
              <Share2 className="h-5 w-5" /> Share Link
            </Button>
          </div>

          <Separator />
        </div>
      </div>

      {productDetails.description && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <div className="bg-white p-6 rounded-lg border">
            {renderDescription(productDetails.description)}
          </div>
        </div>
      )}

      {filteredRelatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-center mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            {filteredRelatedProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleRelatedProductClick(product._id)}
                className="cursor-pointer"
              >
                <ShoppingProductTile
                  product={product}
                  handleAddToCart={handleAddToCart}
                  handleViewDetails={handleRelatedProductClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {showInstagramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Order on Instagram</h3>
            <p className="mb-4">
              Copy this message and paste it when you DM us on Instagram:
            </p>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="whitespace-pre-wrap">
                Hello AFKiT,\n\nI'm interested in "{productDetails.title}" for ₦
                {Number(productDetails.price).toLocaleString("en-NG")}.
                {"\n\n"}Quantity: {quantity}.{"\n\n"}Is it still available?
                {"\n\n"}Product Link: {window.location.origin}/shop/product/
                {productDetails._id}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowInstagramModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold"
                onClick={copyInstagramMessage}
              >
                Copy & Open Instagram
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
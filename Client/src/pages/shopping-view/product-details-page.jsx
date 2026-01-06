
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, CheckCircle, AlertCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { toast } from "sonner";
import {
  fetchProductsByBrand,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import LoadingSpinner from "@/components/shopping-view/loading-spinner";
import { getOrCreateSessionId } from "@/components/utils/session";
import { recordLinkShare } from "@/store/common-slice/share-slice/index";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet-async";

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
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const thumbnailContainerRef = useRef(null);
  const mainImageRef = useRef(null);
  const THUMBNAILS_TO_SHOW = 4;

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      window.scrollTo(0, 0);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails?.description) {
      setIsContentLoading(false);
    }
  }, [productDetails]);

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

  const getAbsoluteImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return `${window.location.origin}${imagePath}`;
    return `${window.location.origin}/${imagePath}`;
  };

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
    // constant productLink = `${window.location.origin}/shop/product/${productDetails._id}`;
    const productLink = `${window.location.origin}/api/og/product/${productDetails._id}`;
    const message = `🛍️ *AFKiT Product Inquiry*\n\n*Product:* ${productDetails.title}\n*Price:* ₦${Number(productDetails.price).toLocaleString("en-NG")}\n*Quantity:* ${quantity}\n\nHello AFKiT, I'm interested in this product. Is it available?\n\n🔗 *Product Link:* ${productLink}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

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
    // const productLink = `${window.location.origin}/shop/product/${productDetails._id}`;
    const productLink = `${window.location.origin}/api/og/product/${productDetails._id}`;
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
    // const productLink = `${window.location.origin}/shop/product/${productDetails._id}`;
    const productLink = `${window.location.origin}/api/og/product/${productDetails._id}`;
    navigator.clipboard.writeText(productLink);
    toast.success("Product link copied to clipboard!");

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

  const navigateImage = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex(prev =>
        prev === productImages.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex(prev =>
        prev === 0 ? productImages.length - 1 : prev - 1
      );
    }
  };

  const navigateThumbnails = (direction) => {
    if (direction === 'next' && thumbnailStartIndex + THUMBNAILS_TO_SHOW < productImages.length) {
      setThumbnailStartIndex(prev => prev + 1);
    } else if (direction === 'prev' && thumbnailStartIndex > 0) {
      setThumbnailStartIndex(prev => prev - 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const filteredRelatedProducts =
    productDetails?.brand && relatedProducts
      ? relatedProducts?.filter((p) => p._id !== productDetails?._id)?.slice(0, 4)
      : [];

  const renderDescription = (description) => {
    if (!description) return null;
    return (
      <div
        className="rich-text-content prose prose-gray max-w-none 
                  prose-headings:font-bold
                  prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                  prose-p:leading-relaxed prose-p:my-4
                  prose-ul:my-4 prose-ol:my-4
                  prose-li:my-2
                  prose-strong:font-bold prose-strong:text-gray-900
                  prose-em:italic
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                  prose-blockquote:pl-4 prose-blockquote:italic
                  prose-blockquote:text-gray-600
                  prose-a:text-blue-600 prose-a:underline
                  [&_u]:underline [&_s]:line-through"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(description)
        }}
      />
    );
  };

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

  const visibleThumbnails = productImages.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + THUMBNAILS_TO_SHOW
  );

  const mainImage = getAbsoluteImageUrl(productImages[0] || productDetails.image);
  const descriptionText = `Buy ${productDetails.title} for ₦${Number(productDetails.price).toLocaleString("en-NG")}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>{productDetails.title} - AFKiT</title>
        <meta name="description" content={descriptionText} />

        <meta property="og:title" content={productDetails.title} />
        <meta property="og:description" content={descriptionText} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="AFKiT" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={productDetails.title} />
        <meta name="twitter:description" content={descriptionText} />
        <meta name="twitter:image" content={mainImage} />

        <meta property="product:price:amount" content={productDetails.price} />
        <meta property="product:price:currency" content="NGN" />
        <meta property="product:availability" content={productDetails.totalStock > 0 ? "in stock" : "out of stock"} />
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative aspect-square rounded-xl overflow-hidden group">
            {/* Main Image - Takes full container */}
            <img
              ref={mainImageRef}
              src={getAbsoluteImageUrl(productImages[selectedImageIndex])}
              alt={productDetails.title}
              className="w-full h-full object-contain transition-all duration-300 ease-in-out transform"
            />

            {/* Navigation Arrows - Only show if multiple images */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white 
                           rounded-full p-3 shadow-xl transition-all duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                           border border-gray-200 hover:shadow-2xl"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white 
                           rounded-full p-3 shadow-xl transition-all duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                           border border-gray-200 hover:shadow-2xl"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Gallery - Larger and horizontal at bottom */}
          {productImages.length > 1 && (
            <div className="relative">
              <div className="flex items-center gap-3">
                {/* Previous Thumbnail Button */}
                {thumbnailStartIndex > 0 && (
                  <button
                    onClick={() => navigateThumbnails('prev')}
                    className="flex-shrink-0 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 
                             transition-colors shadow-sm hover:shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                )}

                {/* Thumbnails Container - Larger thumbnails */}
                <div
                  ref={thumbnailContainerRef}
                  className="flex gap-3 overflow-hidden flex-1 justify-center"
                >
                  {visibleThumbnails.map((img, index) => {
                    const actualIndex = thumbnailStartIndex + index;
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => handleThumbnailClick(actualIndex)}
                        className={`flex-shrink-0 w-30 h-30 rounded-lg overflow-hidden border-3 transition-all duration-300 ease-in-out ${selectedImageIndex === actualIndex
                            ? "border-blue-600 shadow-lg scale-105"
                            : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                          }`}
                      >
                        <img
                          src={getAbsoluteImageUrl(img)}
                          alt={`${productDetails.title} thumbnail ${actualIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Next Thumbnail Button */}
                {thumbnailStartIndex + THUMBNAILS_TO_SHOW < productImages.length && (
                  <button
                    onClick={() => navigateThumbnails('next')}
                    className="flex-shrink-0 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 
                             transition-colors shadow-sm hover:shadow-md"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Image Counter */}
              <div className="text-center text-sm text-gray-600 mt-3 font-medium">
                Image {selectedImageIndex + 1} of {productImages.length}
              </div>
            </div>
          )}
        </div>

        {/* Product Details Section */}
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
            {isContentLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              renderDescription(productDetails.description)
            )}
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
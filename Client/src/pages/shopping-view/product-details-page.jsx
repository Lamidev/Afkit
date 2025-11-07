
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Minus,
  Plus,
  CheckCircle,
  AlertCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { toast } from "sonner";
import {
  fetchProductsByBrand,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import LoadingSpinner from "@/components/shopping-view/loading-spinner";
import { getOrCreateSessionId } from "@/components/utils/session";
import { recordLinkShare } from "@/store/admin/share-slice/index";
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
  const imageScrollRef = useRef(null);
  const mobileThumbnailRef = useRef(null);
  const THUMBNAILS_TO_SHOW = 4;

  const WHATSAPP_NUMBER = "2348164014304";
  const COMPANY_NAME = "Afkit";

  // Fetch product details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      window.scrollTo(0, 0);
    }
  }, [id, dispatch]);

  // Update loading state
  useEffect(() => {
    if (productDetails?.description) setIsContentLoading(false);
  }, [productDetails]);

  // Update quantity if already in cart
  useEffect(() => {
    if (!productDetails) return;
    const cartItem = cartItems.items?.find(
      (item) => item.productId === productDetails._id
    );
    setQuantity(cartItem ? cartItem.quantity : 1);
  }, [productDetails, cartItems.items]);

  // Fetch related products
  useEffect(() => {
    if (productDetails?.brand) {
      dispatch(fetchProductsByBrand(productDetails.brand));
    }
  }, [productDetails, dispatch]);

  // Fetch cart items for guest or logged-in users
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = user?.id;
        const sessionId = userId ? null : getOrCreateSessionId();
        if (!userId && !sessionId) return;
        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        if (!user) localStorage.removeItem("guestSessionId");
      }
    };
    fetchCart();
  }, [dispatch, user]);

  // Utility to get full image URL
  const getAbsoluteImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/"))
      return `${window.location.origin}${imagePath}`;
    return `${window.location.origin}/${imagePath}`;
  };

  // Add to cart logic
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
            { icon: <AlertCircle className="text-red-500" /> }
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

  // Quantity change handlers
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

  // Share handlers
  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/share/${productDetails._id}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Product link copied!");

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

  const handleOrderOnWhatsApp = () => {
    const productLink = `${window.location.origin}/share/${productDetails._id}`;
    const message = `🛍️ *AFKiT Product Inquiry*\n\n*Product:* ${
      productDetails.title
    }\n*Price:* ₦${Number(productDetails.price).toLocaleString(
      "en-NG"
    )}\n*Quantity:* ${quantity}\n\nHello AFKiT, I'm interested in this product.\n\n🔗 *Product Link:* ${productLink}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
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

  const handleOrderOnInstagram = () => setShowInstagramModal(true);

  const copyInstagramMessage = () => {
    const productLink = `${window.location.origin}/share/${productDetails._id}`;
    const message = `Hello AFKiT,\n\nI'm interested in "${
      productDetails.title
    }" for ₦${Number(productDetails.price).toLocaleString(
      "en-NG"
    )}.\n\nQuantity: ${quantity}.\n\nIs it still available?\n\nProduct Link: ${productLink}`;

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

  if (!productDetails) return <LoadingSpinner />;

  const productImages =
    productDetails.images?.length > 0
      ? productDetails.images
      : productDetails.image
      ? [productDetails.image]
      : [];

  const mainImage = getAbsoluteImageUrl(productImages[0] || productDetails.image);
  const descriptionText = `Buy ${productDetails.title} for ₦${Number(
    productDetails.price
  ).toLocaleString("en-NG")}`;

  const filteredRelatedProducts =
    productDetails?.brand && relatedProducts
      ? relatedProducts
          ?.filter((p) => p._id !== productDetails?._id)
          ?.slice(0, 4)
      : [];
      // Track image scroll on mobile
const handleScroll = (event) => {
  const scrollLeft = event.target.scrollLeft;
  const width = event.target.clientWidth;
  const index = Math.round(scrollLeft / width);
  setSelectedImageIndex(index);
};


  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 pb-8 lg:py-8">
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
        <meta
          property="product:availability"
          content={productDetails.totalStock > 0 ? "in stock" : "out of stock"}
        />
      </Helmet>

      {/* ADJUSTED: Reduced mobile gap from 4 to 2 (gap-2) and kept large screen gap (lg:gap-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12">
        {/* Product Image and Thumbnails (Left Column on Large Screens) */}
        {/* ADJUSTED: Removed mobile space-y-* classes for tighter vertical fit */}
        <div className="lg:space-y-6">
          <div className="relative w-full mx-auto lg:aspect-square rounded-xl overflow-hidden group">
            <div 
              ref={imageScrollRef}
              className="flex overflow-x-auto lg:overflow-hidden snap-x snap-mandatory lg:snap-none hide-scrollbar"
              onScroll={handleScroll}
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Mobile Image Carousel */}
              <div className="flex lg:hidden">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full snap-center"
                  >
                    <img
                      src={getAbsoluteImageUrl(img)}
                      alt={`${productDetails.title} ${index + 1}`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
              {/* Desktop Main Image */}
              <div className="hidden lg:block w-full">
                <img
                  src={getAbsoluteImageUrl(productImages[selectedImageIndex])}
                  alt={productDetails.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {productImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white 
                             rounded-full p-3 shadow-xl transition-all duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                             border border-gray-200 hover:shadow-2xl"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white 
                             rounded-full p-3 shadow-xl transition-all duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                             border border-gray-200 hover:shadow-2xl"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Thumbnails (Changed to show 5 and reduced vertical margin) */}
          {productImages.length > 1 && (
            <div className="lg:hidden w-full overflow-x-auto pt-1">
              <div 
                ref={mobileThumbnailRef}
                className="flex gap-2 pb-2 hide-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
              >
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                  
                    className={`flex-shrink-0 w-[18.8%] h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ease-in-out ${
                      selectedImageIndex === index
                        ? "border-blue-600 shadow-lg scale-105"
                        : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                    }`}
                  >
                    <img
                      src={getAbsoluteImageUrl(img)}
                      alt={`${productDetails.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Thumbnails (Shows 4 with navigation) */}
          {productImages.length > 1 && (
            <div className="hidden lg:block relative">
              <div className="flex items-center gap-3">
                {thumbnailStartIndex > 0 && (
                  <button
                    onClick={() => navigateThumbnails("prev")}
                    className="flex-shrink-0 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 
                               transition-colors shadow-sm hover:shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                )}

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
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ease-in-out ${
                          selectedImageIndex === actualIndex
                            ? "border-blue-600 shadow-lg scale-105"
                            : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                        }`}
                      >
                        <img
                          src={getAbsoluteImageUrl(img)}
                          alt={`${productDetails.title} thumbnail ${
                            actualIndex + 1
                          }`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </button>
                    );
                  })}
                </div>

                {thumbnailStartIndex + THUMBNAILS_TO_SHOW <
                  productImages.length && (
                  <button
                    onClick={() => navigateThumbnails("next")}
                    className="flex-shrink-0 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 
                               transition-colors shadow-sm hover:shadow-md"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                )}
              </div>

              <div className="text-center text-sm text-gray-600 mt-3 font-medium">
                Image {selectedImageIndex + 1} of {productImages.length}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:mt-0">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
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
              <>
                {renderDescription(productDetails.description)}
                
                {/* Updated Need More Information Section */}
                <div className="mt-8">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 shadow-lg">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Need more information about this product?
                      </h3>
                      <Button
                        onClick={handleProductInfoWhatsApp}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg font-semibold"
                        size="lg"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        CONTACT US ON WHATSAPP
                      </Button>
                    </div>
                  </div>
                </div>
              </>
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

      <div className="max-w-7xl mx-auto w-full mt-12">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 sm:p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              Can't find the product you are looking for?
            </h3>
            <Button
              onClick={handleWhatsAppRedirect}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg font-semibold"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              ASK US ON WHATSAPP
            </Button>
          </div>
        </div>
      </div>

      {showInstagramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Order on Instagram</h3>
            <p className="mb-4">
              Copy this message and paste it when you DM us on Instagram:
            </p>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="whitespace-pre-wrap">
                Hello AFKiT,
                {"\n\n"}I'm interested in "{productDetails.title}" for ₦
                {Number(productDetails.price).toLocaleString("en-NG")}.
                {"\n\n"}Quantity: {quantity}.
                {"\n\n"}Is it still available?
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

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}



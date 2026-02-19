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
import { recordLinkShare } from "@/store/common-slice/share-slice/index";
import RecentlyViewed from "@/components/shopping-view/recently-viewed";
import { formatAestheticId } from "@/utils/common";
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
  // Adjusted for desktop view
  const THUMBNAILS_TO_SHOW = 4;

  const WHATSAPP_NUMBER = "2348164014304";
  const COMPANY_NAME = "Afkit";

  const handleWhatsAppRedirect = () => {
    const message = `Hi ${COMPANY_NAME}, I'm browsing your products but couldn't find what I'm looking for. Can you help me?`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleProductInfoWhatsApp = () => {
    const productLink = `${window.location.origin}/shop/product/${productDetails._id}`;
    const message = `Hi ${COMPANY_NAME}, I need more information about this product:\n\nProduct: ${productDetails.title}\nPrice: ₦${Number(productDetails.price).toLocaleString("en-NG")}\nProduct Link: ${productLink}\n\nCould you provide more details about this product?`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

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

  // Track Recently Viewed Products
  useEffect(() => {
    if (productDetails?._id) {
      const savedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updatedIds = [
        productDetails._id,
        ...savedIds.filter((id) => id !== productDetails._id),
      ].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedIds));
    }
  }, [productDetails]);

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
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/"))
      return `${window.location.origin}${imagePath}`;
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
    const productLink = `${import.meta.env.VITE_API_BASE_URL}/og/product/${productDetails._id}`;
    const message = `🛍️ *AFKiT Product Inquiry*\n\n*Product:* ${productDetails.title}\n*Price:* ₦${Number(productDetails.price).toLocaleString("en-NG")}\n*Quantity:* ${quantity}\n\nHello AFKiT, I'm interested in this product. Is it available?\n\n🔗 *Product Link:* ${productLink}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
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

  const handleOrderOnInstagram = () => {
    setShowInstagramModal(true);
  };

  const copyInstagramMessage = () => {
    // const productLink = `${window.location.origin}/shop/product/${productDetails._id}`;
    const productLink = `${import.meta.env.VITE_API_BASE_URL}/og/product/${productDetails._id}`;
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
    const productLink = `${import.meta.env.VITE_API_BASE_URL}/og/product/${productDetails._id}`;
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
    if (
      direction === "next" &&
      thumbnailStartIndex + THUMBNAILS_TO_SHOW < productImages.length
    ) {
      setThumbnailStartIndex((prev) => prev + 1);
    } else if (direction === "prev" && thumbnailStartIndex > 0) {
      setThumbnailStartIndex((prev) => prev - 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    if (imageScrollRef.current) {
      const scrollPosition = index * imageScrollRef.current.clientWidth;
      imageScrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (event) => {
    if (!productImages.length) return;

    const scrollLeft = event.target.scrollLeft;
    const clientWidth = event.target.clientWidth;
    const newIndex = Math.round(scrollLeft / clientWidth);

    if (newIndex !== selectedImageIndex && newIndex >= 0 && newIndex < productImages.length) {
      setSelectedImageIndex(newIndex);
      scrollMobileThumbnailIntoView(newIndex);
    }
  };

  // Improved scroll function to fully reveal the last thumbnail on mobile
  const scrollMobileThumbnailIntoView = (index) => {
    if (mobileThumbnailRef.current) {
      const container = mobileThumbnailRef.current;
      const thumbnails = container.children;

      if (thumbnails[index]) {
        const thumbnail = thumbnails[index];
        const containerWidth = container.clientWidth;
        const thumbnailWidth = thumbnail.offsetWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailRight = thumbnailLeft + thumbnailWidth;

        const maxScrollLeft = container.scrollWidth - containerWidth;
        const currentScrollLeft = container.scrollLeft;

        // Scroll left if thumbnail is out of view on left
        if (thumbnailLeft < currentScrollLeft) {
          container.scrollTo({
            left: thumbnailLeft,
            behavior: 'smooth',
          });
        }
        // Scroll right if thumbnail's right edge is out of view on right
        else if (thumbnailRight > currentScrollLeft + containerWidth) {
          let targetScrollLeft = thumbnailRight - containerWidth;
          if (targetScrollLeft > maxScrollLeft) {
            targetScrollLeft = maxScrollLeft;
          }
          container.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  const filteredRelatedProducts = useMemo(() => {
    if (!productDetails || !relatedProducts) return [];
    
    return relatedProducts
      .filter((p) => p._id !== productDetails._id)
      .filter((p) => 
        p.brand === productDetails.brand || 
        p.category === productDetails.category
      )
      .slice(0, 4);
  }, [productDetails, relatedProducts]);

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

  const mainImage = getAbsoluteImageUrl(
    productImages[0] || productDetails.image
  );
  const descriptionText = `Buy ${productDetails.title} for ₦${Number(
    productDetails.price
  ).toLocaleString("en-NG")}`;

  return (
    // ADJUSTED: Reduced top padding on mobile (pt-2) to bring content up.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative aspect-square rounded-xl overflow-hidden group bg-slate-50 border border-slate-100 shadow-inner">
            {/* Main Image Slider - Swipeable */}
            <div
              ref={imageScrollRef}
              onScroll={handleScroll}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar transition-all duration-300"
            >
              {productImages.map((img, index) => (
                <div key={index} className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center p-2">
                  <img
                    src={getAbsoluteImageUrl(img)}
                    alt={`${productDetails.title} ${index + 1}`}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Only show if multiple images */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                  className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white 
                             rounded-full p-3 shadow-xl transition-all duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                             border border-slate-200 hover:shadow-2xl z-20"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                  className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white 
                             rounded-full p-3 shadow-xl transition-all duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                             border border-slate-200 hover:shadow-2xl z-20"
                >
                  <ChevronRight className="h-5 w-5 text-slate-700" />
                </button>
              </>
            )}

            {/* Pagination Dots (Mobile) */}
            {productImages.length > 1 && (
              <div className="lg:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
                {productImages.map((_, index) => (
                  <div 
                    key={index} 
                    className={`h-1.5 transition-all duration-300 rounded-full ${index === selectedImageIndex ? "w-6 bg-orange-600" : "w-1.5 bg-slate-300"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Thumbnails - Horizontal Scrollable */}
          {productImages.length > 1 && (
            <div className="lg:hidden w-full overflow-x-auto py-2 scroll-smooth">
              <div
                ref={mobileThumbnailRef}
                className="flex gap-4 px-2 hide-scrollbar"
              >
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all duration-300 ease-in-out ${selectedImageIndex === index
                      ? "border-orange-500 shadow-xl scale-105"
                      : "border-slate-100 opacity-60"
                      }`}
                  >
                    <img
                      src={getAbsoluteImageUrl(img)}
                      alt={`${productDetails.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
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

                {/* Thumbnails Container - Larger thumbnails */}
                <div
                  ref={thumbnailContainerRef}
                  className="flex gap-4 overflow-hidden flex-1 justify-center"
                >
                  {visibleThumbnails.map((img, index) => {
                    const actualIndex = thumbnailStartIndex + index;
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => handleThumbnailClick(actualIndex)}
                        className={`flex-shrink-0 w-36 h-36 rounded-xl overflow-hidden border-4 transition-all duration-300 ease-in-out ${selectedImageIndex === actualIndex
                          ? "border-orange-500 shadow-xl scale-105"
                          : "border-gray-100 hover:border-gray-300 hover:shadow-md"
                          }`}
                      >
                        <img
                          src={getAbsoluteImageUrl(img)}
                          alt={`${productDetails.title} thumbnail ${actualIndex + 1
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

              {/* Image Counter */}
              <div className="text-center text-sm font-black text-slate-400 mt-4 uppercase tracking-[0.2em]">
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            </div>
          )}
        </div>

        {/* Product Details (Right Column on Large Screens) */}
        {/* ADJUSTED: Removed mobile margin-top (mt-4) to pull it right up to the image/thumbnail section */}
        <div className="space-y-6 lg:mt-0">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {productDetails.title}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gadget ID:</span>
              <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                {formatAestheticId(productDetails?._id, "GAD")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <p className="text-3xl font-black text-orange-600">
              ₦{Number(productDetails.price).toLocaleString("en-NG")}
            </p>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl bg-white shadow-sm hover:bg-slate-100"
                disabled={quantity === 1}
                onClick={() => handleUpdateQuantity("minus")}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-black w-8 text-center text-slate-900">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl bg-white shadow-sm hover:bg-slate-100"
                onClick={() => handleUpdateQuantity("plus")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Main Action Buttons in requested order */}
            <div className="flex flex-col gap-4 pt-4">
              {/* 1. PAY NOW */}
              <Button
                className="h-16 bg-primary hover:bg-primary/90 text-white font-black text-xl rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-tight"
                onClick={async () => {
                  await handleAddToCart(productDetails._id, productDetails.totalStock);
                  navigate("/shop/checkout", { state: { paymentType: 'full' } });
                }}
                disabled={productDetails.totalStock === 0}
              >
                PAY NOW
              </Button>

              {/* 2. PAY ON DELIVERY */}
              {productDetails.price >= 15000 && (
                <Button
                  className="h-16 bg-slate-900 hover:bg-slate-800 text-white font-black text-xl rounded-2xl shadow-2xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-tight"
                  onClick={async () => {
                    await handleAddToCart(productDetails._id, productDetails.totalStock);
                    navigate("/shop/checkout", { state: { paymentType: 'commitment' } });
                  }}
                  disabled={productDetails.totalStock === 0}
                >
                  PAY ON DELIVERY
                </Button>
              )}

              {/* 3. ORDER ON WHATSAPP */}
              <Button
                className="h-16 bg-[#25D366] hover:bg-[#22c35e] text-white font-black text-xl rounded-2xl shadow-2xl shadow-green-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-tight"
                onClick={handleOrderOnWhatsApp}
              >
                <MessageCircle className="w-6 h-6" />
                ORDER ON WHATSAPP
              </Button>

              <Button
                variant="outline"
                className="h-14 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-lg rounded-2xl transition-all"
                onClick={() => handleAddToCart(productDetails._id, productDetails.totalStock)}
                disabled={productDetails.totalStock === 0}
              >
                ADD TO CART
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center pt-4">
            <button 
              onClick={handleCopyLink}
              className="text-base font-black text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2 group p-3 bg-orange-50 rounded-2xl"
            >
              <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="uppercase tracking-widest">Share Product</span>
            </button>
          </div>

          <Separator className="my-8" />
        </div>
      </div >

      {
        productDetails.description && (
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
        )
      }

      {
        filteredRelatedProducts.length > 0 && (
          <div className="mt-16 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mx-4 sm:mx-6 lg:mx-8">
            <div className="flex flex-col gap-1 mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                Similar Discoveries
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                More gadgets like this one
              </p>
            </div>
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
        )
      }

      <div className="max-w-7xl mx-auto w-full mt-12 px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-7xl mx-auto w-full mt-12 px-4 sm:px-6 lg:px-8">
        <RecentlyViewed />
      </div>

      {
        showInstagramModal && (
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
        )
      }

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div >
  );
}



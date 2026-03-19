import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
  Truck,
  CreditCard,
  ShoppingCart,
  Heart,
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
import { formatAestheticId, createSlug } from "@/utils/common";
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

  const getProductLink = useCallback(() => {
    if (!productDetails) return "";
    const gadId = formatAestheticId(productDetails._id, "GAD").replace("#", "");
    // Use the backend OG route for better share previews on WhatsApp/Social Media
    const apiBase = import.meta.env.VITE_API_BASE_URL || "";
    return `${apiBase}/og/product/${gadId}`;
  }, [productDetails]);

  const handleProductInfoWhatsApp = () => {
    const productLink = getProductLink();
    const currentPrice = productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price;
    const message = `Hi ${COMPANY_NAME}, I need more information about this product:\n\nProduct: ${productDetails.title}\nPrice: ₦${Number(currentPrice).toLocaleString("en-NG")}\nProduct Link: ${productLink}\n\nCould you provide more details about this product?`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Standardized ID loading logic
  useEffect(() => {
    if (id) {
      // If we don't have details or the ID changed, fetch fresh data
      if (!productDetails || productDetails._id !== id) {
        dispatch(fetchProductDetails(id));
      }
      // Always reset view state on ID change for a clean swap
      setSelectedImageIndex(0);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [id, dispatch, productDetails?._id]);

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

  const handleDirectCheckout = async (paymentType) => {
    try {
      const userId = user?.id;
      const sessionId = userId ? null : getOrCreateSessionId();
      
      // Add to cart first
      const currentCartItems = cartItems?.items || [];
      const existingItem = currentCartItems.find(
        (item) => item.productId === productDetails._id
      );

      // Only add if not already in cart, otherwise we just proceed to checkout
      if (!existingItem) {
        await dispatch(
          addToCart({
            userId,
            productId: productDetails._id,
            quantity: quantity,
            sessionId,
          })
        ).unwrap();
        // Refresh cart items to ensure checkout has latest data
        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
      }
      
      // Navigate to checkout with payment type focus
      navigate("/shop/checkout", { state: { paymentType } });
    } catch (error) {
      console.error("Direct checkout error:", error);
      toast.error("Failed to initiate checkout");
    }
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

  const handleRelatedProductClick = (product) => {
    // Instant switch: Populate details immediately with data we already have
    dispatch(setProductDetails(product));
    navigate(`/shop/product/${product?._id}`);
  };

  const handleOrderOnWhatsApp = () => {
    const phoneNumber = "2348164014304";

    const aestheticId = formatAestheticId(productDetails?._id, "GAD");
    const productLink = getProductLink();
    const currentPrice = productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price;
    const message = `🛍️ *AFKiT Product Inquiry*\n\n*Product:* ${productDetails.title}\n*ID:* ${aestheticId}\n*Price:* ₦${Number(currentPrice).toLocaleString("en-NG")}\n*Quantity:* ${quantity}\n\nHello AFKiT, I'm interested in this product. Is it available?\n\n🔗 *Product Link:* ${productLink}`;

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
    const productLink = getProductLink();
    const currentPrice = productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price;
    const message = `Hello AFKiT,\n\nI'm interested in "${productDetails.title}" for ₦${Number(
      currentPrice
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
    const productLink = getProductLink();
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
        {mainImage.startsWith("https") && (
          <meta property="og:image:secure_url" content={mainImage} />
        )}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={getProductLink()} />
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
        <div className="space-y-3">
          <div className="relative aspect-[4/5] sm:aspect-square rounded-xl overflow-hidden group bg-slate-50 border border-slate-100 shadow-inner">
            {/* Main Image Slider - Swipeable */}
            <div
              ref={imageScrollRef}
              onScroll={handleScroll}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar transition-all duration-300"
            >
              {productImages.map((img, index) => (
                <div key={index} className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center">
                  <img
                    src={getAbsoluteImageUrl(img)}
                    alt={`${productDetails.title} ${index + 1}`}
                    className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
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

          {/* Desktop Thumbnails - Simple Clean Row Under Image */}
          {productImages.length > 1 && (
            <div className="hidden lg:block">
              <div className="flex flex-wrap gap-4 justify-center py-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ease-in-out ${selectedImageIndex === index
                      ? "border-orange-500 shadow-lg scale-105"
                      : "border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100"
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
            {/* Image Counter */}
            <div className="text-center text-sm font-black text-slate-400 mt-4 uppercase tracking-[0.2em]">
              {selectedImageIndex + 1} / {productImages.length}
            </div>
          </div>

        {/* Product Details (Right Column on Large Screens) */}
        {/* ADJUSTED: Removed mobile margin-top (mt-4) to pull it right up to the image/thumbnail section */}
        <div className="space-y-6 lg:mt-0">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
              {productDetails.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gadget ID:</span>
              <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                {formatAestheticId(productDetails?._id, "GAD")}
              </span>
              {productDetails?.condition && (
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    productDetails.condition === "Brand New"
                      ? "bg-amber-50 text-amber-700 border-amber-300"
                      : "bg-slate-100 text-slate-600 border-slate-300"
                  }`}
                >
                  {productDetails.condition}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex flex-col">
              {productDetails.salePrice > 0 ? (
                <>
                  <span className="text-sm text-slate-400 line-through font-bold">
                    ₦{Number(productDetails.price).toLocaleString("en-NG")}
                  </span>
                  <p className="text-2xl font-semibold text-orange-600">
                    ₦{Number(productDetails.salePrice).toLocaleString("en-NG")}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-semibold text-orange-600">
                  ₦{Number(productDetails.price).toLocaleString("en-NG")}
                </p>
              )}
            </div>
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

            {/* ── Main Action Grid ── */}
            <div className="flex flex-col gap-4 pt-6">
              {/* 1. PAY NOW (Full) */}
              <Button
                className="h-16 w-full bg-primary hover:bg-primary/90 text-white font-black text-base rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3"
                onClick={() => handleDirectCheckout('full')}
                disabled={productDetails.totalStock === 0}
              >
                <CreditCard className="w-5 h-5" />
                Pay Now
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 2. PAY ON DELIVERY (Conditional) */}
                {productDetails.price >= 15000 && (
                  <Button
                    variant="secondary"
                    className="h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2"
                    onClick={() => handleDirectCheckout('commitment')}
                    disabled={productDetails.totalStock === 0}
                  >
                    <Truck className="w-4 h-4" />
                    Pay on Delivery
                  </Button>
                )}

                {/* 3. ORDER ON WHATSAPP */}
                <Button
                  className="h-14 bg-[#25D366] hover:bg-[#22c35e] text-white font-bold text-sm rounded-2xl shadow-lg shadow-green-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                  onClick={handleOrderOnWhatsApp}
                >
                  <MessageCircle className="w-4 h-4" />
                  Order on WhatsApp
                </Button>
              </div>

              {/* Secondary Utility Row */}
              <div className="grid grid-cols-1">
                <Button
                  variant="outline"
                  className="h-12 border-2 border-slate-100 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(productDetails._id, productDetails.totalStock)}
                  disabled={productDetails.totalStock === 0}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
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
          <div className="mt-12 bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-100 shadow-sm mx-0 sm:mx-4 lg:mx-0">
            <div className="flex flex-col gap-1 mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Similar Discoveries
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                More gadgets like this one
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {filteredRelatedProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleRelatedProductClick(product)}
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
                  {"\n\n"}Product Link: {window.location.href}
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





// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Minus, Plus, CheckCircle, AlertCircle } from "lucide-react";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { toast } from "sonner";
// import {
//   setProductDetails,
//   fetchProductsByBrand,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import LoadingSpinner from "@/components/shopping-view/loading-spinner";
// import { getOrCreateSessionId } from "@/components/utils/session";

// export default function ShoppingProductDetails() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { productDetails, relatedProducts } = useSelector(
//     (state) => state.shopProducts
//   );

//   const [quantity, setQuantity] = useState(1);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchProductDetails(id));
//     }
//   }, [id, dispatch]);

//   // Scroll to top when product ID changes
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [id]);

//   useEffect(() => {
//     if (!productDetails) return;
//     const cartItem = cartItems.items?.find(
//       (item) => item.productId === productDetails._id
//     );
//     setQuantity(cartItem ? cartItem.quantity : 1);
//   }, [productDetails, cartItems.items]);

//   useEffect(() => {
//     if (productDetails?.brand) {
//       dispatch(fetchProductsByBrand(productDetails.brand));
//     }
//   }, [productDetails, dispatch]);

//   // Load cart items when component mounts or user changes
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const userId = user?.id;
//         const sessionId = userId ? null : getOrCreateSessionId();

//         if (!userId && !sessionId) {
//           console.warn("No user or session info available");
//           return;
//         }

//         await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
//       } catch (error) {
//         console.error('Failed to fetch cart:', error);
//         if (!user) {
//           localStorage.removeItem('guestSessionId');
//         }
//       }
//     };

//     fetchCart();
//   }, [dispatch, user]);

//   const handleAddToCart = async () => {
//     try {
//       const userId = user?.id;
//       const sessionId = userId ? null : getOrCreateSessionId();

//       if (!userId && !sessionId) {
//         navigate("/auth/login");
//         toast.error("Please login to add items to the cart");
//         return;
//       }

//       // Check stock for existing items
//       const currentCartItems = cartItems?.items || [];
//       const existingItem = currentCartItems.find(
//         item => item.productId === productDetails._id
//       );

//       if (existingItem && existingItem.quantity >= productDetails.totalStock) {
//         toast.error(`Maximum available quantity (${productDetails.totalStock}) reached`, {
//           icon: <AlertCircle className="text-red-500" />,
//         });
//         return;
//       }

//       if (quantity > productDetails.totalStock) {
//         toast.error(`Only ${productDetails.totalStock} quantity can be added`, {
//           icon: <AlertCircle className="text-red-500" />,
//         });
//         return;
//       }

//       const response = await dispatch(
//         addToCart({
//           userId,
//           productId: productDetails._id,
//           quantity,
//           sessionId
//         })
//       ).unwrap();

//       if (response.success) {
//         await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
//         toast.success("Product added to cart", {
//           icon: <CheckCircle className="text-green-500" />,
//         });
//       }
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       toast.error("Failed to add product to cart");
//     }
//   };

//   const handleUpdateQuantity = (type) => {
//     if (type === "plus") {
//       if (quantity + 1 > productDetails.totalStock) {
//         toast.error(`Only ${productDetails.totalStock} available`);
//         return;
//       }
//       setQuantity(quantity + 1);
//     } else {
//       if (quantity - 1 < 1) return;
//       setQuantity(quantity - 1);
//     }
//   };

//   const handleRelatedProductClick = (productId) => {
//     navigate(`/shop/product/${productId}`);
//     window.scrollTo(0, 0);
//   };

//   const filteredRelatedProducts =
//     relatedProducts
//       ?.filter((p) => p._id !== productDetails?._id)
//       ?.slice(0, 4) || [];

//   if (!productDetails) {
//     return <div className="container py-8"><LoadingSpinner/></div>;
//   }

//   // Get all images - fallback to single image if images array doesn't exist
//   const productImages = productDetails.images?.length > 0 
//     ? productDetails.images 
//     : productDetails.image 
//       ? [productDetails.image] 
//       : [];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Top Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//         {/* Left - Image Gallery */}
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Thumbnails - only show if more than one image */}
//           {productImages.length > 1 && (
//             <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImageIndex(index)}
//                   className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
//                     selectedImageIndex === index 
//                       ? 'border-primary' 
//                       : 'border-transparent'
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`${productDetails.title} thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
          
//           {/* Main Image */}
//           <div className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center ${
//             productImages.length > 1 ? 'order-1 md:order-2 flex-1' : 'w-full'
//           }`}>
//             <img
//               src={productImages[selectedImageIndex]}
//               alt={productDetails.title}
//               className="object-contain w-full max-h-full p-6"
//             />
//           </div>
//         </div>

//         {/* Right - Product Details */}
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
//               {productDetails.title}
//             </h1>
//             <p className="text-muted-foreground mt-3 text-base md:text-lg leading-relaxed">
//               {productDetails.description}
//             </p>
//           </div>

//           <div className="flex items-center gap-6 flex-wrap">
//             <p className="text-2xl font-semibold text-primary">
//               ₦{Number(productDetails.price).toLocaleString("en-NG")}
//             </p>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-10 w-10 rounded-full"
//                 disabled={quantity === 1}
//                 onClick={() => handleUpdateQuantity("minus")}
//               >
//                 <Minus className="h-4 w-4" />
//               </Button>
//               <span className="text-lg font-medium w-8 text-center">
//                 {quantity}
//               </span>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-10 w-10 rounded-full"
//                 onClick={() => handleUpdateQuantity("plus")}
//               >
//                 <Plus className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           <Button
//             className="w-full h-12 text-lg font-semibold tracking-wide"
//             onClick={handleAddToCart}
//             disabled={productDetails.totalStock === 0}
//           >
//             {productDetails.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
//           </Button>

//           <Separator />
//         </div>
//       </div>

//       {/* Related Products Section */}
//       {filteredRelatedProducts.length > 0 && (
//         <div className="mt-16">
//           <h2 className="text-xl font-bold text-center mb-8">
//             Related Products
//           </h2>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
//             {filteredRelatedProducts.map((product) => (
//               <div
//                 key={product._id}
//                 onClick={() => handleRelatedProductClick(product._id)}
//                 className="cursor-pointer"
//               >
//                 <ShoppingProductTile product={product} />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, CheckCircle, AlertCircle } from "lucide-react";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { toast } from "sonner";
import {
  setProductDetails,
  fetchProductsByBrand,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import LoadingSpinner from "@/components/shopping-view/loading-spinner";
import { getOrCreateSessionId } from "@/components/utils/session";

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

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      window.scrollTo(0, 0);  // <-- Scroll to top when product id changes
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

  // Load cart items when component mounts or user changes
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
        console.error('Failed to fetch cart:', error);
        if (!user) {
          localStorage.removeItem('guestSessionId');
        }
      }
    };

    fetchCart();
  }, [dispatch, user]);

  const handleAddToCart = async () => {
    try {
      const userId = user?.id;
      const sessionId = userId ? null : getOrCreateSessionId();

      if (!userId && !sessionId) {
        navigate("/auth/login");
        toast.error("Please login to add items to the cart");
        return;
      }

      // Check stock for existing items
      const currentCartItems = cartItems?.items || [];
      const existingItem = currentCartItems.find(
        item => item.productId === productDetails._id
      );

      if (existingItem && existingItem.quantity >= productDetails.totalStock) {
        toast.error(`Maximum available quantity (${productDetails.totalStock}) reached`, {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      if (quantity > productDetails.totalStock) {
        toast.error(`Only ${productDetails.totalStock} quantity can be added`, {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      const response = await dispatch(
        addToCart({
          userId,
          productId: productDetails._id,
          quantity,
          sessionId
        })
      ).unwrap();

      if (response.success) {
        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
        toast.success("Product added to cart", {
          icon: <CheckCircle className="text-green-500" />,
        });
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error("Failed to add product to cart");
    }
  };

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

  const filteredRelatedProducts =
    relatedProducts
      ?.filter((p) => p._id !== productDetails?._id)
      ?.slice(0, 4) || [];

  if (!productDetails) {
    return <div className="container py-8"><LoadingSpinner/></div>;
  }

  // Get all images - fallback to single image if images array doesn't exist
  const productImages = productDetails.images?.length > 0 
    ? productDetails.images 
    : productDetails.image 
      ? [productDetails.image] 
      : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left - Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails - only show if more than one image */}
          {productImages.length > 1 && (
            <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index 
                      ? 'border-primary' 
                      : 'border-transparent'
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
          
          {/* Main Image */}
          <div className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center ${
            productImages.length > 1 ? 'order-1 md:order-2 flex-1' : 'w-full'
          }`}>
            <img
              src={productImages[selectedImageIndex]}
              alt={productDetails.title}
              className="object-contain w-full max-h-full p-6"
            />
          </div>
        </div>

        {/* Right - Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {productDetails.title}
            </h1>
            <p className="text-muted-foreground mt-3 text-base md:text-lg leading-relaxed">
              {productDetails.description}
            </p>
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
            className="w-full h-12 text-lg font-semibold tracking-wide"
            onClick={handleAddToCart}
            disabled={productDetails.totalStock === 0}
          >
            {productDetails.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          <Separator />
        </div>
      </div>

      {/* Related Products Section */}
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
                <ShoppingProductTile product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// src/components/ProductSharePage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";
import LoadingSpinner from "@/components/shopping-view/loading-spinner";

export default function ProductSharePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('🔄 Fetching product:', id);
        setLoading(true);
        
        const result = await dispatch(fetchProductDetails(id)).unwrap();
        console.log('✅ Product data:', result);
        
        // Handle response structure
        const productData = result?.data || result;
        
        if (productData?._id) {
          setProduct(productData);
          updateMetaTags(productData);
        } else {
          console.error('❌ Invalid product data');
        }
      } catch (error) {
        console.error('❌ Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, dispatch]);

  // Update when Redux store updates
  useEffect(() => {
    if (productDetails?._id === id && !product) {
      console.log('🔄 Using product from Redux:', productDetails);
      setProduct(productDetails);
      updateMetaTags(productDetails);
    }
  }, [productDetails, id, product]);

  const updateMetaTags = (productData) => {
    if (!productData) return;

    const imageUrl = getAbsoluteImageUrl(productData.images?.[0] || productData.image);
    const title = `${productData.title} - AFKiT`;
    const description = `Buy ${productData.title} for ₦${Number(productData.price).toLocaleString("en-NG")}`;
    const url = window.location.href;

    console.log('🎯 Setting meta tags:', { title, imageUrl });

    // Update or create meta tags
    const metaTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'product' },
      { property: 'og:site_name', content: 'AFKiT' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'description', content: description }
    ];

    metaTags.forEach(tag => {
      let element;
      
      if (tag.property) {
        element = document.querySelector(`meta[property="${tag.property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', tag.property);
          document.head.appendChild(element);
        }
      } else {
        element = document.querySelector(`meta[name="${tag.name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', tag.name);
          document.head.appendChild(element);
        }
      }
      
      element.setAttribute('content', tag.content);
    });

    // Update title
    document.title = title;

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    }
  };

  const getAbsoluteImageUrl = (imagePath) => {
    if (!imagePath) return "https://afkit.ng/apple-touch-icon.png";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return `${window.location.origin}${imagePath}`;
    return `${window.location.origin}/${imagePath}`;
  };

  const redirectToProduct = () => {
    window.location.href = `/shop/product/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <p className="ml-4">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const mainImage = getAbsoluteImageUrl(product.images?.[0] || product.image);

  return (
    <div 
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={redirectToProduct}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <img 
          src={mainImage} 
          alt={product.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <p className="text-3xl font-semibold text-green-600 mb-4">
            ₦{Number(product.price).toLocaleString("en-NG")}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full">
            View Product on AFKiT
          </button>
          <p className="text-sm text-gray-500 text-center mt-4">
            Click anywhere to view the full product page
          </p>
        </div>
      </div>

      {/* Hidden content for crawlers */}
      <div style={{ display: 'none' }}>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <img src={mainImage} alt={product.title} />
        <p>Price: ₦{Number(product.price).toLocaleString("en-NG")}</p>
      </div>
    </div>
  );
}
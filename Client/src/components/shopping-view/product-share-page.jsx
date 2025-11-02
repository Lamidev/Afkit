// src/components/ProductSharePage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";
import LoadingSpinner from "@/components/shopping-view/loading-spinner";

export default function ProductSharePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metaTagsUpdated, setMetaTagsUpdated] = useState(false);

  // Add this at the beginning of your ProductSharePage component
useEffect(() => {
  // Set basic meta tags immediately while product loads
  const basicMetaTags = [
    { property: 'og:type', content: 'product' },
    { property: 'og:site_name', content: 'AFKiT' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];

  basicMetaTags.forEach(tag => {
    let element = document.querySelector(
      tag.property 
        ? `meta[property="${tag.property}"]` 
        : `meta[name="${tag.name}"]`
    );
    
    if (!element) {
      element = document.createElement('meta');
      if (tag.property) {
        element.setAttribute('property', tag.property);
      } else {
        element.setAttribute('name', tag.name);
      }
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', tag.content);
  });
}, []);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('🔄 Starting to fetch product...');
        setLoading(true);
        
        // Dispatch the action and wait for it to complete
        const result = await dispatch(fetchProductDetails(id)).unwrap();
        console.log('✅ Product fetch successful:', result);

        
// In the loadProduct function, replace this part:
if (result && result.title) {
  setProduct(result);
  updateMetaTags(result);
  setMetaTagsUpdated(true);
} else {
  console.error('❌ Invalid product data:', result);
}

// Change to this:
if (result) {
  // Handle different possible response structures
  const productData = result.data || result;
  
  if (productData && productData.title) {
    setProduct(productData);
    updateMetaTags(productData);
    setMetaTagsUpdated(true);
    console.log('✅ Product data set successfully:', productData.title);
  } else {
    console.error('❌ Invalid product data structure:', result);
  }
} else {
  console.error('❌ No product data received');
}

      } catch (error) {
        console.error('❌ Product fetch failed:', error);
        
        // If CORS error, try direct fetch with no-cors mode as fallback
        if (error.message.includes('Network Error') || error.message.includes('CORS')) {
          console.log('🔄 Trying alternative method due to CORS...');
          await tryAlternativeFetch();
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    } else {
      setLoading(false);
    }
  }, [id, dispatch]);

  // Also watch for changes in Redux productDetails - FIXED VERSION
  useEffect(() => {
    if (productDetails && productDetails._id === id && !metaTagsUpdated) {
      console.log('🔄 Product details updated in Redux:', productDetails);
      if (productDetails.title) {
        setProduct(productDetails);
        updateMetaTags(productDetails);
        setMetaTagsUpdated(true);
      }
    }
  }, [productDetails, id, metaTagsUpdated]);

  const getAbsoluteImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log('⚠️ No image path provided');
      return "/images/product-placeholder.jpg";
    }
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return `${window.location.origin}${imagePath}`;
    return `${window.location.origin}/${imagePath}`;
  };

  const updateMetaTags = (productData) => {
    if (!productData || !productData.title) {
      console.log('⚠️ No valid product data for meta tags:', productData);
      return;
    }

    const imageUrl = getAbsoluteImageUrl(productData.images?.[0] || productData.image);
    const title = `${productData.title} - AFKiT`;
    const description = `Buy ${productData.title} for ₦${Number(productData.price).toLocaleString("en-NG")}`;
    const url = window.location.href;

    console.log('🔄 Updating meta tags for:', title);
    console.log('📸 Image URL:', imageUrl);

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
      console.log(`✅ Updated ${tag.property || tag.name}:`, tag.content);
    });

    // Update title
    document.title = title;
    console.log('✅ Updated title:', title);

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  };

  // Alternative fetch method (keep as fallback)
  const tryAlternativeFetch = async () => {
    try {
      const response = await fetch(`/api/shop/products/get/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          setProduct(data.data);
          updateMetaTags(data.data);
          setMetaTagsUpdated(true);
          return;
        }
      }
    } catch (error) {
      console.log('Alternative fetch failed:', error);
    }
  };

  // Redirect to main product page when user interacts
  const redirectToProduct = () => {
    console.log('🔄 Redirecting to product page...');
    window.location.href = `/shop/product/${id}`;
  };

  if (loading || isLoading) {
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
          <p className="mb-4">We couldn't load the product details.</p>
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
        <div className="relative">
          <img 
            src={mainImage} 
            alt={product.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              console.log('⚠️ Image failed to load:', mainImage);
              e.target.src = '/images/product-placeholder.jpg';
            }}
          />
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {product.title}
          </h1>
          
          <p className="text-3xl font-semibold text-green-600 mb-4">
            ₦{Number(product.price).toLocaleString("en-NG")}
          </p>
          
          <p className="text-gray-600 mb-6 line-clamp-3">
            {product.description || `Buy ${product.title} from AFKiT`}
          </p>
          
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.totalStock > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.totalStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              View Product
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Click anywhere to view the full product page
            </p>
          </div>
        </div>
      </div>

      {/* Hidden elements for social media crawlers */}
      <div style={{ display: 'none' }}>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <img src={mainImage} alt={product.title} />
        <p>Price: ₦{Number(product.price).toLocaleString("en-NG")}</p>
        <p>Brand: {product.brand || 'AFKiT'}</p>
      </div>
    </div>
  );
}
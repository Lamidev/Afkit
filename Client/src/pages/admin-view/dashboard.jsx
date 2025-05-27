

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchVerifiedUserCount } from "@/store/admin/verified-users-slice";
// import {
//   getFeatureImages,
//   addFeatureImage,
//   deleteFeatureImage,
// } from "@/store/common-slice";
// import ProductImageUpload from "@/components/admin-view/image-upload";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users } from "lucide-react";
// import { motion } from "framer-motion";

// function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { verifiedUserCount, isLoading } = useSelector(
//     (state) => state.verifiedUsers
//   );
//   const { featureImageList } = useSelector((state) => state.commonFeature);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
//   const [imageLoadingState, setImageLoadingState] = useState(false);

//   // State for confirming delete
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [imageToDelete, setImageToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchVerifiedUserCount());
//     dispatch(getFeatureImages());
//   }, [dispatch]);

//   function handleUploadFeatureImages() {
//     if (uploadedImageUrls.length === 0) return;
    
//     // Upload each image individually
//     uploadedImageUrls.forEach(url => {
//       dispatch(addFeatureImage(url)).then((data) => {
//         if (data?.payload?.success) {
//           dispatch(getFeatureImages());
//         }
//       });
//     });
    
//     // Reset states after upload
//     setImageFiles([]);
//     setUploadedImageUrls([]);
//   }

//   function handleDeleteFeatureImage(id) {
//     dispatch(deleteFeatureImage(id));
//     setShowConfirmDelete(false);
//     setImageToDelete(null);
//   }

//   function confirmDelete(id) {
//     setImageToDelete(id);
//     setShowConfirmDelete(true);
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row gap-6 justify-center">
//         {/* Verified Users Card */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full md:w-1/2"
//         >
//           <Card className="shadow-xl border border-gray-200 bg-white p-4 rounded-lg">
//             <CardHeader className="flex items-center gap-3">
//               <Users className="text-blue-500 w-8 h-8" />
//               <CardTitle>Verified Users</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <p className="text-gray-500">Loading...</p>
//               ) : (
//                 <p className="text-2xl font-bold text-gray-800">
//                   {verifiedUserCount}
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Image Upload Section */}
//       <div>
//         <ProductImageUpload
//           imageFiles={imageFiles}
//           setImageFiles={setImageFiles}
//           uploadedImageUrls={uploadedImageUrls}
//           setUploadedImageUrls={setUploadedImageUrls}
//           setImageLoadingState={setImageLoadingState}
//           imageLoadingState={imageLoadingState}
//           isCustomStyling={true}
//         />
//         <Button 
//           onClick={handleUploadFeatureImages} 
//           className="mt-5 w-full"
//           disabled={uploadedImageUrls.length === 0 || imageLoadingState}
//         >
//           Upload {uploadedImageUrls.length > 0 ? `(${uploadedImageUrls.length})` : ''}
//         </Button>
//       </div>

//       {/* Feature Images Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {featureImageList &&
//           featureImageList.length > 0 &&
//           featureImageList.map((featureImgItem, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//               className="relative"
//             >
//               <img
//                 src={featureImgItem.image}
//                 className="w-full h-[250px] object-cover rounded-lg shadow-lg"
//                 alt="Feature"
//               />
//               <Button
//                 onClick={() => confirmDelete(featureImgItem._id)}
//                 className="absolute top-2 right-2 bg-red-500 text-white"
//               >
//                 Delete
//               </Button>
//             </motion.div>
//           ))}
//       </div>

//       {/* Confirmation Modal */}
//       {showConfirmDelete && (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h2 className="text-xl font-semibold text-center mb-4">
//               Confirm Deletion
//             </h2>
//             <p className="text-center mb-6">
//               Are you sure you want to delete this feature image?
//             </p>
//             <div className="flex justify-around">
//               <Button
//                 onClick={() => handleDeleteFeatureImage(imageToDelete)}
//                 className="bg-red-500 text-white"
//               >
//                 Yes, Delete
//               </Button>
//               <Button
//                 onClick={() => setShowConfirmDelete(false)}
//                 className="bg-gray-300 text-black"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVerifiedUserCount } from "@/store/admin/verified-users-slice";
import {
  getFeatureImages,
  addFeatureImage,
  deleteFeatureImage,
} from "@/store/common-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { verifiedUserCount, isLoading } = useSelector((state) => state.verifiedUsers);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [uploadKey, setUploadKey] = useState(Date.now()); // To reset image upload component

  // State for confirming delete
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchVerifiedUserCount());
    dispatch(getFeatureImages());
  }, [dispatch]);

  async function handleUploadFeatureImages() {
    if (uploadedImageUrls.length === 0) {
      toast("No images to upload", {
        icon: <XCircle className="text-yellow-500" />,
        position: "bottom-right",
      });
      return;
    }

    setImageLoadingState(true);
    const toastId = toast.loading("Uploading images...", {
      position: "bottom-right",
    });

    let successCount = 0;

    try {
      for (const url of uploadedImageUrls) {
        const result = await dispatch(addFeatureImage(url)).unwrap();
        if (result?.success) {
          successCount++;
        }
      }

      await dispatch(getFeatureImages()).unwrap();
      
      setImageFiles([]);
      setUploadedImageUrls([]);
      setUploadKey(Date.now());
      
      toast.success(`${successCount} image${successCount > 1 ? "s" : ""} uploaded successfully`, {
        id: toastId,
        icon: <CheckCircle className="text-green-500" />,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images", {
        id: toastId,
        icon: <XCircle className="text-red-500" />,
        position: "bottom-right",
      });
    } finally {
      setImageLoadingState(false);
    }
  }

  function handleDeleteFeatureImage(id) {
    const toastId = toast.loading("Deleting image...", {
      position: "bottom-right",
    });

    dispatch(deleteFeatureImage(id))
      .unwrap()
      .then(() => {
        dispatch(getFeatureImages());
        toast.success("Image deleted successfully", {
          id: toastId,
          icon: <CheckCircle className="text-green-500" />,
          position: "bottom-right",
        });
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("Failed to delete image", {
          id: toastId,
          icon: <XCircle className="text-red-500" />,
          position: "bottom-right",
        });
      })
      .finally(() => {
        setShowConfirmDelete(false);
        setImageToDelete(null);
      });
  }

  function confirmDelete(id) {
    setImageToDelete(id);
    setShowConfirmDelete(true);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2"
        >
          <Card className="shadow-xl border border-gray-200 bg-white p-4 rounded-lg">
            <CardHeader className="flex items-center gap-3">
              <Users className="text-blue-500 w-8 h-8" />
              <CardTitle>Verified Users</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-800">
                  {verifiedUserCount}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Image Upload Section */}
      <div>
        <ProductImageUpload
          key={uploadKey}
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          uploadedImageUrls={uploadedImageUrls}
          setUploadedImageUrls={setUploadedImageUrls}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button 
          onClick={handleUploadFeatureImages} 
          className="mt-5 w-full"
          disabled={uploadedImageUrls.length === 0 || imageLoadingState}
        >
          {imageLoadingState ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            `Upload ${uploadedImageUrls.length > 0 ? `(${uploadedImageUrls.length})` : ''}`
          )}
        </Button>
      </div>

      {/* Feature Images Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureImageList &&
          featureImageList.length > 0 &&
          featureImageList.map((featureImgItem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <img
                src={featureImgItem.image}
                className="w-full h-[250px] object-cover rounded-lg shadow-lg"
                alt="Feature"
              />
              <Button
                onClick={() => confirmDelete(featureImgItem._id)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center mb-4">
              Confirm Deletion
            </h2>
            <p className="text-center mb-6">
              Are you sure you want to delete this feature image?
            </p>
            <div className="flex justify-around">
              <Button
                onClick={() => handleDeleteFeatureImage(imageToDelete)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Yes, Delete
              </Button>
              <Button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

import { UploadCloudIcon, XIcon, EditIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { uploadProductImages } from "@/store/admin/products-slice";
import { toast } from "sonner";

function ProductImageUpload({
  imageFiles = [],
  setImageFiles,
  uploadedImageUrls = [],
  setUploadedImageUrls,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (isEditMode && uploadedImageUrls.length > 0) {
      setExistingImages(uploadedImageUrls);
      const existingPreviews = uploadedImageUrls.map((url, index) => ({
        file: null,
        preview: url,
        id: `existing-${index}-${Date.now()}`,
        isExisting: true,
        isNew: false
      }));
      setPreviews(existingPreviews);
    }
  }, [isEditMode, uploadedImageUrls]);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      toast.error(`Invalid file type: ${file.name}. Please upload JPEG, PNG, or WebP images.`);
      return false;
    }

    const absoluteMaxSize = 10 * 1024 * 1024;
    const maxRecommendedSize = 5 * 1024 * 1024;
    
    if (file.size > absoluteMaxSize) {
      toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
      return false;
    }
    
    if (file.size > maxRecommendedSize) {
      toast.warning(`Large file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB). Upload may take longer.`);
    }

    return true;
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    const availableSlots = 8 - (imageFiles.length + existingImages.length);
    
    if (availableSlots > 0) {
      const validFiles = files.slice(0, availableSlots).filter(validateFile);
      if (validFiles.length > 0) {
        handleNewFiles(validFiles);
      }
    } else {
      toast.info("Maximum of 8 images reached");
    }
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const availableSlots = 8 - (imageFiles.length + existingImages.length);
    
    if (availableSlots > 0) {
      const validFiles = files.slice(0, availableSlots).filter(validateFile);
      if (validFiles.length > 0) {
        handleNewFiles(validFiles);
      }
    } else {
      toast.info("Maximum of 8 images reached");
    }
  };

  const handleNewFiles = (files) => {
    const combinedFiles = [...imageFiles, ...files].slice(0, 8);
    setImageFiles(combinedFiles);
    
    const newFilePreviews = files.map((file, index) => {
      return {
        file,
        preview: URL.createObjectURL(file),
        id: `${file.name}-${file.lastModified}-${index}-${Date.now()}`,
        isExisting: false,
        isNew: true
      };
    });

    const existingPreviews = previews.filter(p => p.isExisting);
    const allPreviews = [...existingPreviews, ...newFilePreviews].slice(0, 8);
    
    setPreviews(allPreviews);
    setNewImages(prev => [...prev, ...newFilePreviews.map(p => p.id)]);
  };

  const handleRemoveImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const previewToRemove = previews[index];
    
    if (previewToRemove.isExisting) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
      setUploadedImageUrls(newExistingImages);
    } 
    else {
      const newFiles = [...imageFiles];
      const newPreviews = [...previews];

      if (newPreviews[index]?.preview && newPreviews[index].preview.startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index].preview);
      }

      const fileIndex = newFiles.findIndex(file => 
        previewToRemove.file && file.name === previewToRemove.file.name && file.lastModified === previewToRemove.file.lastModified
      );
      
      if (fileIndex !== -1) {
        newFiles.splice(fileIndex, 1);
      }

      newPreviews.splice(index, 1);

      setImageFiles(newFiles);
      setPreviews(newPreviews);

      setNewImages(prev => prev.filter(id => id !== previewToRemove.id));

      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[index];
        return newProgress;
      });
    }

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    if (newPreviews.length === 0 && inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) {
      if (existingImages.length > 0) {
        setUploadedImageUrls(existingImages);
      }
      return;
    }

    setImageLoadingState(true);
    setUploadProgress({});
    setShowSuccessMessage(false);
    
    try {
      const result = await dispatch(uploadProductImages(imageFiles)).unwrap();
      if (result?.images) {
        const allImages = [...existingImages, ...result.images].slice(0, 8);
        setUploadedImageUrls(allImages);
        setShowSuccessMessage(true);
        setNewImages([]);
        
        const updatedPreviews = previews.map(preview => {
          if (preview.isNew) {
            return {
              ...preview,
              isNew: false,
              isExisting: true
            };
          }
          return preview;
        });
        setPreviews(updatedPreviews);
        
        setExistingImages(allImages);
        
        toast.success(`Successfully uploaded ${result.images.length} image(s)`);
        
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        throw new Error("No images returned from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.payload?.message || error.message || "Failed to upload images";
      toast.error(errorMessage);
      
      const shouldRetry = confirm(`${errorMessage}. Would you like to try again?`);
      if (shouldRetry) {
        setTimeout(uploadImages, 2000);
      }
    } finally {
      setImageLoadingState(false);
      setUploadProgress({});
    }
  };

  useEffect(() => {
    if (imageFiles.length > 0 && !imageLoadingState) {
      uploadImages();
    } else if (imageFiles.length === 0 && existingImages.length > 0) {
      setUploadedImageUrls(existingImages);
    }
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.preview && preview.preview.startsWith('blob:') && !preview.isExisting) {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
  }, [previews]);

  const getUploadStatus = (index) => {
    if (imageLoadingState && !previews[index]?.isExisting) {
      return uploadProgress[index] !== undefined ? `Uploading...` : 'Pending...';
    }
    return previews[index]?.isExisting ? 'Existing' : 'Ready';
  };

  const getImageBadge = (preview) => {
    if (preview.isNew) {
      return 'New';
    }
    return '';
  };

  const getBadgeColor = (preview) => {
    if (preview.isNew) {
      return 'bg-green-500';
    }
    return '';
  };

  const getImageLabel = (preview) => {
    if (preview.file) {
      return preview.file.name;
    }
    return 'Image';
  };

  const totalImages = previews.length;
  const canAddMore = totalImages < 8;

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">
        Product Images ({totalImages}/8)
        {isEditMode && <span className="text-sm text-muted-foreground ml-2">• Edit mode enabled</span>}
      </Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          !canAddMore ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } border-2 border-dashed rounded-lg p-4 transition-colors hover:border-primary/50`}
      >
        <Input
          id="product-images"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={!canAddMore}
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
        />

        {previews.length === 0 ? (
          <label
            htmlFor="product-images"
            className={`flex flex-col items-center justify-center h-32 ${
              !canAddMore ? "cursor-not-allowed" : "cursor-pointer hover:bg-muted/50"
            } rounded-lg transition-colors`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-center font-medium">
              {isEditMode ? "Edit product images" : "Drag & drop or click to upload"}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              Max 8 images • JPEG, PNG, WebP • Recommended under 5MB
            </span>
          </label>
        ) : (
          <div className="space-y-3">
            {imageLoadingState && (
              <div className="text-sm text-muted-foreground text-center">
                Uploading {imageFiles.length} image(s)... 
                {Object.keys(uploadProgress).length > 0 && 
                  ` (${Object.keys(uploadProgress).length}/${imageFiles.length})`
                }
              </div>
            )}
            
            {imageLoadingState ? (
              <div className="grid grid-cols-2 gap-3">
                {previews.map((preview, index) => (
                  <div key={preview.id} className="relative">
                    <Skeleton className="h-24 w-full rounded-md" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xs bg-black/70 text-white px-2 py-1 rounded">
                        {getUploadStatus(index)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {previews.map((preview, index) => {
                  const badgeText = getImageBadge(preview);
                  const badgeColor = getBadgeColor(preview);
                  const imageLabel = getImageLabel(preview);
                  
                  return (
                    <div key={preview.id} className="relative group">
                      <img
                        src={preview.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                        loading="eager"
                        onError={(e) => {
                          console.error("Failed to load image:", preview.file?.name || 'existing image');
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNkMSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==";
                        }}
                      />
                      
                      <button
                        type="button"
                        className="sm:hidden absolute top-1 right-1 h-7 w-7 rounded-full bg-red-500 text-white border-2 border-white shadow-lg flex items-center justify-center z-10"
                        onClick={(e) => handleRemoveImage(index, e)}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        type="button"
                        className="hidden sm:flex absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 border-2 border-white shadow-lg items-center justify-center z-10"
                        onClick={(e) => handleRemoveImage(index, e)}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                      
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="text-xs bg-black/70 text-white px-1 py-0.5 rounded text-center truncate">
                          {imageLabel}
                        </div>
                      </div>
                      
                      {badgeText && (
                        <div className="absolute top-1 left-1">
                          <div className={`text-xs ${badgeColor} text-white px-1 py-0.5 rounded`}>
                            {badgeText}
                          </div>
                        </div>
                      )}
                      
                      <div className="sm:hidden absolute inset-0 bg-black/0 hover:bg-black/5 active:bg-black/10 transition-colors rounded-md" />
                    </div>
                  );
                })}
                
                {canAddMore && (
                  <label
                    htmlFor="product-images"
                    className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-muted-foreground/25 rounded-md cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    <PlusIcon className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground text-center">
                      Add More
                    </span>
                  </label>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {previews.length > 0 && !imageLoadingState && (
        <div className="mt-2 sm:hidden">
          <div className="text-xs text-muted-foreground text-center bg-blue-50 border border-blue-200 rounded-md p-2">
            <span className="flex items-center justify-center gap-1">
              <XIcon className="h-3 w-3 text-red-500" />
              Tap the red X to remove images
            </span>
          </div>
        </div>
      )}
      
      {showSuccessMessage && uploadedImageUrls.length > 0 && !imageLoadingState && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="text-sm text-green-800">
            ✓ Successfully uploaded {uploadedImageUrls.length} image(s)
          </div>
        </div>
      )}

      {isEditMode && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-sm text-blue-800 flex items-center gap-2">
            <EditIcon className="h-4 w-4" />
            <span>Edit mode: You can add, remove, or replace images</span>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default ProductImageUpload;
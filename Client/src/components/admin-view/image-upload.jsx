

import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    if (files.length > 0) {
      handleNewFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).slice(0, 4);
    if (files.length > 0) {
      handleNewFiles(files);
    }
  };

  const handleNewFiles = (files) => {
    setImageFiles(files);
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviews(newPreviews);
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...previews];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setPreviews(newPreviews);
    
    if (newFiles.length === 0 && inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return;
    
    setImageLoadingState(true);
    try {
      const result = await dispatch(uploadProductImages(imageFiles)).unwrap();
      if (result?.images) {
        setUploadedImageUrls(result.images);
        toast.success("Images uploaded successfully");
      }
    } catch (error) {
      toast.error(error.payload?.message || "Failed to upload images");
    } finally {
      setImageLoadingState(false);
    }
  };

  useEffect(() => {
    if (imageFiles.length > 0 && uploadedImageUrls.length === 0) {
      uploadImages();
    }
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [previews]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">
        Product Images {!isEditMode && "(Max 4)"}
      </Label>
      
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="product-images"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
          multiple
          accept="image/*"
        />
        
        {previews.length === 0 ? (
          <label
            htmlFor="product-images"
            className={`flex flex-col items-center justify-center h-32 ${
              isEditMode ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-center">
              {isEditMode ? "Edit images not available" : "Drag & drop or click to upload"}
            </span>
            {!isEditMode && (
              <span className="text-sm text-muted-foreground">Max 4 images (JPEG, PNG)</span>
            )}
          </label>
        ) : (
          <div className="space-y-2">
            {imageLoadingState ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: previews.length }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded-md border"
                    />
                    {!isEditMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
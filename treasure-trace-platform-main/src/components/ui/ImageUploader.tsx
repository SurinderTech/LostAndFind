
import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  className?: string;
  preview?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  className,
  preview
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(preview);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Send the file to the parent component
    onImageSelected(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center w-full",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
          dragActive 
            ? "border-primary bg-primary/5" 
            : "border-slate-300 hover:border-primary/50 hover:bg-slate-50",
          imagePreview ? "bg-slate-50" : ""
        )}
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative w-full h-full p-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-contain rounded"
            />
            <button
              className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors"
              onClick={removeImage}
            >
              <X size={16} className="text-slate-700" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              {dragActive ? (
                <Upload size={28} className="text-primary animate-pulse" />
              ) : (
                <ImageIcon size={28} className="text-slate-400" />
              )}
            </div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              {dragActive ? "Drop image here" : "Drag & drop image here"}
            </p>
            <p className="text-xs text-slate-500">or click to browse</p>
            <p className="mt-2 text-xs text-slate-400">
              PNG, JPG or JPEG (max 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

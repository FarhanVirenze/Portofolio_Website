"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Helper to create a new Image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid CORS issues
    image.src = url;
  });

// Helper to get cropped image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to match the cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg");
}

export function ImageCropperInput({ existingImageUrl }: { existingImageUrl?: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  // The final preview to show to the user (and to upload)
  const [croppedImageBase64, setCroppedImageBase64] = useState<string | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
      // Reset cropped image when new file is chosen
      setCroppedImageBase64(null);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImageBase64(croppedImage);
      // Close modal
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const cancelCrop = () => {
    setImageSrc(null);
    // Note: the original file input will still have the file attached, 
    // but we won't have a cropped image base64, so it would fall back or do nothing.
    // Ideally we reset the input, but it's uncontrolled.
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-muted/30 p-4 rounded-xl border border-border">
      {/* Hidden input to pass base64 to server action */}
      {croppedImageBase64 && (
        <input type="hidden" name="profile_image_base64" value={croppedImageBase64} />
      )}
      {existingImageUrl && !croppedImageBase64 && (
        <input type="hidden" name="existing_profile_image_url" value={existingImageUrl} />
      )}

      {/* Preview Circle */}
      {croppedImageBase64 ? (
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 shrink-0 relative group bg-background flex items-center justify-center">
          <img src={croppedImageBase64} alt="Cropped Preview" className="w-full h-full object-cover" />
        </div>
      ) : existingImageUrl ? (
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 shrink-0 relative group bg-background flex items-center justify-center">
          <img src={existingImageUrl.split("?pos=")[0]} alt="Existing Profile" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground shrink-0 text-xs text-center p-2">
          No Photo
        </div>
      )}

      <div className="flex-1 w-full space-y-3">
        <Input 
          id="profile_image"
          name="profile_image" // We still name it so the original file gets sent just in case, but base64 takes precedence
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="w-full file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-3 file:py-1 cursor-pointer" 
        />
        <p className="text-xs text-muted-foreground">Select an image to replace the current photo. You will be able to crop it before saving.</p>
      </div>

      {/* Cropper Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border overflow-hidden flex flex-col h-[80vh]">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-lg">Crop Image</h3>
              <p className="text-sm text-muted-foreground">Drag to move, scroll to zoom.</p>
            </div>
            
            <div className="relative flex-1 bg-black/10">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // 1:1 aspect ratio for circular profiles
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 flex items-center justify-between border-t border-border bg-card">
              <div className="flex-1 mr-4">
                 <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-label="Zoom"
                  onChange={(e) => {
                    setZoom(Number(e.target.value));
                  }}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={cancelCrop}>Cancel</Button>
                <Button type="button" onClick={showCroppedImage}>Save Crop</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

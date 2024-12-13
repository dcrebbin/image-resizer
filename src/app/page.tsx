"use client";

import { useState, useRef } from "react";
import Image from "next/image";
const initialDimensions = [{ width: 100, height: 100 }];

export default function Home() {
  const [dimensions, setDimensions] = useState(initialDimensions);

  const widthInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resizedImages, setResizedImages] = useState<string[]>([]);
  const handleAddDimension = () => {
    const width = Number(widthInputRef.current?.value) || 0;
    const height = Number(heightInputRef.current?.value) || 0;
    setDimensions([...dimensions, { width, height }]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleResize = async () => {
    const resizedImages = await resizeImage(imageUrl, dimensions);
    // Handle each resized image
    setResizedImages(resizedImages);
  };

  const resizeImage = async (
    imageUrl: string | null,
    dimensions: { width: number; height: number }[]
  ): Promise<string[]> => {
    if (!imageUrl) return [];

    // Create a promise to load the image
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };

    try {
      const img = await loadImage(imageUrl);
      const resizedImages = dimensions.map(({ width, height }) => {
        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // Draw and resize image
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        return canvas.toDataURL("image/jpeg", 0.9);
      });

      return resizedImages;
    } catch (error) {
      console.error("Error resizing image:", error);
      return [];
    }
  };

  function downloadImage() {
    const a = document.createElement("a");
    a.href = resizedImages[0];
    a.download = "image.jpg";
    a.click();
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Image Resizer</h1>
      <div className="flex flex-col gap-4">
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleAddDimension}>Add</button>
        <h2>Dimensions</h2>
        <button onClick={handleResize}>Resize</button>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="width">Width</label>
            <div className="flex flex-row gap-2 ">
              <input
                ref={widthInputRef}
                type="number"
                className="w-16 text-black text-end"
                id="width"
              />
              <span>px</span>
            </div>
          </div>
          <div>
            <span>x</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="height">Height</label>
            <div className="flex flex-row gap-2">
              <input
                ref={heightInputRef}
                type="number"
                className="w-16 text-black text-end"
                id="height"
              />
              <span>px</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2>Uploaded Image</h2>
          {imageUrl && (
            <Image src={imageUrl} alt="Image" width={100} height={100} />
          )}
          <h2>Resized Images</h2>
          {resizedImages.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`Resized Image ${index}`}
              width={100}
              height={100}
            />
          ))}
        </div>
        <button onClick={downloadImage}>Save</button>
      </div>
    </div>
  );
}

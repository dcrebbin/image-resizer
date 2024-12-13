"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const widthInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resizedImages, setResizedImages] = useState<string[]>([]);
  const [uploadedImageDimensions, setUploadedImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [resizedImageDimensions, setResizedImageDimensions] = useState<
    { width: number; height: number }[]
  >([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      const img = document.createElement("img");
      img.onload = () => {
        setUploadedImageDimensions({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleResize = async () => {
    const dimensions = [
      {
        width: Number(widthInputRef.current?.value),
        height: Number(heightInputRef.current?.value),
      },
    ];
    const resizedImages = await resizeImage(
      imageUrl,
      dimensions as { width: number; height: number }[]
    );
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
        setResizedImageDimensions((prev) => [...prev, { width, height }]);

        // Draw and resize image
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        return canvas.toDataURL("image/jpeg", 0.9);
      });
      console.log("Resized images", resizedImages);
      downloadImage(resizedImages[0]);
      return resizedImages;
    } catch (error) {
      console.error("Error resizing image:", error);
      return [];
    }
  };

  function downloadImage(imageUrl: string) {
    console.log("Downloading", imageUrl);
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "image.jpg";
    a.click();
  }

  async function resizeAndDownload() {
    await resizeImage(imageUrl, [
      {
        width: Number(widthInputRef.current?.value),
        height: Number(heightInputRef.current?.value),
      },
    ]).finally(() => {
      console.log("Downloaded", resizedImages[0]);
    });
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center p-4">
      <h1 className="text-2xl font-bold">Image Resizer</h1>
      <div className="flex flex-col gap-4">
        <input type="file" onChange={handleImageChange} />
        <h2>Dimensions</h2>
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
        <div className="flex flex-col gap-2 w-full items-center">
          <h2>Uploaded Image</h2>
          {imageUrl && (
            <div className="overflow-auto w-[300px] h-[300px] bg-white p-2 rounded-md">
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt="Image"
                  fill
                  className="object-contain absolute w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
        <button
          onClick={resizeAndDownload}
          className="bg-white text-black p-2 rounded-md w-full"
        >
          Download
        </button>
      </div>
    </div>
  );
}

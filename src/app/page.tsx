"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import JSZip from "jszip";
export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const selectedDimensionRef = useRef<HTMLSelectElement>(null);

  const [selectedDimension, setSelectedDimension] = useState<string | null>(
    "mac-status-icon"
  );

  const dimensions = {
    "mac-status-icon": [
      { width: 7, height: 7 },
      { width: 14, height: 14 },
      { width: 11, height: 11 },
      { width: 22, height: 22 },
      { width: 24, height: 24 },
      { width: 48, height: 48 },
      { width: 50, height: 50 },
      { width: 100, height: 100 },
      { width: 200, height: 200 },
    ],
    "mac-app-icon": [
      { width: 16, height: 16 },
      { width: 32, height: 32 },
      { width: 48, height: 48 },
    ],
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const resizeImage = async (imageUrl: string | null): Promise<string[]> => {
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
      const resizedImages = dimensions[
        selectedDimension as keyof typeof dimensions
      ].map(({ width, height }) => {
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
      console.log("Resized images", resizedImages);
      downloadImage(resizedImages);
      return resizedImages;
    } catch (error) {
      console.error("Error resizing image:", error);
      return [];
    }
  };

  async function downloadImage(imageUrls: string[]) {
    console.log("Downloading", imageUrls);
    const zip = new JSZip();

    imageUrls.forEach((imageUrl, index) => {
      const base64Data = imageUrl.split(",")[1];
      const blob = base64ToBlob(base64Data, "image/png");
      zip.file(
        `${
          dimensions[selectedDimension as keyof typeof dimensions][index].width
        }x${
          dimensions[selectedDimension as keyof typeof dimensions][index].height
        }.png`,
        blob
      );
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "images.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  function base64ToBlob(base64: string, type: string) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    return new Blob([new Uint8Array(byteArrays)], { type });
  }

  function setCustomDimension(dimension: string) {
    setSelectedDimension(dimension);
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center p-4">
      <h1 className="text-2xl font-bold">EZ Image Resizer</h1>
      <h2 className="text-sm text-white italic">
        Client Side Image Resizer for Icons & Promotional Images
      </h2>
      <span className="text-sm text-white w-[50%] text-center">
        Upload the highest resolution image you have, select a default dimension
        then download the images as a zip.
        <br />
      </span>
      <a href="https://github.com/dcrebbin/image-resizer" className="underline">
        Github Repo
      </a>
      <div className="flex flex-col gap-4">
        <div>
          <input type="file" onChange={handleImageChange} />
          <button
            disabled={!imageUrl}
            className="bg-white text-black p-2 rounded-md w-fit disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setImageUrl(null)}
          >
            Clear
          </button>
        </div>
        <select
          ref={selectedDimensionRef}
          className="bg-white text-black p-2 rounded-md text-center w-full"
          onChange={(e) => setCustomDimension(e.target.value)}
        >
          <option value="mac-status-icon">Mac: Status icon</option>
          <option value="mac-app-icon">Mac: App icon</option>
        </select>
        <div className="flex flex-row gap-2 w-full items-start">
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="flex flex-col gap-2 w-full items-center">
              <h2>Selected Image</h2>
              <div className="overflow-auto w-[300px] h-[300px] bg-white p-2 rounded-md">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#808080_0_90deg,#ffffff_90deg_180deg)] bg-[length:20px_20px] opacity-50"></div>
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt="Image"
                      fill
                      className="object-contain absolute w-full h-full"
                    />
                  )}
                  {!imageUrl && (
                    <span className="w-full h-full flex items-center justify-center text-8xl">
                      📷
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              disabled={!imageUrl}
              onClick={() => resizeImage(imageUrl)}
              className="bg-white text-black p-2 rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download
            </button>
          </div>
          <div className="flex flex-col gap-2 w-full justify-start">
            <h2>Dimensions (px)</h2>
            <div className="overflow-auto w-[100] h-[300px] p-2 rounded-md justify-start">
              {dimensions[selectedDimension as keyof typeof dimensions].map(
                (dimension, index) => (
                  <div key={index}>
                    <span>
                      {dimension.width}x{dimension.height}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

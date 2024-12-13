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
  const imageTitleRef = useRef<HTMLInputElement>(null);
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

  const resizeImage = async (
    imageUrl: string | null,
    dimension: { width: number; height: number } | null = null
  ): Promise<string[]> => {
    if (!imageUrl) {
      alert("No image selected");
      return [];
    }

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
      let resizedImages: string[] = [];
      if (dimension) {
        const canvas = document.createElement("canvas");
        canvas.width = dimension.width;
        canvas.height = dimension.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(img, 0, 0, dimension.width, dimension.height);

        resizedImages.push(canvas.toDataURL("image/png", 1));
        downloadImage(resizedImages);
        return resizedImages;
      }
      resizedImages = dimensions[
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
        return canvas.toDataURL("image/png", 1);
      });

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
    const imageTitle =
      imageTitleRef.current?.value
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "_") || "image";

    if (imageUrls.length == 1) {
      const base64Data = imageUrls[0].split(",")[1];
      const blob = base64ToBlob(base64Data, "image/png");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${imageTitle}.png`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    imageUrls.forEach((imageUrl, index) => {
      const base64Data = imageUrl.split(",")[1];
      const blob = base64ToBlob(base64Data, "image/png");
      zip.file(
        `${imageTitle}-${
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
    a.download = `${imageTitle}.zip`;
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
                  <div className="absolute  inset-0 bg-[repeating-conic-gradient(#808080_0_90deg,#ffffff_90deg_180deg)] bg-[length:20px_20px] opacity-50"></div>
                  {!imageUrl && (
                    <span className="absolute w-full h-full flex items-center justify-center text-8xl">
                      📷
                    </span>
                  )}
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt="Image"
                      fill
                      className="object-contain absolute w-full h-full"
                    />
                  )}
                </div>
              </div>
            </div>
            <input
              type="text"
              ref={imageTitleRef}
              placeholder="my-cool-image-title"
              className="bg-white text-black p-2 rounded-md w-full"
            />
            <button
              disabled={!imageUrl}
              onClick={() => resizeImage(imageUrl)}
              className="bg-white text-black p-2 rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download All
            </button>
          </div>
          <div className="flex flex-col gap-2 w-full justify-start">
            <h2>Dimensions (px)</h2>
            <div className="overflow-auto w-full h-full p-2 rounded-md justify-start flex gap-4 flex-col">
              {dimensions[selectedDimension as keyof typeof dimensions].map(
                (dimension, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 h-full items-center justify-between"
                  >
                    <span className="text-sm text-white underline w-full">
                      {dimension.width}x{dimension.height}
                    </span>
                    {imageUrl && (
                      <button
                        className="bg-white text-black p-2 rounded-md w-10 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => resizeImage(imageUrl, dimension)}
                      >
                        ⬇
                      </button>
                    )}
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

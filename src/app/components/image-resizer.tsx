import { useState, useRef } from "react";
import Image from "next/image";
import JSZip from "jszip";
import { DEFAULT_DIMENSIONS } from "../constants";

export default function ImageResizer() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const selectedDimensionRef = useRef<HTMLSelectElement>(null);

  const [selectedDimension, setSelectedDimension] = useState<string | null>(
    "mac-status-icon"
  );
  const imageTitleRef = useRef<HTMLInputElement>(null);
  const dimensions = DEFAULT_DIMENSIONS;
  const dimensionOptions = {
    "mac-status-icon": "Mac Status icon",
    "mac-app-icon": "Mac App icon",
    "mac-sidebar-icon": "Mac Sidebar icon",
    "ios-app-icon": "iOS App icon",
    "browser-extension-icon": "Browser Extension icon",
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
        .replace(/[^a-zA-Z0-9]/g, "-") || "image";

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
        }x.png`,
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
    <div className="inset-0 flex items-center justify-center w-full z-50">
      <div className="w-full mx-20 xl:mx-60 h-fit rounded-lg overflow-hidden shadow-xl">
        <div className="h-8 bg-gradient-to-b from-[#2584e4] via-[#0f71ce] to-[#3a8cda] flex items-center px-3">
          <span className="text-white text-sm font-semibold">Resize Image</span>
        </div>
        <div className="bg-gradient-to-b from-[#f0f0f0] to-[#e5e5e5] h-[calc(100%-32px)] border-l border-r border-b border-[#858585] text-black p-4">
          <div className="flex flex-row w-full items-center justify-between mb-2">
            <input
              className="  text-black px-2 py-1 rounded  hover:border-[#0078d7] focus:border-[#0078d7] focus:outline-none focus:ring-1 focus:ring-[#0078d7] w-full cursor-pointer"
              type="file"
              onChange={handleImageChange}
            />
            <button
              disabled={!imageUrl}
              className="bg-gradient-to-b from-[#f0f0f0] to-[#e5e5e5] text-black px-4 py-1 rounded border border-[#858585] shadow-sm hover:from-[#eaf3fc] hover:to-[#dcebfc] active:from-[#cce4fc] active:to-[#dcebfc] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
              onClick={() => setImageUrl(null)}
            >
              Clear
            </button>
          </div>
          <select
            ref={selectedDimensionRef}
            className="ml-2 bg-gradient-to-b from-[#f0f0f0] to-[#e5e5e5] text-black px-2 py-1 rounded border border-[#858585] shadow-sm hover:from-[#eaf3fc] hover:border-[#0078d7] focus:border-[#0078d7] focus:outline-none focus:ring-1 focus:ring-[#0078d7] w-full cursor-pointer"
            onChange={(e) => setCustomDimension(e.target.value)}
          >
            {Object.entries(dimensionOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <div className="flex flex-row gap-2 w-full items-start">
            <div className="flex flex-col gap-2 w-full items-center">
              <div className="flex flex-col gap-2 w-full items-center">
                <h2>Selected Image</h2>
                <div className="overflow-auto w-[450px] h-[400px] bg-white p-2 rounded-md">
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
                className="bg-white text-black px-2 py-1 rounded border border-[#858585] shadow-sm hover:border-[#0078d7] focus:border-[#0078d7] focus:outline-none focus:ring-1 focus:ring-[#0078d7] w-full"
              />
              <button
                disabled={!imageUrl}
                onClick={() => resizeImage(imageUrl)}
                className="bg-gradient-to-b from-[#f0f0f0] to-[#e5e5e5] text-black px-4 py-1 rounded border border-[#858585] shadow-sm hover:from-[#eaf3fc] hover:to-[#dcebfc] active:from-[#cce4fc] active:to-[#dcebfc] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
              >
                Download All
              </button>
            </div>
            <div className="flex flex-col gap-2 w-full justify-start">
              <h2>Dimensions (px)</h2>
              <div className="overflow-scroll w-full h-fit p-2 rounded-md justify-start flex gap-4 flex-col">
                {dimensions[selectedDimension as keyof typeof dimensions].map(
                  (dimension, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-2 h-full items-center justify-between"
                    >
                      <span className="text-sm text-black underline w-full">
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
    </div>
  );
}

"use client";
import { useMemo } from "react";
import Window7Wisps from "./components/window7-wisps";
import ImageResizer from "./components/image-resizer";
import IntroDialog from "./components/intro-dialog";

export default function Home() {
  const memoizedWindow7Wisps = useMemo(() => <Window7Wisps />, []);

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center z-50">
      <IntroDialog />
      <ImageResizer />
      <div className="fixed z-50 bottom-0 w-full h-10 bg-gradient-to-b from-[#2584e4] via-[#0f71ce] to-[#3a8cda] flex items-center px-3">
        <span className="text-white text-sm font-semibold">
          Ez Image Resizer
        </span>
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#225baa] via-[#4fc3f7] to-[#225baa]"></div>
      {memoizedWindow7Wisps}
    </div>
  );
}

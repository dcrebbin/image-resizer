export default function IntroDialog() {
  return (
    <div className="inset-0 flex items-center justify-center p-4">
      <div className="w-full md:mx-20 mx-4 xl:mx-60 h-fit rounded-lg overflow-hidden shadow-xl">
        <div className="h-8 bg-gradient-to-b from-[#2584e4] via-[#0f71ce] to-[#3a8cda] flex items-center px-3">
          <span className="text-white text-sm font-semibold">
            Ez Image Resizer
          </span>
        </div>
        <div className="bg-gradient-to-b from-[#f0f0f0] to-[#e5e5e5] h-[calc(100%-32px)] border-l border-r border-b border-[#858585] text-black p-4">
          <h2 className="text-sm text-black italic">
            Client Side Image Resizer for Icons & Promotional Images
          </h2>
          <span className="text-sm w-[50%] text-center">
            Upload the highest resolution image you have, select a default
            dimension then download the images as a zip.
            <br />
          </span>
          <a
            href="https://github.com/dcrebbin/image-resizer"
            target="_blank"
            className="underline"
          >
            Github Repo
          </a>
        </div>
      </div>
    </div>
  );
}

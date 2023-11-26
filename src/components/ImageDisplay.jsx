// components/ImageDisplay.js

import React from "react";

const ImageDisplay = ({ images, prompts, onDownloadImages }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="comic-plate">
            <a
              href={imageUrl}
              download={`Resulting_Image_${index + 1}.png`}
              className="max-w-full mb-2"
            >
              <img
                src={imageUrl}
                alt={`Resulting Image ${index + 1}`}
                className="max-w-full mb-2"
              />
            </a>
            <p className="text-center text-gray-300">{prompts[index]}</p>
          </div>
        ))}
        <div className="mt-4">
          <button
            onClick={onDownloadImages}
            className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
          >
            Download Images
          </button>
          {/* ... (unchanged JSX for copied confirmation) */}
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;

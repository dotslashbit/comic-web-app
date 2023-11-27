// components/ImageDisplay.jsx

import React from "react";

// ImageDisplay component receives image-related functions and data as props
const ImageDisplay = ({ images, prompts, onDownloadImages }) => {
  // JSX structure of the ImageDisplay component
  return (
    <div>
      {/* Grid layout for displaying images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
        {/* Mapping through each image to display in the grid */}
        {images.map((imageUrl, index) => (
          <div key={index} className="comic-plate">
            {/* Link to download individual images */}
            <a
              href={imageUrl}
              download={`Resulting_Image_${index + 1}.png`}
              className="max-w-full mb-2"
            >
              {/* Image element with source and alt text */}
              <img
                src={imageUrl}
                alt={`Resulting Image ${index + 1}`}
                className="max-w-full mb-2"
              />
            </a>
            {/* Prompt text displayed below each image */}
            <p className="text-center text-gray-300">{prompts[index]}</p>
          </div>
        ))}
      </div>

      {/* Text indicating users can click on individual images to download them */}
      <div className="mt-4 text-center text-blue-500">
        Click on individual images to download them.
      </div>

      {/* Button to download all images */}
      <div className="mt-4">
        <button
          onClick={onDownloadImages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
        >
          Download All Images
        </button>
      </div>
    </div>
  );
};

export default ImageDisplay;

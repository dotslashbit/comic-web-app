import React, { useState, useEffect } from "react";
import "./App.css"; // Import your CSS file for styling

function App() {
  const [prompts, setPrompts] = useState(Array(10).fill(""));
  const [images, setImages] = useState(Array(10).fill(null));
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentStep === 10) {
      fetchImages();
    }
  }, [currentStep]);

  const handlePromptChange = (value) => {
    const newPrompts = [...prompts];
    newPrompts[currentStep] = value;
    setPrompts(newPrompts);
  };

  const handleSubmitPrompt = () => {
    if (currentStep < 9) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      setCurrentStep(10);
    }
  };

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const imagePromises = prompts.map((prompt) => search({ inputs: prompt }));
      const imageResponses = await Promise.all(imagePromises);

      const imageUrls = imageResponses.map((response) =>
        URL.createObjectURL(response)
      );
      setImages(imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Error fetching images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  async function search(data) {
    try {
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Image fetch failed");
      }

      const result = await response.blob();
      return result;
    } catch (error) {
      console.error("Error during image fetch:", error);
      throw new Error("Error during image fetch. Please try again.");
    }
  }

  const progressData = prompts.map((_, index) => ({
    promptNumber: index + 1,
    completed: index < currentStep,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black text-white font-sans">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Awesome React App</h1>

        {isLoading && <p className="text-gray-300">Loading...</p>}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {currentStep < 10 && (
          <div>
            <label htmlFor={`prompt-${currentStep + 1}`} className="sr-only">
              {`Enter prompt ${currentStep + 1}`}
            </label>
            <input
              type="text"
              id={`prompt-${currentStep + 1}`}
              value={prompts[currentStep]}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder={`Enter prompt ${currentStep + 1}`}
              className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-2 w-full"
            />
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Provide a concise description for better results.
            </p>
            <button
              type="button"
              onClick={handleSubmitPrompt}
              className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
            >
              {currentStep === 9 ? "Submit" : "Next"}
            </button>

            <div className="mt-4 progress-bar-container">
              <div className="progress-bar">
                {progressData.map((data) => (
                  <div
                    key={data.promptNumber}
                    className={`progress-node ${
                      data.completed ? "completed" : ""
                    }`}
                  />
                ))}
                <div className="progress-edge" />
              </div>
              <p className="text-gray-300 mt-2">
                {currentStep + 1} out of 10 prompts entered
              </p>
            </div>
          </div>
        )}

        {currentStep === 10 && images.every((image) => image !== null) && (
          <div className="grid grid-cols-5 gap-4 mt-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="comic-plate">
                <img
                  src={imageUrl}
                  alt={`Resulting Image ${index + 1}`}
                  className="max-w-full mb-2"
                />
                <p className="text-center text-gray-300">{prompts[index]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

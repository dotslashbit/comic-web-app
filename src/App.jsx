import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./App.css";
import JSZip from "jszip";
import FileSaver from "file-saver";

function App() {
  const [prompts, setPrompts] = useState(Array(10).fill(""));
  const [images, setImages] = useState(Array(10).fill(null));
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [feedback, setFeedback] = useState({
    like: 0,
    dislike: 0,
    suggestion: "",
  });

  const [voteStatus, setVoteStatus] = useState(null);

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
    if (!prompts[currentStep].trim()) {
      setError("Please enter a prompt before moving forward.");
      return;
    }

    setError(null);

    if (currentStep < 9) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      setCurrentStep(10);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const fetchImages = async () => {
    try {
      setIsLoading(true);

      // Check if the user is online
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network.");
      }

      const imagePromises = prompts.map((prompt) => search({ inputs: prompt }));
      const imageResponses = await Promise.all(imagePromises);

      const imageUrls = imageResponses.map((response) =>
        URL.createObjectURL(response)
      );
      setImages(imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(error.message || "Error fetching images. Please try again.");
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

  const downloadImages = () => {
    const zip = new JSZip();
    const imagePromises = images.map((imageUrl, index) => {
      const fileName = `Resulting_Image_${index + 1}.png`;
      return fetch(imageUrl).then((response) => {
        return response.blob().then((blob) => {
          zip.file(fileName, blob);
        });
      });
    });

    Promise.all(imagePromises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, "images.zip");
      });
    });
  };

  const handleLike = () => {
    if (voteStatus === null) {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        like: prevFeedback.like + 1,
      }));
      setVoteStatus("upvote");
    }
  };

  const handleDislike = () => {
    if (voteStatus === null) {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        dislike: prevFeedback.dislike + 1,
      }));
      setVoteStatus("downvote");
    }
  };

  const handleSuggestionChange = (value) => {
    setFeedback((prevFeedback) => ({ ...prevFeedback, suggestion: value }));
  };

  const handleSubmitFeedback = () => {
    // Perform any necessary actions with feedback data
    console.log("Feedback:", feedback);

    // Optionally, you can reset feedback state after submission
    setFeedback({ like: 0, dislike: 0, suggestion: "" });

    // Optionally, you can close or navigate away from the feedback section

    // Reset vote status after submission
    setVoteStatus(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black text-white font-sans">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Awesome React App</h1>

        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="spinner border-t-4 border-blue-500 border-solid h-12 w-12 rounded-full animate-spin"></div>
          </div>
        )}

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
              className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            />
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Provide a concise description for better results. <br />
              You can include text annotations like "dog with a candy with a
              text annotation "I'm happy".
            </p>
            <button
              type="button"
              onClick={goBack}
              className="bg-gray-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-gray-600 w-full sm:w-auto mr-2"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmitPrompt}
              className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600 w-full sm:w-auto"
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
                  onClick={downloadImages}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
                >
                  Download Images
                </button>
                {copied && (
                  <p className="text-green-500 mt-2">
                    Images copied to clipboard!
                  </p>
                )}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-8 flex items-center space-x-4">
              {/* Like Button */}
              <FaThumbsUp
                className="cursor-pointer text-green-500 text-2xl"
                onClick={handleLike}
              />
              <span className="text-white">{feedback.like}</span>

              {/* Dislike Button */}
              <FaThumbsDown
                className="cursor-pointer text-red-500 text-2xl"
                onClick={handleDislike}
              />
              <span className="text-white">{feedback.dislike}</span>

              {/* Suggestion Input */}
              <textarea
                value={feedback.suggestion}
                onChange={(e) => handleSuggestionChange(e.target.value)}
                placeholder="Provide your suggestion..."
                className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-2 flex-grow"
              />

              {/* Submit Feedback Button */}
              <button
                onClick={handleSubmitFeedback}
                className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

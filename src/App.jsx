// App.js

import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./App.css"; // Importing external CSS file
import JSZip from "jszip";
import FileSaver from "file-saver";

import PromptInput from "./components/PromptInput";
import ImageDisplay from "./components/ImageDisplay";
import FeedbackSection from "./components/FeedbackSection";
import TypingAnimation from "./components/TypingAnimation";

function App() {
  // State variables using React Hooks
  const [prompts, setPrompts] = useState(Array(10).fill(""));
  const [images, setImages] = useState(Array(10).fill(null));
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    like: 0,
    dislike: 0,
    suggestion: "",
  });
  const [voteStatus, setVoteStatus] = useState(null);

  // Effect hook to fetch images when the current step changes
  useEffect(() => {
    if (currentStep === 10) {
      fetchImages();
    }
  }, [currentStep]);

  // Function to handle prompt input change
  const handlePromptChange = (value) => {
    setPrompts((prevPrompts) => {
      const newPrompts = [...prevPrompts];
      newPrompts[currentStep] = value;
      return newPrompts;
    });
  };

  // Function to handle submission of prompt
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

  // Function to go back to the previous step
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  // Function to fetch images from the Hugging Face API
  const fetchImages = async () => {
    try {
      setIsLoading(true);

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

  // Function to search for images using the Hugging Face API
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

  // Function to download all images as a zip file
  const downloadImages = () => {
    const zip = new JSZip();
    const imagePromises = images.map((imageUrl, index) => {
      const fileName = `Resulting_Image_${index + 1}.png`;
      return fetch(imageUrl).then((response) =>
        response.blob().then((blob) => zip.file(fileName, blob))
      );
    });

    Promise.all(imagePromises).then(() =>
      zip
        .generateAsync({ type: "blob" })
        .then((content) => FileSaver.saveAs(content, "images.zip"))
    );
  };

  // Function to handle user's like action
  const handleLike = () => {
    if (voteStatus === null) {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        like: prevFeedback.like + 1,
      }));
      setVoteStatus("upvote");
    }
  };

  // Function to handle user's dislike action
  const handleDislike = () => {
    if (voteStatus === null) {
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        dislike: prevFeedback.dislike + 1,
      }));
      setVoteStatus("downvote");
    }
  };

  // Function to handle suggestion input change
  const handleSuggestionChange = (value) => {
    setFeedback((prevFeedback) => ({ ...prevFeedback, suggestion: value }));
  };

  // Function to handle submission of feedback
  const handleSubmitFeedback = () => {
    console.log("Feedback:", feedback);
    setFeedback({ like: 0, dislike: 0, suggestion: "" });
    setVoteStatus(null);
  };

  // JSX structure of the component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black text-white font-sans">
      <div className="container mx-auto text-center">
        {/* Typing animation for the headline */}
        <TypingAnimation />

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center">
            <div className="spinner border-t-4 border-blue-500 border-solid h-12 w-12 rounded-full animate-spin mb-2"></div>
            <p className="text-gray-500">
              Fetching images. This may take 10-12 minutes...
            </p>
          </div>
        )}

        {/* Display error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Display prompt input or feedback sections based on the current step */}
        {currentStep < 10 && (
          <PromptInput
            currentStep={currentStep}
            prompts={prompts}
            onPromptChange={handlePromptChange}
            onSubmitPrompt={handleSubmitPrompt}
            onGoBack={goBack}
          />
        )}

        {/* Display image grid and download button after all prompts are entered */}
        {currentStep === 10 && images.every((image) => image !== null) && (
          <ImageDisplay
            images={images}
            prompts={prompts}
            onDownloadImages={downloadImages}
          />
        )}

        {/* Display feedback section after images are fetched */}
        {currentStep === 10 && images.every((image) => image !== null) && (
          <FeedbackSection
            feedback={feedback}
            voteStatus={voteStatus}
            onLike={handleLike}
            onDislike={handleDislike}
            onSuggestionChange={handleSuggestionChange}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}
      </div>
    </div>
  );
}

export default App;

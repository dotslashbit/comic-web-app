// App.js

import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./App.css";
import JSZip from "jszip";
import FileSaver from "file-saver";

import PromptInput from "./components/PromptInput";
import ImageDisplay from "./components/ImageDisplay";
import FeedbackSection from "./components/FeedbackSection";

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
    console.log("Feedback:", feedback);
    setFeedback({ like: 0, dislike: 0, suggestion: "" });
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
          <PromptInput
            currentStep={currentStep}
            prompts={prompts}
            onPromptChange={handlePromptChange}
            onSubmitPrompt={handleSubmitPrompt}
            onGoBack={goBack}
          />
        )}

        {currentStep === 10 && images.every((image) => image !== null) && (
          <ImageDisplay
            images={images}
            prompts={prompts}
            onDownloadImages={downloadImages}
          />
        )}

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

// components/FeedbackSection.js

import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const FeedbackSection = ({
  feedback,
  onLike,
  onDislike,
  onSuggestionChange,
  onSubmitFeedback,
}) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const canSubmit =
    feedback.like !== 0 ||
    feedback.dislike !== 0 ||
    feedback.suggestion.trim() !== "";

  const handleFeedbackSubmit = () => {
    // Perform feedback submission logic (API call, etc.)
    // For demonstration purposes, set feedbackSubmitted to true after a delay
    setTimeout(() => {
      setFeedbackSubmitted(true);
      // Trigger the parent component's onSubmitFeedback function
      onSubmitFeedback();
    }, 1000);
  };

  return (
    <div className="mt-8 flex items-center space-x-4">
      <FaThumbsUp
        className="cursor-pointer text-green-500 text-2xl"
        onClick={onLike}
        disabled={feedback.like !== 0}
      />

      <FaThumbsDown
        className="cursor-pointer text-red-500 text-2xl"
        onClick={onDislike}
        disabled={feedback.dislike !== 0}
      />

      <textarea
        value={feedback.suggestion}
        onChange={(e) => onSuggestionChange(e.target.value)}
        placeholder="Provide your suggestion..."
        className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-2 flex-grow"
      />

      <button
        onClick={handleFeedbackSubmit}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600 ${
          canSubmit ? "" : "cursor-not-allowed opacity-50"
        }`}
        disabled={!canSubmit}
      >
        Submit Feedback
      </button>

      {feedbackSubmitted && (
        <p className="text-green-500 ml-2">Feedback received! Thank you!</p>
      )}
    </div>
  );
};

export default FeedbackSection;

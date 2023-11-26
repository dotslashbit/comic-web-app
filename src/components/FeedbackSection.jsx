// components/FeedbackSection.js

import React from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const FeedbackSection = ({
  feedback,
  onLike,
  onDislike,
  onSuggestionChange,
  onSubmitFeedback,
}) => {
  const canSubmit =
    feedback.like !== 0 ||
    feedback.dislike !== 0 ||
    feedback.suggestion.trim() !== "";

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
        onClick={onSubmitFeedback}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600 ${
          canSubmit ? "" : "cursor-not-allowed opacity-50"
        }`}
        disabled={!canSubmit}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackSection;

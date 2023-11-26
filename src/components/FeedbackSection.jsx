// components/FeedbackSection.js

import React from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const FeedbackSection = ({
  feedback,
  voteStatus,
  onLike,
  onDislike,
  onSuggestionChange,
  onSubmitFeedback,
}) => {
  return (
    <div className="mt-8 flex items-center space-x-4">
      <FaThumbsUp
        className="cursor-pointer text-green-500 text-2xl"
        onClick={onLike}
      />
      <span className="text-white">{feedback.like}</span>

      <FaThumbsDown
        className="cursor-pointer text-red-500 text-2xl"
        onClick={onDislike}
      />
      <span className="text-white">{feedback.dislike}</span>

      <textarea
        value={feedback.suggestion}
        onChange={(e) => onSuggestionChange(e.target.value)}
        placeholder="Provide your suggestion..."
        className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-2 flex-grow"
      />

      <button
        onClick={onSubmitFeedback}
        className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackSection;

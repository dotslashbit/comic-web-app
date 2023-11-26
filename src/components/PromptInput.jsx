// components/PromptInput.js

import React from "react";

const PromptInput = ({
  currentStep,
  prompts,
  onPromptChange,
  onSubmitPrompt,
  onGoBack,
}) => {
  const handleKeyDown = (e) => {
    // Check if the pressed key is Enter
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior (e.g., form submission)
      onSubmitPrompt();
    }
  };

  const progressData = prompts.map((_, index) => ({
    promptNumber: index + 1,
    completed: index < currentStep,
  }));

  return (
    <div>
      <label htmlFor={`prompt-${currentStep + 1}`} className="sr-only">
        {`Enter prompt ${currentStep + 1}`}
      </label>
      <input
        type="text"
        id={`prompt-${currentStep + 1}`}
        value={prompts[currentStep]}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Enter prompt ${currentStep + 1}`}
        className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"
      />
      <p className="text-gray-500 text-sm mt-2 mb-4">
        Provide a concise description for better results. <br />
        You can include text annotations like "dog with a candy with a text
        annotation "I'm happy".
      </p>
      <button
        type="button"
        onClick={onGoBack}
        className="bg-gray-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-gray-600 w-full sm:w-auto mr-2"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onSubmitPrompt}
        className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600 w-full sm:w-auto"
      >
        {currentStep === 9 ? "Submit" : "Next"}
      </button>

      <div className="mt-4 progress-bar-container">
        <div className="progress-bar">
          {progressData.map((data) => (
            <div
              key={data.promptNumber}
              className={`progress-node ${data.completed ? "completed" : ""}`}
            />
          ))}
          <div className="progress-edge" />
        </div>
        <p className="text-gray-300 mt-2">
          {currentStep + 1} out of 10 prompts entered
        </p>
      </div>
    </div>
  );
};

export default PromptInput;

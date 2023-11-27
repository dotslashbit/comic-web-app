// components/TypingAnimation.js

import React, { useState, useEffect } from "react";

// TypingAnimation component handles the typing animation of text
const TypingAnimation = () => {
  // Static text for "Comic"
  const [comicText] = useState("Comic");
  // Dynamic text for "Generator" during animation
  const [generatorText, setGeneratorText] = useState("");
  // Full text for "Generator" to be animated
  const fullGeneratorText = "Generator";

  useEffect(() => {
    // Index to track the current position in the animation
    let index = 0;
    // Flag to track if the component is unmounted
    let isUnmounted = false;

    // Function to type the next character in the animation
    const typeNextCharacter = () => {
      // Check if the component is unmounted
      if (isUnmounted) return;

      // Calculate the next index in the animation
      const nextIndex = index % (2 * fullGeneratorText.length);

      // Check if the animation is in the forward phase
      if (nextIndex < fullGeneratorText.length) {
        // Forward animation
        setGeneratorText(fullGeneratorText.substring(0, nextIndex + 1));
      } else {
        // Backward animation
        const backwardIndex = 2 * fullGeneratorText.length - nextIndex - 1;
        setGeneratorText(fullGeneratorText.substring(0, backwardIndex + 1));
      }

      // Increment the index for the next character
      index++;

      // Set a short delay for smooth animation
      const delay = 80;

      // Check if the animation has completed
      if (index <= 2 * fullGeneratorText.length) {
        // Continue typing the next character
        setTimeout(typeNextCharacter, delay);
      } else {
        // Animation completed, reset index, and restart animation after a delay
        index = 0;
        setTimeout(typeNextCharacter, 1000); // Delay before restarting (adjust as needed)
      }
    };

    // Start the typing animation
    typeNextCharacter();

    // Cleanup function to handle component unmount
    return () => {
      isUnmounted = true;
    };
  }, []); // Empty dependency array to run the effect only once on mount

  // JSX structure of the TypingAnimation component
  return (
    <h1 className="text-5xl font-bold mb-8">
      {/* Static text with gradient color for "Comic" */}
      <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        {comicText}
      </span>{" "}
      {/* Dynamic text with gradient color for "Generator" during animation */}
      <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        {generatorText}
      </span>
    </h1>
  );
};

export default TypingAnimation;

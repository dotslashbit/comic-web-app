// components/TypingAnimation.js

import React, { useState, useEffect } from "react";

const TypingAnimation = () => {
  const [comicText] = useState("Comic");
  const [generatorText, setGeneratorText] = useState("");
  const fullGeneratorText = "Generator";

  useEffect(() => {
    let index = 0;
    let isUnmounted = false;

    const typeNextCharacter = () => {
      if (isUnmounted) return;

      const nextIndex = index % (2 * fullGeneratorText.length);

      if (nextIndex < fullGeneratorText.length) {
        // Forward animation
        setGeneratorText(fullGeneratorText.substring(0, nextIndex + 1));
      } else {
        // Backward animation
        const backwardIndex = 2 * fullGeneratorText.length - nextIndex - 1;
        setGeneratorText(fullGeneratorText.substring(0, backwardIndex + 1));
      }

      index++;

      const delay = 80; // Short delay for smooth animation

      if (index <= 2 * fullGeneratorText.length) {
        setTimeout(typeNextCharacter, delay);
      } else {
        // Reset index and restart animation
        index = 0;
        setTimeout(typeNextCharacter, 1000); // Delay before restarting (adjust as needed)
      }
    };

    typeNextCharacter();

    // Cleanup function to handle component unmount
    return () => {
      isUnmounted = true;
    };
  }, []);

  return (
    <h1 className="text-5xl font-bold mb-8">
      <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        {comicText}
      </span>{" "}
      <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        {generatorText}
      </span>
    </h1>
  );
};

export default TypingAnimation;

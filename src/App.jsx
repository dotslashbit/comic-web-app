import { useState } from "react";

function App() {
  const [prompts, setPrompts] = useState(Array(10).fill(""));
  const [images, setImages] = useState(Array(10).fill(null));

  function handlePromptChange(index, value) {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  }

  async function handleSubmit() {
    const imagePromises = prompts.map((prompt) => search({ inputs: prompt }));

    try {
      const imageResponses = await Promise.all(imagePromises);

      const imageUrls = imageResponses.map((response) =>
        URL.createObjectURL(response)
      );
      setImages(imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  async function search(data) {
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
    const result = await response.blob();
    return result;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black text-white font-sans">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Awesome React App</h1>

        <form>
          {prompts.map((prompt, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => handlePromptChange(index, e.target.value)}
                placeholder={`Enter prompt ${index + 1}`}
                className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {images.every((image) => image !== null) && (
          <div className="mt-4">
            {images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Resulting Image ${index + 1}`}
                className="max-w-full mb-2"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

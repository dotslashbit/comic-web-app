import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [imageURL, setImageURL] = useState(null);

  function handleSubmitQuery(event) {
    event.preventDefault();
    console.log("Query submitted:", query);
    search({ inputs: query }).then((response) => {
      // Assuming the response is a Blob containing the image
      const imageURL = URL.createObjectURL(response);
      setImageURL(imageURL);
    });
    setQuery("");
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
        <form className="flex items-center">
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query"
            className="bg-gray-700 text-white px-4 py-2 rounded-md mt-2 focus:outline-none focus:ring focus:border-blue-300 w-full max-w-2xl"
          />
          <button
            type="submit"
            onClick={handleSubmitQuery}
            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 focus:outline-none hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {imageURL && (
          <div className="mt-4">
            <img src={imageURL} alt="Resulting Image" className="max-w-full" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

# Comic Generator Web App Documentation

## Overview

The Comic Generator Web App is a web application designed to facilitate the process of generating 10 comic panels based on user-provided prompts. Users can enter prompts, navigate through a series of steps, and ultimately receive a collection of resulting images.

## Features

- **Prompt Input**: Users can enter descriptive prompts to guide the generation of images.
- **Navigation**: Users can navigate through a series of prompts, providing input for each step.
- **Image Generation**: After entering all prompts, the app fetches images based on the provided prompts.
- **Download Images**: Users can download the resulting images as a ZIP file.
- **Feedback Section**: Users can provide feedback on the generated images, including likes, dislikes, and suggestions.

## Getting Started

To run the Comic Generator Web App locally, follow these steps:

1. Clone the repository: `git clone https://github.com/dotslashbit/comic-web-app`
2. Navigate to the project directory: `cd comic-web-app`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`
5. Open your browser and visit `http://localhost:3000`

## Usage

1. **Entering Prompts**:

   - Navigate through the prompts by using the "Next" and "Back" buttons.
   - Enter a descriptive prompt for each step.
   - Press "Enter" to submit a prompt.

2. **Fetching Images**:

   - Once all prompts are entered, the app fetches images based on the provided prompts.

3. **Viewing and Downloading Images**:

   - View the resulting images along with the entered prompts.
   - Download images using the "Download Images" button.

4. **Providing Feedback**:
   - Use the thumbs-up and thumbs-down icons to vote on images.
   - Provide additional feedback and suggestions in the text area.
   - Submit feedback using the "Submit Feedback" button.

## Dependencies

The Awesome React App relies on the following key dependencies:

- [React](https://reactjs.org/)
- [JSZip](https://stuk.github.io/jszip/)
- [FileSaver](https://github.com/eligrey/FileSaver.js/)

## Contributing

Contributions to the Awesome React App are welcome! If you encounter issues or have suggestions, feel free to open an [issue](https://github.com/your-username/awesome-react-app/issues) or submit a [pull request](https://github.com/your-username/awesome-react-app/pulls).

## License

This project is licensed under the [MIT License](LICENSE).

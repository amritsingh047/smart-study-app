# Smart Study Assistant

## Vertical Persona Chosen
**Education / Smart Study Assistant**
This project implements an intelligent tutor designed to help students learn effectively. It can summarize complex topics, explain concepts simply, and generate quizzes to test knowledge.

## Approach and Logic
The application uses a lightweight client-server architecture:
1. **Frontend:** Vanilla HTML, CSS, and JavaScript. This ensures the footprint is incredibly small (well under the 1 MB limit) and maximizes performance. It implements ARIA accessibility features to ensure screen readers can navigate the chat interface.
2. **Backend:** Node.js with Express provides a robust and scalable API endpoint.
3. **Google Service Integration:** The backend integrates with the **Google Gemini API** (`gemini-2.5-flash`). We use system instructions to guide the AI to behave specifically as a tutor, rather than a general-purpose chatbot.

## How the Solution Works
1. The user types a study-related question (e.g., "Explain photosynthesis") into the frontend chat interface.
2. The JavaScript client sends an asynchronous POST request to the Express backend (`/api/chat`).
3. The Express backend securely holds the `GEMINI_API_KEY` and forwards the request to the Google Gemini API, appending the predefined system instructions.
4. Gemini generates an educational response, which is returned to the client and displayed in the UI.

## Assumptions Made
- The user has a stable internet connection.
- A valid Google Gemini API key is provided in the `.env` file for the backend to function.
- Deployment environments (like Heroku, Render, or GitHub Pages + Backend) support Node.js applications.

## Running Locally
1. `npm install`
2. Create a `.env` file and add `GEMINI_API_KEY=your_key`
3. `node index.js`
4. Open `http://localhost:3000`

## Evaluation Criteria Met
- **Code Quality:** Modularized code, clear variable names, and standard Node.js project structure.
- **Security:** API keys are never exposed to the frontend; they are kept server-side in `.env`.
- **Efficiency:** Vanilla JS and minimal dependencies keep the application lightweight.
- **Testing:** Basic unit tests are included using Jest (`npm test`).
- **Accessibility:** The frontend utilizes ARIA tags (`aria-live`, `aria-label`) for inclusivity.
- **Google Services:** Deep integration with Google Gemini for core logic.

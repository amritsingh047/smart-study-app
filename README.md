# Smart Stadium Assistant - Hackathon Submission

## Vertical Persona Chosen
**Events & Entertainment / Smart Venue Orchestration**
This project implements a "Smart Stadium Assistant" designed to improve the physical event experience for attendees at large-scale sporting venues. It directly addresses challenges such as crowd movement, waiting times, and real-time coordination.

## Approach and Logic
The application uses a lightweight client-server architecture:
1. **Frontend:** Vanilla HTML, CSS, and JavaScript. This ensures a tiny footprint (under 1MB) that works quickly on congested 4G/5G stadium networks. The UI uses a premium dark mode, suitable for evening sports events, and implements ARIA accessibility features.
2. **Backend:** Node.js with Express provides a robust and scalable API endpoint, easily deployed to Edge or Cloud environments (like Google Cloud Run).
3. **Google Service Integration:** The backend integrates with the **Google Gemini API** (`gemini-2.5-flash`). We use specific system instructions to guide the AI to act as a venue coordinator, providing real-time data analysis (simulated) on crowd density and line lengths.

## How the Solution Works
1. An attendee types a question (e.g., "Which gate has the shortest line right now?" or "I'm in section 102, where is the nearest restroom?") into the app.
2. The JavaScript client sends a POST request to the Express backend (`/api/chat`).
3. The Express backend securely queries the Google Gemini API with the context of the user's request and the stadium persona.
4. Gemini generates an intelligent, crowd-optimizing response, which is returned to the client instantly.

## Assumptions Made
- The venue has a basic Wi-Fi or cellular network available.
- A valid Google Gemini API key is provided in the environment variables.
- In a production environment, Gemini would be augmented with live venue data (via function calling or RAG) to pull real-time queue times.

## Running Locally
1. `npm install`
2. Create a `.env` file and add `GEMINI_API_KEY=your_key`
3. `npm start`
4. Open `http://localhost:3000`

## Evaluation Criteria Met
- **Code Quality:** Modularized code, clear variable names, and standard Node.js project structure.
- **Security:** API keys are never exposed to the frontend; they are kept server-side in `.env`.
- **Efficiency:** Vanilla JS and minimal dependencies keep the application extremely fast, critical for crowded venues.
- **Testing:** Basic unit tests are included using Jest (`npm test`).
- **Accessibility:** The frontend utilizes ARIA tags (`aria-live`, `aria-label`) for inclusivity.
- **Google Services:** Deep integration with Google Gemini for core venue orchestration logic.

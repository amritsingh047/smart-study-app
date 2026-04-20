/**
 * Server Entry Point
 * Loads environment variables and starts the Express application.
 */

const dotenv = require('dotenv');
// Load environment variables before requiring the app
dotenv.config();

const app = require('./app');
const gcpService = require('./services/gcpService');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    gcpService.writeLog('INFO', 'Server started successfully', { port });
});

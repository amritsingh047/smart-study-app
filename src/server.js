/**
 * Server Entry Point
 * Loads environment variables and starts the Express application.
 */

const dotenv = require('dotenv');
// Load environment variables before requiring the app
dotenv.config();

try {
    const app = require('./app');
    const gcpService = require('./services/gcpService');

    const port = process.env.PORT || 8080;

    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running at http://0.0.0.0:${port}`);
        gcpService.writeLog('INFO', 'Server started successfully', { port });
    }).on('error', (err) => {
        console.error('Express server failed to bind:', err);
    });
} catch (error) {
    console.error('CRITICAL ERROR DURING STARTUP:', error);
}

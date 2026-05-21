// auth-youtube.js
// One-time OAuth2 setup for YouTube API
// Uses localhost redirect (Google deprecated OOB flow)

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const { google } = require('googleapis');
const open = require('open');

const CREDENTIALS_PATH = path.join(__dirname, '..', 'config', 'client_secret.json');
const TOKEN_PATH = path.join(__dirname, '..', 'config', 'tokens.json');
const REDIRECT_PORT = 3456;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`;

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

async function authenticate() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('❌ Missing client_secret.json');
    console.error('   Expected at:', CREDENTIALS_PATH);
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { client_id, client_secret } = credentials.installed || credentials.web;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);

  // Check for existing tokens
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oauth2Client.setCredentials(tokens);
    console.log('✅ Existing tokens found and loaded');
    return oauth2Client;
  }

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\n🔐 Opening browser for authorization...');
  console.log('   If browser does not open, visit:', authUrl);
  console.log('\n⏳ Waiting for you to authorize...\n');

  // Open browser
  try {
    await open(authUrl);
  } catch {
    console.log('   (Could not auto-open browser — please open the URL manually)');
  }

  // Start temporary HTTP server to catch the redirect
  const code = await waitForCallback();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens
    fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('\n✅ Tokens saved to', TOKEN_PATH);
    return oauth2Client;
  } catch (err) {
    console.error('\n❌ Failed to exchange code for tokens:', err.message);
    process.exit(1);
  }
}

function waitForCallback() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const query = url.parse(req.url, true).query;

      if (query.code) {
        // Success page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>Authorization Complete</title></head>
            <body style="font-family:sans-serif;text-align:center;padding:40px;">
              <h1>✅ Authorization Complete</h1>
              <p>You can close this tab and return to the terminal.</p>
            </body>
          </html>
        `);
        server.close(() => resolve(query.code));
      } else if (query.error) {
        // Error page
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>Authorization Failed</title></head>
            <body style="font-family:sans-serif;text-align:center;padding:40px;">
              <h1>❌ Authorization Failed</h1>
              <p>Error: ${query.error}</p>
            </body>
          </html>
        `);
        server.close(() => reject(new Error(query.error)));
      }
    });

    server.listen(REDIRECT_PORT, () => {
      console.log('   Local callback server listening on http://localhost:3000');
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authorization timed out (5 minutes). Please try again.'));
    }, 5 * 60 * 1000);
  });
}

// If run directly
if (require.main === module) {
  authenticate()
    .then(() => {
      console.log('\n🎉 YouTube authentication complete!');
      console.log('   You can now run: node scripts/upload-youtube.js');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = { authenticate };

// auth-youtube.js
// One-time OAuth2 setup for YouTube API
// Run this first to generate tokens.json

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');

const CREDENTIALS_PATH = path.join(__dirname, '..', 'config', 'client_secret.json');
const TOKEN_PATH = path.join(__dirname, '..', 'config', 'tokens.json');

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

async function authenticate() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('❌ Missing client_secret.json');
    console.error('   Download from Google Cloud Console → APIs & Services → Credentials');
    console.error('   Save to: video-pipeline/config/client_secret.json');
    console.error('\n   Required setup:');
    console.error('   1. Go to https://console.cloud.google.com/');
    console.error('   2. Create project or select existing');
    console.error('   3. Enable YouTube Data API v3');
    console.error('   4. Create OAuth 2.0 credentials (Desktop app)');
    console.error('   5. Download JSON and save as client_secret.json');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0] || 'http://localhost:3000/oauth2callback'
  );

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

  console.log('🔐 Authorize this app by visiting this URL:');
  console.log(authUrl);
  console.log('\n   Or waiting for browser to open...\n');

  // Open browser automatically
  try { await open(authUrl); } catch (e) { /* ignore */ }

  // Create local server to receive callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
      const code = qs.get('code');

      if (code) {
        res.end('✅ Authentication successful! You can close this tab.');
        server.destroy();

        try {
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);

          // Save tokens
          fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
          console.log('✅ Tokens saved to', TOKEN_PATH);
          resolve(oauth2Client);
        } catch (err) {
          reject(err);
        }
      } else {
        res.end('❌ No code provided');
        reject(new Error('No auth code'));
      }
    }).listen(3000, () => {
      console.log('🌐 Waiting for callback on http://localhost:3000...');
    });

    destroyer(server);
  });
}

// If run directly
if (require.main === module) {
  authenticate()
    .then(() => {
      console.log('\n🎉 YouTube authentication complete!');
      console.log('   You can now run: node scripts/upload-youtube.js');
    })
    .catch(console.error);
}

module.exports = { authenticate };

// src/ExpressJS/oauth.js

import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import dotenv from 'dotenv'; 

dotenv.config();


const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Step 1: Redirect user to Google OAuth consent screen
router.get('/login', (req, res) => {
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Step 2: OAuth callback, exchange code for tokens
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { id_token, access_token } = tokenRes.data;

    // Decode id_token on backend or send tokens to frontend securely
    // For now, redirect back with tokens or session setup
    res.redirect(`http://localhost:5173/?id_token=${id_token}&access_token=${access_token}`);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error exchanging code for tokens');
  }
});

export default router;

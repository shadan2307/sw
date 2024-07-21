const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(cors({
  origin: 'https://telegram.org'
}));

const BOT_TOKEN = '7384018713:AAG7JpmArxlW51-yH2NtaSUqS0R7q7HoBDM'; // Use your actual bot token

function checkSignature(query) {
  const { hash, ...data } = query;
  const checkString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n');
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
  return hmac === hash;
}

app.get('/auth', (req, res) => {
  console.log('Received auth request:', req.query); // Log the request
  if (checkSignature(req.query)) {
    const { id, username, first_name, last_name, photo_url, auth_date } = req.query;
    res.json({ id, username, first_name, last_name, photo_url, auth_date });
  } else {
    res.status(401).send('Authentication failed');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

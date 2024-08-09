// server.js (Node.js with Express)
const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

app.use('/api', (req, res) => {
  const apiUrl = 'http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&Args=ev_p,fb_p,fo_o,kelly,dm';
  request(apiUrl).pipe(res);
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});

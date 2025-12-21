const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

let surveys = [];

app.get('/survey', (req, res) => {
  res.json(surveys);
});

app.post('/survey', (req, res) => {
  surveys.push(req.body);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

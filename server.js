// server.js
require('dotenv').config(); // Add this line
const express = require('express');
const bodyParser = require('body-parser');
const resourceRoutes = require('./routes/resourceRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/v1', resourceRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// connect MongoDB
require('./utils/MongooseUtil');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// api test
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// apis
app.use('/api/customer', require('./api/customer.js'));

// start server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
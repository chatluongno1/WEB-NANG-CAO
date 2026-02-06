const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

// Use env var MONGO_URI if available, otherwise build from constants with proper encoding
const uri =
  process.env.MONGO_URI ||
  `mongodb+srv://${encodeURIComponent(MyConstants.DB_USER)}:${encodeURIComponent(
    MyConstants.DB_PASS
  )}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}?retryWrites=true&w=majority&authSource=admin`;

mongoose
  .connect(uri)
  .then(() => {
    console.log(
      'Connected to ' +
        MyConstants.DB_SERVER +
        '/' +
        MyConstants.DB_DATABASE
    );
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

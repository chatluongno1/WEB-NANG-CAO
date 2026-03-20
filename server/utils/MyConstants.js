const MyConstants = {
  DB_SERVER: 'cluster0.y3ckj3q.mongodb.net', 
  DB_USER: 'hoa2374802010147_db_user',
  DB_PASS: 'sadlove123',
  DB_DATABASE: 'shoppingonline',
  JWT_SECRET: 'my_super_secret_key',
  JWT_EXPIRES: 3600000,

  // email credentials (configured via environment variables)
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',

  // URL of client app (used for activation link)
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};

module.exports = MyConstants;

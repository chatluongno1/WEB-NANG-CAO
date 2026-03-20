// CLI: npm install nodemailer --save
const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

// ensure credentials are supplied
let transporter = null;
if (!MyConstants.EMAIL_USER || !MyConstants.EMAIL_PASS) {
  console.error('EmailUtil: missing EMAIL_USER or EMAIL_PASS environment variables');
} else {
  transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: MyConstants.EMAIL_USER,
      pass: MyConstants.EMAIL_PASS
    }
  });
}


const EmailUtil = {
  send(email, id, token) {
    // build activation link
  const link = `${MyConstants.CLIENT_URL}/active?id=${id}&token=${token}`;
  const text =
      'Thanks for signing up, please click the following link to activate your account:\n' +
      link;

    return new Promise(function (resolve, reject) {
      if (!transporter) {
        console.error('EmailUtil: transporter not initialized, email not sent');
        resolve(false);
        return;
      }

      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text: text
      };

      transporter.sendMail(mailOptions, function (err, result) {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
};

module.exports = EmailUtil;

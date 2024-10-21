const express = require('express');

const authRouter = (drizzle) => {
  const router = express.Router();

    // Endpoint to request magic link
    router.post('/auth/magic-link', async (req, res) => {
    const { email } = req.body; // Get the user's email address

    // Generate a unique magic link
    const magicLink = uuidv4();
    const magicLinkUrl = `https://example.com/auth/magic-link/${magicLink}`;

    // Send the magic link to the user's email address
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false, // or 'STARTTLS'
      auth: {
        user: 'username',
        pass: 'password'
      }
    });

    //TODO: add captcha and user creation with magic link code for verification, also not yet verified

    const mailOptions = {
      from: 'username@example.com',
      to: email,
      subject: 'Magic Link Authentication',
      text: `Click on the following link to authenticate: ${magicLinkUrl}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    res.json({ success: true, message: 'Magic link sent to your email address' });
  });

  router.get('/auth/magic-link/:magicLink', async (req, res) => {
    const { magicLink } = req.params; // Get the magic link from the URL

    //TODO: grab internal magic link via userId
  
    // Verify the magic link
    if (magicLink === 'valid-magic-link') {
      // Authenticate the user
      req.user.isAnonymous = false;
      res.cookie('anonId', req.user.id, { maxAge: 604800000, httpOnly: true }); // Update the anonId cookie
  
      // Redirect to protected route
      res.redirect('/protected');
    } else {
      res.status(401).json({ error: 'Invalid magic link' });
    }
  });


  return router;
};

module.exports = authRouter;
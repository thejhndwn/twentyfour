const express = require('express');

const authRouter = (drizzle) => {
  const router = express.Router();

  router.post('/register', (req, res) => {
    const { username, password } = req.body;
    drizzle.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: 'Error registering user' });
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    drizzle.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password],
      (err, result) => {
        if (err || !result.rows[0]) {
          res.status(401).json({ message: 'Invalid credentials' });
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });

  return router;
};

module.exports = authRouter;

/*
const express = require('express');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const nodemailer = require('nodemailer'); // For sending emails

const app = express();
app.use(cookieParser());

// Middleware to handle user identification
app.use((req, res, next) => {
  const anonId = req.cookies.anonId; // Check for existing anonymous ID cookie

  if (!anonId) {
    // Generate a new anonymous ID and set it in a cookie
    const newAnonId = uuidv4();
    res.cookie('anonId', newAnonId, { maxAge: 604800000, httpOnly: true }); // 1 week expiration
    req.user = { id: newAnonId, isAnonymous: true };
  } else {
    // Use existing anonymous ID
    req.user = { id: anonId, isAnonymous: true };
  }

  next(); // Proceed to the next middleware or route handler
});

// Endpoint to request magic link
app.post('/auth/magic-link', async (req, res) => {
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

// Endpoint to handle magic link authentication
app.get('/auth/magic-link/:magicLink', async (req, res) => {
  const { magicLink } = req.params; // Get the magic link from the URL

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

// Protected route
app.get('/protected', (req, res) => {
  if (req.user.isAnonymous) {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    res.json({ success: true, message: 'Welcome to the protected route!' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
*/
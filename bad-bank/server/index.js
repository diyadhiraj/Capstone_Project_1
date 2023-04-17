const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/badbank', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema for user data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  accountType: String
});

// Define user model
const User = mongoose.model('User', userSchema);

// Initialize Firebase Admin SDK
const serviceAccount = require('./badbank-a4aa9-firebase-adminsdk-5z49a-71268e6a96.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Use body-parser middleware
app.use(bodyParser.json());

// Define routes
app.post('/api/create-account', authenticateToken, async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;

    // Create new user object
    const user = new User({ name, email, password, accountType });

    // Save user to database
    await user.save();

    // Send success response
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create account' });
  }
});

// Middleware to authenticate Firebase token
function authenticateToken(req, res, next) {
  // Read token from header
  const idToken = req.headers.authorization;

  if (!idToken) {
    res.status(401).send('Unauthorized');
    return;
  }

  // Verify token
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      // Add user ID to request object
      req.userId = decodedToken.uid;
      next();
    })
    .catch((error) => {
      console.error('Error verifying Firebase token:', error);
      res.status(401).send('Unauthorized');
    });
}

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

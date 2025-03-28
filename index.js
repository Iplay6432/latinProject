const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(compression());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.set('public', path.join(__dirname, 'public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/data/photos', express.static(path.join(__dirname, 'data/photos')));

// Use morgan for logging to the console
app.use(morgan('combined'));

// Basic Authentication Middleware
const basicAuth = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
    return res.status(401).send('Authentication required.');
  }

  const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  if (username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
  return res.status(401).send('Authentication required.');
};

// Apply Basic Authentication Middleware to All Routes
app.use(basicAuth);

const postsFilePath = path.join(__dirname, 'data', 'posts.json');

const getPosts = () => {
  const data = fs.readFileSync(postsFilePath, 'utf8');
  return JSON.parse(data);
};

app.get('/', (req, res) => {
  const posts = getPosts();
  res.render('index', { posts: posts });
});

app.get('/post/:id', (req, res) => {
  const posts = getPosts();
  const post = posts.find(p => p.id === req.params.id);
  res.render('post', { post: post });
});

app.get('/post/:id/sources', (req, res) => {
  const posts = getPosts();
  const post = posts.find(p => p.id === req.params.id);
  res.render('sources', { post: post });
});

// Use environment variable for port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
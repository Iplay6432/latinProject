const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan'); // Import morgan
const app = express();
const helmet = require('helmet');
app.use(helmet());
const compression = require('compression');
app.use(compression());
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/data/photos', express.static(path.join(__dirname, 'data/photos')));

// Create a write stream (in append mode) for logging
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Use morgan for logging to both the console and the file
app.use(morgan('combined', { stream: logStream }));

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

// Use environment variable for port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
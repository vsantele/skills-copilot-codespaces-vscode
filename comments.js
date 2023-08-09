// Create web server
// 1. Import library
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// 2. Middleware
// 2.1. Parse data from user
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 2.2. Check user login
app.use((req, res, next) => {
  const { username } = req.query;
  if (username) {
    req.username = username;
    next();
  } else {
    res.send('You need to login');
  }
});

// 3. Router
// 3.1. Get all comments
app.get('/comments', (req, res) => {
  const data = fs.readFileSync('./data.json', { encoding: 'utf8' });
  const comments = JSON.parse(data);
  res.json(comments);
});

// 3.2. Create new comment
app.post('/comments', (req, res) => {
  const { username } = req;
  const { content } = req.body;
  const data = fs.readFileSync('./data.json', { encoding: 'utf8' });
  const comments = JSON.parse(data);
  comments.push({ username, content });
  fs.writeFileSync('./data.json', JSON.stringify(comments));
  res.send('Create comment successfully');
});

// 3.3. Edit comment
app.put('/comments/:id', (req, res) => {
  const { username } = req;
  const { id } = req.params;
  const { content } = req.body;
  const data = fs.readFileSync('./data.json', { encoding: 'utf8' });
  const comments = JSON.parse(data);
  const index = comments.findIndex((comment) => comment.id === +id);
  if (index !== -1 && comments[index].username === username) {
    comments[index].content = content;
    fs.writeFileSync('./data.json', JSON.stringify(comments));
    res.send('Edit comment successfully');
  } else {
    res.send('Comment not found');
  }
});

// 3.4. Delete comment
app.delete('/comments/:id', (req, res) => {
  const { username } = req;
  const { id } = req.params;
  const data = fs.readFileSync('./data.json', { encoding: 'utf8' });
  const comments = JSON.parse(data);
  const index = comments.findIndex((comment) => comment.id === +id);
  if (index !== -1 && comments[index].username === username) {
    comments.splice(index, 1);
    fs.writeFileSync('./data.json', JSON.stringify(comments));
    res.send('Delete comment successfully');
  }
});
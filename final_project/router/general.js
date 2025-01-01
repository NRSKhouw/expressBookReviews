const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const promise = new Promise ((resolve, reject) => {
    setTimeout(() => resolve(books), 6000);
  });

  promise.then((books) => {
    return res.send(JSON.stringify({books}, null, 4))
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const promise = new Promise ((resolve, reject) => {
    setTimeout(() => resolve(books[isbn]), 1200);
  });

  promise.then((books) => {
    res.send(JSON.stringify(books, null, 4))
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let booksbyauthor = Object.values(books).filter(book => book.author === author)
  const promise = new Promise ((resolve, reject) => {
    setTimeout(() => resolve(booksbyauthor), 1200);
  });

  promise.then((books) => {
    res.send(JSON.stringify(books, null, 4))
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let booksbytitle = Object.values(books).filter(book => book.title === title)
  const promise = new Promise ((resolve, reject) => {
    setTimeout(() => resolve(booksbytitle), 1200);
  });

  promise.then((books) => {
    res.send(JSON.stringify(books, null, 4))
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let bookreview = books[isbn].review
  res.send(JSON.stringify({bookreview}, null, 4))
});

module.exports.general = public_users;

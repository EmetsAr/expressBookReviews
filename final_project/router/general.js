const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ 'username': username, 'password': password })
      return res.send("User registered with success");
    } else {
      return res.send("User already exist");
    }
  }
  return res.send('Unable to register, check username/password one more time')
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const bookIsbn = req.params.isbn;
  return res.send(books[bookIsbn] ? books[bookIsbn] : 'no such book');
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let bookWithAuthor = [];
  for (const bookId in books) {
    if (books[bookId].author.toLowerCase() === author.toLowerCase()) {
      bookWithAuthor.push(books[bookId]);
    }
  }

  return res.send(bookWithAuthor.length ? bookWithAuthor : 'no such book')
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let bookWithTitle = [];
  for (const bookId in books) {
    if (books[bookId].title.toLowerCase() === title.toLowerCase()) {
      bookWithTitle.push(books[bookId]);
    }
  }

  return res.send(bookWithTitle.length ? bookWithTitle : 'no such book')
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let title = req.params.isbn;
  return res.send(books[title] ? books[title].reviews : 'no such book');
});


function getAllBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  })
}
function getBookByISBN(isbnid) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbnid];
      if (!book) {
        reject("Book with this isbn not found");
      }
      resolve(book);
    }, 500);
  });
}

function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const targetBook = [];
      for (const key in books) {
        if (books[key].author === author) {
          targetBook.push(books[key]);
        }
      }
      if (targetBook.length === 0) {
        reject("Book with such author is not found");
      }
      resolve(targetBook);
    }, 500);
  });
}

function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const targetBook = [];
      for (const key in books) {
        if (books[key].title === title) {
          targetBook.push(books[key]);
        }
      }
      if (targetBook.length === 0) {
        reject("Book with such title is not found");
      }
      resolve(targetBook);
    }, 500);
  });
}
module.exports.general = public_users;

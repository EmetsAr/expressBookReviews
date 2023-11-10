const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.filter(singleUser => singleUser.username === username).length ? true : false;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.filter(singleUser => (singleUser.username === username && singleUser.password === password)).length ? true : false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error during logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(208).json({ message: "Wrong Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username

  const isbn = req.params.isbn;
  let target_book = books[isbn]
  if (target_book) {
    let review = req.query.review;
    if (review) {
      target_book['reviews'][username] = review;
      books[isbn] = target_book;
    }
    res.send(`The review for the book with ISBN  ${isbn} has been added/updated. `);
  } else {
    res.send("Unable to find this ISBN!");
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //*Write your code here

  const isbn = req.params.isbn
  const username = req.session.authorization.username
  if (books[isbn]) {
    let target_book = books[isbn]
    delete target_book.reviews[username]
    return res.status(200).send('Review successfully deleted')
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` })
  }
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

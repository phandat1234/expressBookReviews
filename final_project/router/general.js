const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// --- TASK 10: Lấy toàn bộ sách sử dụng Promise ---
public_users.get('/', function (req, res) {
  const getAllBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Không tìm thấy dữ liệu sách");
    }
  });

  getAllBooks
    .then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)))
    .catch((err) => res.status(500).json({ message: err }));
});

// --- TASK 11: Tìm sách theo ISBN sử dụng Promise ---
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Không tìm thấy sách với mã ISBN này");
    }
  });

  getBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});
  
// --- TASK 12: Tìm sách theo Tác giả sử dụng Async/Await ---
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const bookList = await new Promise((resolve, reject) => {
      let filtered_books = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          filtered_books.push(books[key]);
        }
      });
      if (filtered_books.length > 0) resolve(filtered_books);
      else reject("Không tìm thấy sách của tác giả này");
    });
    
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// --- TASK 13: Tìm sách theo Tiêu đề sử dụng Async/Await ---
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const bookList = await new Promise((resolve, reject) => {
      let filtered_books = [];
      Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          filtered_books.push(books[key]);
        }
      });
      if (filtered_books.length > 0) resolve(filtered_books);
      else reject("Không tìm thấy sách với tiêu đề này");
    });

    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

module.exports = {
  general: public_users
};

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

// Đăng nhập người dùng đã đăng ký
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Lỗi khi đăng nhập"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send({message: "User successfully logged in", token: accessToken});
  } else {
    return res.status(281).json({message: "Invalid Login. Check username and password"});
  }
});

// Thêm hoặc sửa một đánh giá sách
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.data; // Lấy tên user từ middleware xác thực token

  if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: `The review for the book with ISBN ${isbn} has been added/updated.`, reviews: books[isbn].reviews});
  } else {
      return res.status(404).json({message: "Không tìm thấy sách"});
  }
});

// Xóa một đánh giá sách
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;

  if (books[isbn]) {
      if (books[isbn].reviews[username]) {
          delete books[isbn].reviews[username];
          return res.status(200).json({message: `Review for ISBN ${isbn} by user ${username} deleted.`});
      } else {
          return res.status(404).json({message: "Bạn chưa có đánh giá nào cho cuốn sách này để xóa"});
      }
  } else {
      return res.status(404).json({message: "Không tìm thấy sách"});
  }
});

module.exports = {
  authenticated: regd_users,
  isValid: isValid,
  users: users
};

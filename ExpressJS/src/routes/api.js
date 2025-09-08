// src/routes/api.js
const express = require("express");

// Controllers
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const {
  getCategories,
  getProductsPaged,
  getProductsCursor,
} = require("../controllers/productController");

// Middlewares
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

const routerAPI = express.Router();

/* ---------- Public routes (no JWT required) ---------- */
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

// Auth
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Password reset (stateless)
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/reset-password", resetPassword);

// Catalog & Products
routerAPI.get("/categories", getCategories);
routerAPI.get("/products", getProductsPaged); // ?categoryId=&page=&limit=
/* ---------- Protected routes (JWT required) ---------- */
routerAPI.use(auth);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI;

"use strict";
//Server settings and start point
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");   
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const categoryRoutes = require("./routes/categories.js");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  
}));

app.use(bodyParser.json());

 app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,  
  saveUninitialized: false,  
  cookie: {
    secure: false,  
    httpOnly: true,  
    maxAge: 1000 * 60 * 60 * 24  // 24-hour
  }
}));

// Routes
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);
app.use("/categories", categoryRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

"use strict";
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(username, hashedPassword);
    req.session.user = { id: newUser.id, username: newUser.username };
    res.status(201).json({
      message: "Registration successful",
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

     req.session.user = { id: user.id, username: user.username };

    res.status(200).json({  
      message: "Login successful",
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error:", details: err.message });
  }
};
exports.logout = (req, res) => 
  {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};

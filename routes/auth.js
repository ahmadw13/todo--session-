"use strict";
//authentication routes
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);

router.get("/user", (req, res) => {
    if (req.session.user) {   
      res.json({ username: req.session.user.username });   
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
  

module.exports = router;

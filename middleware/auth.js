"use strict";

const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  req.user = {
    id: req.session.user.id,       
    username: req.session.user.username,  
  };

  next(); 
};

module.exports = authMiddleware;

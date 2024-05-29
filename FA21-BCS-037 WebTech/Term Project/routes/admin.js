const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  console.log(req.sessionID);
  const { email, password } = req.body;
  if (email && password) {
    if (req.session.authenticated) {
      console.log(req.sessionID);
    }
  }
  res.send(200);
});

module.exports = router;

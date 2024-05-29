const express = require("express");
const bcrypt = require("bcryptjs");
// const session = require("express-session")
const User = require("./models/user");
const router = express.Router();

router.post("/signup", async (req, res) => {
  let user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  res.redirect("/login");
});

module.exports=router;

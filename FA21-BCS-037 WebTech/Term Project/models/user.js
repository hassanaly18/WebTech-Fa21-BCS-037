const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    wishlist: [{}],
  },
  { timestamps: true }
);

let User = mongoose.model("User", userSchema);

module.exports = User;
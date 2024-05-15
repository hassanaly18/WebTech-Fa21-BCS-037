const express = require("express");

const booksRoute = require("./routes/books");

const app = express();

app.use("/books", booksRoute);
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen("3000");

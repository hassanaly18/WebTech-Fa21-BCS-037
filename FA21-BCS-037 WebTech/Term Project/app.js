const express = require("express");
const session = require("express-session")
const mongoose = require("mongoose");
const path = require('path');
const bcrypt = require("bcryptjs");
const productRoutes = require('./routes/products');
const User = require("./models/user");
const Product = require("./models/product");
const { appendFile } = require("fs");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Ensure this line is correct

app.use(
  session({
      secret: "My Secret Key",
      resave: false, // Add resave option to prevent session being saved on every request
      saveUninitialized: false, // Add saveUninitialized option to save new sessions
      cookie: {
          maxAge: 30000 // Set the maxAge for the session cookie
      }
  })
);

// DB Connection
mongoose.connect("mongodb://localhost:27017/termProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch((error) => console.log("MongoDB Error: " + error));

// Setting EJS as the view engine
app.set("view engine", "ejs");

// Routes
app.use('/products', productRoutes);
// app.use('/auth', );
// app.get("/products/addNewProduct", (req, res) => {
//   res.render("contactus", productRoutes);
// });

app.post("/signup", async (req, res) => {
  let user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  res.redirect("/login");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contactUs", (req, res) => {
  res.render("contactus");
});

app.get("/cart", (req, res) => {
  res.render("mycart");
});

app.get("/login", (req, res) => {
  res.render("logsign");
});

app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.redirect("/login");
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.redirect("/auth");
  }
});

app.get("/addNewProduct", (req, res) => {
  res.render("addprodpage");
});

app.get("/allproducts", async (req, res) => {
  const products = await Product.find();
  res.render("viewAllProducts", { products });
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

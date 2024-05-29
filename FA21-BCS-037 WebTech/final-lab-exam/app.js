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
    resave: false, // Prevents session from being saved back to the store if it wasn't modified during the request
    saveUninitialized: false, // Prevents a session that is new but not modified from being saved to the store
    cookie: {
      maxAge: 30 * 60 * 1000 // 30 minutes, ensure this matches your intended duration
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

//Showing description of the clicked featured product
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Initialize the visitedProducts array if it doesn't exist
    if (!req.session.visitedProducts) {
      req.session.visitedProducts = [];
    }

    // Add the product ID to the visitedProducts array if it's not already there
    if (!req.session.visitedProducts.includes(req.params.id)) {
      req.session.visitedProducts.push(req.params.id);
    }

    res.render("details", { product });
  } catch (err) {
    res.status(500).send("Error fetching product details");
  }
});

// Route to display visited products
app.get('/visited-products', async (req, res) => {
  const visitedProductIds = req.session.visitedProducts || [];

  // Fetch product details from the database
  const visitedProducts = await Product.find({ '_id': { $in: visitedProductIds } });

  res.render('visitedProducts', { visitedProducts });
});


app.get('/session-data', (req, res) => {
  const visitedProductIds = req.session.visitedProducts || [];
  res.render('sessiondata', { visitedProductIds });
});


app.post("/signup", async (req, res) => {
  let user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  res.redirect("/login");
});

app.get("/", async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    res.render("index", { featuredProducts });
  } catch (err) {
    res.status(500).send("Error fetching featured products");
  }
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

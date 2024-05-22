const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const productRoutes = require('./routes/products');
const Product = require("./models/product");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Ensure this line is correct

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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contactUs", (req, res) => {
  res.render("contactus");
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

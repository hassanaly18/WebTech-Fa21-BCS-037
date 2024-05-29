const express = require("express");
const multer = require("multer");
const Product = require("../models/product");
const router = express.Router();
const session = require("express-session");
let app = express()

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/media/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    res.json(featuredProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const upload = multer({ storage: storage });

// Create a product
router.post("/addNewProduct", upload.single("image"), async (req, res) => {
  const { title, price, category } = req.body;
  const imageUrl = req.file ? `/media/${req.file.filename}` : "";

  try {
    const product = new Product({ title, price, category, imageUrl });
    await product.save();
    // res.status(201).json(product);
    res.redirect("/products/allproducts");
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
});

//Pagination
router.get("/allproducts/:page?", async (req, res) => {
  let page = parseInt(req.params.page) || 1;
  let pageSize = 3;
  let skip = (page - 1) * pageSize;

  try {
    let total = await Product.countDocuments();
    let totalPages = Math.ceil(total / pageSize);
    let products = await Product.find().limit(pageSize).skip(skip);

    res.render("viewAllProducts", {
      products,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
});

// Show all products (as JSON)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
});

// Get a single product
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch product", error });
//   }
// });

router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

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


// Update a product
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, price, category } = req.body;
  const imageUrl = req.file ? `/media/${req.file.filename}` : "";

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.title = title || product.title;
    product.price = price || product.price;
    product.category = category || product.category;
    if (req.file) {
      product.imageUrl = imageUrl;
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
});

// Delete a product
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
});

router.get("/:id/add-to-cart", async (req, res) => {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  let id = req.params.id;
  let quantity = 1;
  let found = false;
  try {
    let product = await Product.findById(id);
    if (!product) {
      res.redirect("/");
    }

    cart.forEach((item) => {
      if (item.id == product.id) {
        item.quantity += 1;
        found = true;
      }
    });

    if (!found) {
      cart.push({
        id: id,
        quantity: quantity,
      });
    }
    res.cookie("cart", cart);
    res.send("Added Succesfully");
  } catch {
    res.redirect("/");
  }
});

// Sample route to render a page with the cart
// Sample route to render a page with the cart
router.get('/cart', async (req, res) => {
    let cart = req.cookies.cart || [];
    let cartDetails = [];

    try {
        for (let item of cart) {
            let product = await Product.findById(item.id);
            if (product) {
                cartDetails.push({ product, quantity: item.quantity });
            }
        }
        res.render('cart', { cart: cartDetails });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load cart', error });
    }
});

// app.use(
//     session({
//         secret: "My Secret Key",
//         resave: false, // Add resave option to prevent session being saved on every request
//         saveUninitialized: false, // Add saveUninitialized option to save new sessions
//         cookie: {
//             maxAge: 30000 // Set the maxAge for the session cookie
//         }
//     })
// );

// app.post("/login", (req,res)=>{
//     console.log(req.sessionID)
//     const {email, password}=req.body
//     if(email && password){
//         if(req.session.authenticated){
//             console.log(req.sessionID)
//         }
//     }
//     res.send(200)
// })



module.exports = router;

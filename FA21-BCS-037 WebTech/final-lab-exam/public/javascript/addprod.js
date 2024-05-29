const express = require("express");
const mongoose = require("mongoose");

document
  .getElementById("productForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    var title = document.getElementById("title").value;
    var price = document.getElementById("price").value;
    var files = document.getElementById("file").files;

    // Store form values in variables
    var images = [];
    for (var i = 0; i < files.length; i++) {
      images.push(files[i]);
    }

    // Create product object
    var product = {
      title: title,
      price: price,
      images: images,
    };

    // Log the values to the console (for demonstration purposes)
    console.log("Title:", title);
    console.log("Price:", price);
    console.log("Images:", images);

    // You can now use the title, price, and images variables as needed
  });

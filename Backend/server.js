const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./Models/product");
require("dotenv").config();
const { DB_URI } = process.env;

//MiddleWare
server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));

mongoose
  .connect(DB_URI)
  .then((res) => {
    server.listen(port, () => {
      console.log(`DB connected\nServer is listening on ${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

server.get("/", (request, response) => {
  response.send("LIVE!");
});

server.get("/products", async (request, response) => {
  try {
    await Product.find().then((result) => response.status(200).send(result));
  } catch (error) {
    console.log(error.message);
  }
});

server.post("/products", async (request, response) => {
  const { productName, brand, image, price } = request.body;
  const newProduct = new Product({ productName, brand, image, price });
  try {
    await newProduct.save();
    response.status(201).json(newProduct);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

// DELETE product
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  const productId = new mongoose.Types.ObjectId(id);
  try {
    await Product.findByIdAndDelete(productId);
    response.status(200).json({ message: "Product Deleted" });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});

// PATCH (update) product
server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { productName, brand, image, price } = request.body;
  const productId = new mongoose.Types.ObjectId(id);
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { productName, brand, image, price },
      { new: true } // Returns the updated product
    );
    if (updatedProduct) {
      response.status(200).json({ message: "Product updated", updatedProduct });
    } else {
      response.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

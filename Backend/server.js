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

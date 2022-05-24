const database = require("./database");
const joi = require("joi");
const fs = require("fs");
const path = require("path");

module.exports = {
  addProduct: async function (req, res, next) {
    const reqBody = req.body;

    const schema = joi.object({
      name: joi.string().required().min(2).max(100),
      description: joi.string().required().min(2).max(300),
      price: joi.number().required(),
    });

    const { error, value } = schema.validate(reqBody);

    if (error) {
      res.send(`error adding product: ${error}`);
      return;
    }

    const sql =
      "INSERT INTO products(name, description, price)" + " VALUES(?,?,?);";

    try {
      const result = await database.query(sql, [
        reqBody.name,
        reqBody.description,
        reqBody.price,
      ]);
    } catch (err) {
      console.log(err);
      return;
    }

    res.send(`${reqBody.name} added successfully`);
  },

  productsList: async function (req, res, next) {
    const sql = "SELECT * FROM products ORDER BY name ASC;";

    try {
      const result = await database.query(sql);
      res.send(result[0]);
    } catch (err) {
      console.log(err);
    }
  },

  // todo: search product by name
  exportProducts: async function (req, res, next) {
    const sql =
      "SELECT name,description,price FROM products ORDER BY name ASC;";

    try {
      const result = await database.query(sql);

      const now = new Date().getTime(); // moment.js
      const filePath = path.join(__dirname, "../files", `products-${now}.txt`);
      const stream = fs.createWriteStream(filePath);

      stream.on("open", function () {
        stream.write(JSON.stringify(result[0]));
        stream.end();
      });

      stream.on("finish", function () {
        res.send(`Success. File at: ${filePath}`);
      });
    } catch (err) {
      throw err;
    }
  },

  // todo: edit product details
  editProduct: async function (req, res, next) {
    // const sql = UPDATE
    res.send("todo update products");
  },

  // todo: delete product
  deleteProduct: async function (req, res, next) {
    // const sql = DROP
    res.send("todo delete products");
  },

  // todo: search product by name
  searchProducts: async function (req, res, next) {
    // const sql = SELECT WHERE...
    res.send("todo search products");
  },

  // todo: sort products by name...
};

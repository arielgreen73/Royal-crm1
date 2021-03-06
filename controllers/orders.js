const database = require("./database");
const joi = require("joi");
const fs = require("fs");
const path = require("path");

module.exports = {
  //  addOrder: function() {
  //     const name = process.argv.slice(2);

  //     if (!name || name.length === 0) {
  //         throw ('ERROR: name is empty');
  //     }

  //     this.orders.push({
  //         name: name,
  //         id: this.orders.length,
  //     });
  // },

  ordersList: async function (req, res, next) {
    const sql =
      "SELECT orders.id, orders.order_time, orders.price, orders.quantity, " +
      "orders.product_name, orders.product_desc, orders.product_image, cust.id AS customer_id, " +
      "cust.name, cust.phone, cust.email FROM orders orders LEFT JOIN customers cust " +
      "ON orders.id = cust.id ORDER BY orders.id ASC;";

    try {
      const result = await database.query(sql);
      res.send(result[0]);
    } catch (err) {
      console.log(err);
    }
  },

  exportOrders: async function (req, res, next) {
    const sql =
      "SELECT orders.order_time, orders.price, orders.quantity, " +
      "orders.product_name, orders.product_desc, orders.product_image, " +
      "cust.name, cust.phone, cust.email FROM orders orders LEFT JOIN customers cust " +
      "ON orders.id = cust.id ORDER BY orders.id ASC;";

    try {
      const result = await database.query(sql);

      const now = new Date().getTime(); // moment.js
      const filePath = path.join(__dirname, "../files", `orders-${now}.txt`);
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
};

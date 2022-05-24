const database = require("./database");

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
      "SELECT id, order_time,order_time,price,order.quantity, order.product_name, order.product_desc,order.product_image, " +
      "order.product_name, order.product_desc, order.product_image, " +
      "cust.id AS customer_id, cust.name, cust.phone, cust.email FROM order" +
      "cust";

    try {
      // const connection = await database.getConnection();
      const result = await database.query(sql);
      res.send(result[0]);
    } catch (err) {
      console.log(err);
    }
  },
};

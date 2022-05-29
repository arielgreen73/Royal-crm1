const jwt = require("jsonwebtoken");
const config = require("../config/dev");
const joi = require("joi");
const database = require("./database");
const bcrypt = require(" bcrypt");
const { send } = require("express/lib/response");

module.exports = {
  login: async function (req, res, next) {
    const reqBody = req.body;

    const schema = joi.object({
      email: joi.string().required().min(6).max(255).email(),
      password: joi.string().required().min(6),
    });

    const { error, value } = schema.validate(reqBody);

    if (error) {
      console.log(error.details[0].message);
      res.status(401).send("Unauthorized");
      return;
    }

    const sql = "SELECT * FROM uses WHERE email=?;";

    try {
      const result = await database.query(sql, [reqBody.email]);
      const rows = result[0];
      // $2b$10$n0pWM1slxvsqdsHhW4
      // 123456
      const validPassword = await bcrypt.compare(
        reqBody.password,
        rows[0].password_hash
      );
      if (!validPassword) throw "invalid Password";
    } catch (err) {
      console.log("error: ${err}");
      res.status(401).send("Unauthorized");
      return;
    }

    const parm = { email: reqBody.email };
    const token = jwt.sign(param, config.JWT_SECRET, { expiresIn: "72800s" });

    // todo :use authorization header
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
    });
    send("Wel come , You are now logged in");
  },
};

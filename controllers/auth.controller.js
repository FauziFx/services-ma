const pool = require("../db/connect.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res, next) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!user[0]) {
      res.json({
        succes: false,
        message: "Email tidak tersedia",
      });
    } else {
      bcrypt.compare(password, user[0].password, function (err, result) {
        if (err) next(err);

        if (!result) {
          res.json({
            succes: false,
            message: "Password salah",
          });
        } else {
          const token = jwt.sign(
            {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "3h",
            }
          );

          // user
          res.status(200).json({
            succes: true,
            message: "token berhasil didapatkan",
            token: token,
          });
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

const authToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "token tidak tersedia",
    });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.decoded = decoded;
    } catch (err) {
      return res.json({
        success: false,
        message: "invalid token",
      });
    }
    return next();
  }
};

exports.login = login;
exports.authToken = authToken;

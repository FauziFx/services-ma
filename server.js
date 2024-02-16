const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./router/router.js");
const errorHandlers = require("./middlewares/errorHandler.js");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:3000", // for vite application
  optionsSuccessStatus: 200,
};

// Middlewares
// app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.use("/api", router);

app.use(errorHandlers);

app.listen(port, () =>
  console.log("Server running at http://localhost:" + port)
);

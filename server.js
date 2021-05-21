const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgen = require("morgan");
const dotenv = require("dotenv");
const api = require("./auth/api");
const moment = require("./moment/moment");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/public", express.static("public"));
app.use(morgen("tiny"));
app.use("/auth", api);
app.use("/moment", moment);

app.use((err, req, res) => {
  res.status(400).send({ message: "something went wrong" });
});

app.listen(PORT, () => {
  console.log("server is lisning on localhost:4000");
});

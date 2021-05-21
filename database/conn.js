const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/nodejs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connect sucessfully...");
  })
  .catch(() => {
    console.log("database not connect");
  });

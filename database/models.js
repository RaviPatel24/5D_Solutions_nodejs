const mongoose = require("mongoose");
require("./conn");
const signUp = mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    mobileNo: {
      type: Number,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
const moment = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    tags: Array,
    image: String,
  },
  { timestamps: true }
);

User = new mongoose.model("User", signUp);
Moment = new mongoose.model("Moment", moment);

module.exports = { User, Moment };

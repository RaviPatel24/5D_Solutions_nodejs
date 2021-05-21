const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../database/models");
const router = express.Router();

const login = async (req, res) => {
  try {
    const details = req.body;
    const getUser = await User.findOne({ email: details.email });
    if (!getUser) {
      return res.status(400).send({ message: "user not found" });
    }
    const password = await bcrypt.compare(details.password, getUser.password);
    if (password) {
      const token = await jwt.sign({ id: getUser._id }, "privateKey", {
        expiresIn: "5h",
      });
      sendData = {
        email: getUser.email,
        token: token,
      };

      // const decoded = jwt.verify(
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTY2MjhhNmIxMDM4NDkxMDZlYzMyNyIsImlhdCI6MTYyMDY0Mzg1N30.DO1VToerohMdnpDcDBLZ-cXraSjsQjrgCy5gSBJwIEQ",
      //   "privateKey"
      // );
      // console.log(decoded);
      return res.status(200).send(sendData);
    }
    res.send({ message: "cradincials is wrong" });
  } catch (error) {
    res.status(400).end({ message: "somthing went wrong" });
  }
};

const signup = async (req, res) => {
  try {
    userdata = req.body;
    const getUser = await User.findOne({ email: userdata.email });
    if (getUser) {
      throw (error = { message: "user already register" });
    }

    const hashPassword = await bcrypt.hash(userdata.password, 12);
    user = {
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      email: userdata.email,
      mobileNo: userdata.mobileNo,
      city: userdata.city,
      password: hashPassword,
    };

    const saveUser = new User(user);
    const response = await saveUser.save();
    const token = await jwt.sign({ id: response._id }, "privateKey", {
      expiresIn: "5h",
    });
    res.status(200).send({ message: "sucess", token });
  } catch (error) {
    if (error) {
      return res.send(error);
    }
    res.status(400).send({ message: "register unsucessfull" });
  }
};

// router.get("/users", users);
router.post("/login", login);
router.post("/signup", signup);

module.exports = router;

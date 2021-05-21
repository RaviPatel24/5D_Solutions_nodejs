const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const uuidv4 = require("uuid/v4");
const router = express.Router();
const { Moment } = require("../database/models");
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.post("/add-moment", upload.single("image"), (req, res, next) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const moment = new Moment({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      tags: req.body.tags,
      image: url + "/public/" + req.file.filename,
    });
    moment
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Moment saved successfully!",
        });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            message: "something went wrong,moment not store",
          });
      });
  } catch (error) {
    if (error) {
      return res.send(error);
    }
    res.status(400).send({ message: "someting went wrong" });
  }
});

router.put(
  "/update-moment/:id",
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.params.id) {
        throw (error = { message: "id not define" });
      }
      const result = await Moment.findById(req.params.id);
      if (!result) {
        throw (error = { message: "Data not found" });
      }
      const url = req.protocol + "://" + req.get("host");
      const updated = {
        title: req.body.title,
        tags: req.body.tags,
        image: url + "/public/" + req.file.filename,
      };
      const path = result.image.split("/");
      fs.unlinkSync(path[path.length - 2] + "/" + path[path.length - 1]);
      const del = await Moment.findByIdAndUpdate(req.params.id, updated);
      res.status(201).json({ message: "moment update sucessfull" });
    } catch (error) {
      if (error != {}) {
        return res.send(error);
      }
      res.status(400).send({ message: "someting went wrong" });
    }
  }
);

router.delete("/delete-moment/:id", async (req, res, next) => {
  try {
    console.log(req.params.id);
    if (!req.params.id) {
      throw (error = { message: "id not define" });
    }
    const result = await Moment.findById(req.params.id);
    if (!result) {
      throw (error = { message: "Data not found" });
    }
    const path = result.image.split("/");
    const del = await Moment.findByIdAndDelete(req.params.id);
    fs.unlinkSync(path[path.length - 2] + "/" + path[path.length - 1]);
    res.json({ message: "moment delete sucessfull" });
  } catch (error) {
    if (error != {}) {
      return res.send(error);
    }
    res.send({ message: "someting went wrong" });
  }
});

router.get("/", async (req, res, next) => {
  try {
    getAllMoment = await Moment.find().select("-createdAt -updatedAt");

    res.status(200).send(getAllMoment);
  } catch (error) {
    if (error) {
      return res.send(error);
    }
    res.status(400).send({ message: "someting went wrong" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    getMoment = await Moment.findById(id).select("-createdAt -updatedAt");
    console.log(getMoment);
    res.status(200).send(getMoment);
  } catch (error) {
    if (error) {
      return res.send(error);
    }
    res.status(400).send({ message: "someting went wrong" });
  }
});

module.exports = router;

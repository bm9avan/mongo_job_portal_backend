const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const jobs = require("./Jobs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname + "/html")));

mongoose.connect(process.env.MONGO_URI);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.get("/get", (req, res) => {
  jobs.find({}).then((j) => {
    return res.json(j);
  });
});

app.post("/post", (req, res) => {
  jobs.create(req.body);
  return res.json({ sucess: "job added sucessfuly" });
});

app.get("/get/:q", (req, res) => {
  const q = req.params.q;
  jobs
    .aggregate([
      {
        $search: {
          index: "jobIndex",
          text: {
            query: q,
            path: ["profile", "desc", "techs"],
          },
        },
      },
      {
        $sort: {
          field1: 1,
        },
      },
    ])
    .then((j) => {
      return res.json(j);
    });
});

app.listen(8080, (err) => {
  console.log("running on 8080");
});

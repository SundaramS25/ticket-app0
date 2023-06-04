const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
let alert = require("alert");
//const admincollection = require("./admindb");
const mongodb = require("./mongodb");
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, "../templates");
app.set("view engine", "hbs");
app.set("views", templatePath);

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/adsignup", (req, res) => {
  res.render("adsignup");
});

app.get("/adlogin", (req, res) => {
  res.render("adlogin");
});

app.get("/", (req, res) => {
  res.render("lobby");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
  };

  await mongodb.usercollection.insertMany([data]);
  res.render("home");
});

app.post("/adsignup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
  };

  await mongodb.admincollection.insertMany([data]);
  res.render("home");
});

app.post("/home", async (req, res) => {
  var data = await mongodb.flightcollection.find();
  try {
    const check = await mongodb.usercollection.findOne({ name: req.body.name });
    if (check.password === req.body.password) {
      res.render("home", { flightData: data });
    } else {
      alert("wrong password");
    }
  } catch {
    alert("wrong details");
  }
});

app.post("/adhome", async (req, res) => {
  var data = await mongodb.flightcollection.find();
  try {
    const check = await mongodb.admincollection.findOne({
      name: req.body.name,
    });
    if (check.password === req.body.password) {
      res.render("adhome", { flightData: data });
    } else {
      alert("wrong password");
    }
  } catch {
    alert("wrong details");
  }
});

app.get("/modFlight", (req, res) => {
  res.render("modflight");
});

app.post("/modFlight", async (req, res) => {
  const data = {
    name: req.body.name,
    date: req.body.date,
    time: req.body.time,
    number: req.body.number,
    from: req.body.from,
    to: req.body.to,
    seats: req.body.seats,
  };
  try {
    const check = await mongodb.flightcollection.findOne({
      number: req.body.number,
    });
    if (check != null) {
      await mongodb.flightcollection.updateOne(
        { number: req.body.number },
        { $set: data }
      );
    } else {
      await mongodb.flightcollection.insertMany([data]);
    }
  } catch {}
  var data1 = await mongodb.flightcollection.find();
  res.render("adhome", { flightData: data1 });
});

app.get("/logout", (req, res) => {
  res.render("lobby");
});

app.post("/searchFlight", async (req, res) => {
  if (req.body.from == "" || req.body.to == "")
    alert("fill locations for search");
  else {
    var data = await mongodb.flightcollection.find({
      from: req.body.from,
      to: req.body.to,
      seats: { $gt: 0 },
    });
    res.render("home", { flightData: data });
  }
});

app.get("/showAll", async (req, res) => {
  var data = await mongodb.flightcollection.find();
  res.render("home", { flightData: data });
});

app.post("/bookTicket", async (req, res) => {
  const data = {
    name: req.body.name,
    date: req.body.date,
    time: req.body.time,
    number: req.body.number,
    from: req.body.from,
    to: req.body.to,
    seats: req.body.seats,
  };
  res.render("booktick", { flightData: data });
});

app.post("bookTickets", async (req, res) => {});

app.listen(3000);

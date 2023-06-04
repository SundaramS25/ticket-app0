const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
let alert = require("alert");
const popup = require("node-popup/dist/cjs.js");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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
    email: req.body.email,
  };
  await mongodb.usercollection.insertMany([data]);
  res.cookie("username", req.body.name);
  res.cookie("email", req.body.email);
  var data1 = await mongodb.flightcollection.find();
  res.render("home", { flightData: data1 });
});

app.post("/adsignup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  };
  await mongodb.admincollection.insertMany([data]);
  var data1 = await mongodb.flightcollection.find();
  res.cookie("username", req.body.name);
  res.cookie("email", req.body.email);
  res.render("adhome", { flightData: data1 });
});

app.post("/home", async (req, res) => {
  var data = await mongodb.flightcollection.find();
  try {
    const check = await mongodb.usercollection.findOne({ name: req.body.name });
    if (check.password === req.body.password) {
      res.cookie("username", req.body.name);
      res.cookie("email", check.email);
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
      res.cookie("username", req.body.name);
      res.cookie("email", check.email);
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
    number: Number.parseInt(req.body.number),
    from: req.body.from,
    to: req.body.to,
    seats: req.body.seats,
  };
  try {
    const check = await mongodb.flightcollection.findOne({
      number: Number.parseInt(req.body.number),
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
  res.render("adhome", { flightData: data1 }, { userData: dat });
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
  console.log(req.body);

  res.render("booktick", { flightData: data });
});

app.post("/bookTickets", async (req, res) => {
  if (req.body.seats < req.body.nooftick) {
    console.log("sorry");
  } else {
    try {
      await mongodb.flightcollection.updateOne(
        { number: req.body.number },
        { $set: { seats: Number.parseInt(req.body.seats - req.body.nooftick) } }
      );
      var data = {
        flight: req.body.name,
        flight_id: req.body.number,
        date: req.body.date,
        time: req.body.time,
        ticketcount: req.body.nooftick,
        email: req.cookies.email,
        passenger: req.cookies.username,
      };
      await mongodb.bookingcollection.insertMany([data]);
    } catch {
      console.log("some error");
    }
  }
  var data = await mongodb.flightcollection.find();
  res.render("home", { flightData: data });
});

app.get("/booking", async (req, res) => {
  var data = await mongodb.bookingcollection.find({ email: req.cookies.email });
  res.render("booking", { bookingData: data });
});

app.get("/adbooking", async (req, res) => {
  var data = await mongodb.bookingcollection.find();
  res.render("booking", { bookingData: data });
});

app.get("/home", async (req, res) => {
  var data = await mongodb.flightcollection.find();
  res.render("home", { flightData: data });
});

app.get("/adhome", async (req, res) => {
  var data = await mongodb.flightcollection.find();
  res.render("adhome", { flightData: data });
});

app.post("/delFlight", async (req, res) => {
  await mongodb.flightcollection.deleteOne({
    number: Number.parseInt(req.body.flinum),
  });
  var data = await mongodb.flightcollection.find();
  res.render("adhome", { flightData: data });
});

app.post("/cancel", async (req, res) => {
  await mongodb.bookingcollection.deleteOne({
    flight_id: req.body.number,
    passenger: req.body.pass,
    ticketcount: req.body.count,
  });
  var data = await mongodb.bookingcollection.find();
  res.render("booking", { bookingData: data });
});

app.listen(3000);

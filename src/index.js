const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
app.use(cookieParser());

app.use(express.static("public"));

//const admincollection = require("./admindb");
const mongodb = require("./mongodb");

//mail function
let sendMail = async (to, subject, body) => {
  var nodemailer = require("nodemailer");
  try {
    var data = await mongodb.myDatacollection.findOne();
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
      debug: true,
    });
    var mailOptions = {
      from: "2012014@nec.edu.in",
      to: to,
      subject: subject,
      text: body,
    };

    var info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch {
    console.log("some error");
  }
};

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, "../templates");
app.set("view engine", "hbs");
app.set("views", templatePath);

app.get("/", (req, res) => {
  res.render("lobby");
});

//user login
app.get("/login", (req, res) => {
  res.render("login");
});

//admin login
app.get("/adlogin", (req, res) => {
  res.render("adlogin");
});

//user signup
app.get("/signup", (req, res) => {
  res.render("signup");
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
  var data1 = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
  res.render("home", { flightData: data1 });
});

//admin signup
app.get("/adsignup", (req, res) => {
  res.render("adsignup");
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

//user home
app.post("/home", async (req, res) => {
  var data = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
  try {
    const check = await mongodb.usercollection.findOne({ name: req.body.name });
    if (check.password === req.body.password) {
      res.cookie("username", req.body.name);
      res.cookie("email", check.email);
      res.render("home", { flightData: data });
    } else {
    }
  } catch {}
});

app.get("/home", async (req, res) => {
  var data = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
  res.render("home", { flightData: data });
});

//searching flight
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

//show all flights
app.get("/showAll", async (req, res) => {
  var data = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
  res.render("home", { flightData: data });
});

//book ticket page navigation
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

//booking tickets
app.post("/bookTickets", async (req, res) => {
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
    console.log(data);
    sendMail(
      req.cookies.email,
      "Ticket Confirmation",
      `Sucessfully booked ${req.body.nooftick} tickets.`
    );
  } catch {
    console.log("some error");
  }
  var data = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
  res.render("home", { flightData: data });
});

//admin home
app.post("/adhome", async (req, res) => {
  var data = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
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

app.get("/adhome", async (req, res) => {
  var data = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
  res.render("adhome", { flightData: data });
});

//add/update flights page
app.get("/modFlight", (req, res) => {
  res.render("modflight");
});

//add/update flights
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
  res.render("adhome", { flightData: data1 });
});

//my booking page
app.get("/booking", async (req, res) => {
  var data = await mongodb.bookingcollection.find({ email: req.cookies.email });
  res.render("booking", { bookingData: data });
});

//all booking page
app.get("/adbooking", async (req, res) => {
  var data = await mongodb.bookingcollection.find();
  res.render("adbooking", { bookingData: data });
});

//admin delete flight
app.post("/delFlight", async (req, res) => {
  await mongodb.flightcollection.deleteOne({
    number: Number.parseInt(req.body.flinum),
  });
  var data = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
  res.render("adhome", { flightData: data });
});

//user cancel booking
app.post("/cancel", async (req, res) => {
  await mongodb.bookingcollection.deleteOne({
    flight_id: req.body.number,
    passenger: req.body.pass,
    ticketcount: req.body.count,
  });
  var data = await mongodb.bookingcollection.find({ seats: { $gt: 0 } });
  var av = await mongodb.flightcollection.findOne({ number: req.body.number });
  await mongodb.flightcollection.updateOne(
    { number: req.body.number },
    {
      $set: {
        seats: Number.parseInt(
          Number.parseInt(av.seats) + Number.parseInt(req.body.count)
        ),
      },
    }
  );
  var data = await mongodb.bookingcollection.find({ email: req.cookies.email });
  res.render("booking", { bookingData: data });
});

//admin cancel booking
app.post("/adcancel", async (req, res) => {
  await mongodb.bookingcollection.deleteOne({
    flight_id: req.body.number,
    passenger: req.body.pass,
    ticketcount: req.body.count,
  });
  var data = await mongodb.bookingcollection.find();
  var av = await mongodb.flightcollection.findOne({ number: req.body.number });
  console.log(av.seats);
  await mongodb.flightcollection.updateOne(
    { number: req.body.number },
    {
      $set: {
        seats: Number.parseInt(
          Number.parseInt(av.seats) + Number.parseInt(req.body.count)
        ),
      },
    }
  );
  var data = await mongodb.bookingcollection.find();
  res.render("adbooking", { bookingData: data });
});

//logout
app.get("/logout", (req, res) => {
  res.render("lobby");
});

//CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//payment page
app.post("/payCash", async (req, res) => {
  if (req.body.seats < req.body.nooftick) {
    alert("You can't book more tickets than the available ones.");
    var data = await mongodb.flightcollection.find({ seats: { $gt: 0 } });
    res.render("home", { flightData: data });
  } else {
    const data = {
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      number: req.body.number,
      from: req.body.from,
      to: req.body.to,
      seats: req.body.seats,
      nooftick: req.body.nooftick,
      amount: req.body.nooftick * 500,
    };
    res.render("payment", { flightData: data });
  }
});

app.listen(3000);

const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const alert = require("alert");
const dotenv = require("dotenv");
dotenv.config();
app.use(cookieParser());

app.use(express.static("public"));

//const admincollection = require("./admindb");
const mongodb = require("./mongodb");
const { mongo } = require("mongoose");

let gmail = async (to, subject, body) => {
  const nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "flyrightbooking@gmail.com",
      pass: "Sankardevi25@",
      clientId:
        "66071059762-c9ehqms7u8m5r6emm5obr0ninjfobv7a.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//04adB4cIBuEt8CgYIARAAGAQSNwF-L9Irmfu9BIkDfbbkr7wXJdjGl-7sz57cr9n-EkCDAezNDeQOh47YAQ2dPaAjZeFECdOFu6c",
    },
  });
  var mailOptions = {
    from: "flyrightbooking@gmail.com",
    to: to,
    subject: subject,
    text: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
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
  var data1 = await mongodb.flightcollection.find({
    date: { $gte: new Date() },
  });
  for (let d of data1) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
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
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.cookie("username", req.body.name);
  res.cookie("email", req.body.email);
  res.render("adhome", { flightData: data1 });
});

//user home
app.post("/home", async (req, res) => {
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  var data = await mongodb.flightcollection.find({
    date: { $gte: new Date() },
  });
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  try {
    const check = await mongodb.usercollection.findOne({
      email: req.body.email,
    });
    if (check.password === req.body.password) {
      res.cookie("username", check.name);
      res.cookie("email", check.email);
      res.render("home", { flightData: data });
    } else {
    }
  } catch {}
});

app.get("/home", async (req, res) => {
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  var data = await mongodb.flightcollection.find({
    date: { $gte: new Date() },
  });
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.render("home", { flightData: data });
});

//searching flight
app.post("/searchFlight", async (req, res) => {
  if (req.body.from == "" || req.body.to == "")
    alert("fill locations for search");
  else {
    var data = await mongodb.flightcollection.find({
      departure: req.body.from,
      arrival: req.body.to,
    });
    for (let d of data) {
      const currentDate = d.date;

      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      d.date.value = `${day}/${month}/${year}`;
    }
    res.render("home", { flightData: data });
  }
});

//show all flights
app.get("/showAll", async (req, res) => {
  var data = await mongodb.flightcollection.find();
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.render("home", { flightData: data });
});

//book ticket page navigation
app.post("/bookTicket", async (req, res) => {
  var data = await mongodb.flightcollection.findOne({
    number: req.body.number,
  });
  res.render("booktick", { flightData: data });
});

//booking tickets
app.post("/bookTickets", async (req, res) => {
  var rec = await mongodb.flightcollection.findOne({ number: req.body.number });
  try {
    let arr = [];
    let st = rec.avseats - req.body.nooftick;

    for (let i = st; i < Number.parseInt(rec.avseats); i++) {
      arr.push(60 - Number.parseInt(i));
    }

    await mongodb.flightcollection.updateOne(
      { number: req.body.number },
      {
        $set: {
          bkseats: Number.parseInt(
            Number.parseInt(rec.bkseats) + Number.parseInt(req.body.nooftick)
          ),
        },
      }
    );
    await mongodb.flightcollection.updateOne(
      { number: req.body.number },
      { $set: { avseats: Number.parseInt(rec.avseats - req.body.nooftick) } }
    );

    var data = {
      flight: rec.flight,
      flight_id: rec.number,
      date: rec.date,
      time: rec.time,
      ticketcount: req.body.nooftick,
      email: req.cookies.email,
      passenger: req.cookies.username,
      seats_no: arr,
      account_no: req.body.accno,
    };
    await mongodb.bookingcollection.insertMany([data]);
    gmail(
      req.cookies.email,
      "Ticket Confirmation",
      `Sucessfully booked ${req.body.nooftick} tickets.`
    );
  } catch (error) {
    console.log("some error" + error);
  }
  var data = await mongodb.flightcollection.find({
    date: { $gte: new Date() },
  });
  req.body.nooftick = 0;
  // res.render("home", { flightData: data });
  res.redirect("/home");
});

//admin home
app.post("/adhome", async (req, res) => {
  var data = await mongodb.flightcollection.find();
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  try {
    const check = await mongodb.admincollection.findOne({
      email: req.body.email,
    });
    if (check.password === req.body.password) {
      res.cookie("username", check.name);
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
  var data = await mongodb.flightcollection.find();
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.render("adhome", { flightData: data });
});

//add/update flights page
app.get("/modFlight", (req, res) => {
  res.render("modflight");
});

//add/update flights
app.post("/modFlight", async (req, res) => {
  const data = {
    flight: req.body.name,
    date: req.body.date,
    time: req.body.time,
    number: Number.parseInt(req.body.number),
    departure: req.body.from,
    arrival: req.body.to,
    avseats: req.body.seats,
    bkseats: 0,
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
  for (let d of data1) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.render("adhome", { flightData: data1 });
});

//my booking page
app.get("/booking", async (req, res) => {
  var data = await mongodb.bookingcollection.find({ email: req.cookies.email });
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.render("booking", { bookingData: data });
});

//all booking page
app.get("/adbooking", async (req, res) => {
  var data = await mongodb.bookingcollection.find();
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.render("adbooking", { bookingData: data });
});

//admin delete confirm
app.post("/delconf", async (req, res) => {
  var rec = await mongodb.flightcollection.findOne({ number: req.body.flinum });
  res.render("delconf", { flightData: rec });
});

//admin delete flight
app.post("/delFlight", async (req, res) => {
  if (req.body.deltext === "REMOVE") {
    var temp_data = await mongodb.bookingcollection.find({
      flight_id: req.body.number,
    });
    temp_data.map((element) => {
      gmail(
        element.email,
        "Ticket cancelation",
        `Sorry for the inconvenience,the tickets you have booked for the flight is being cancelled due to some technical issues.
        The payment will be refunded to the account ${element.account_no} within a day.
        Thank you`
      );
    });
    await mongodb.bookingcollection.deleteMany({ flight_id: req.body.number });
    await mongodb.flightcollection.deleteOne({
      number: Number.parseInt(req.body.number),
    });
    alert("deleted flight");
    var data = await mongodb.flightcollection.find();
    for (let d of data) {
      const currentDate = d.date;

      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      d.date.value = `${day}/${month}/${year}`;
    }
    res.render("adhome", { flightData: data });
  } else {
    alert("flight is not removed");
    var data = await mongodb.flightcollection.find();
    for (let d of data) {
      const currentDate = d.date;

      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      d.date.value = `${day}/${month}/${year}`;
    }
    res.render("adhome", { flightData: data });
  }
});

//user booking cancel confirming and cancel
app.post("/canconf", async (req, res) => {
  var rec = await mongodb.flightcollection.findOne({ number: req.body.number });
  var data = {
    flight: rec.flight,
    flight_id: rec.number,
    departure: rec.departure,
    arrival: rec.arrival,
    date: rec.date,
    time: rec.time,
    ticketcount: req.body.count,
  };
  res.render("canconf", { flightData: data });
});

app.post("/cancel", async (req, res) => {
  if (req.body.cantext === "CANCEL") {
    gmail(
      req.cookies.email,
      "Ticket cancelation",
      `the tickets you have booked for the flight is being cancelled as per your request.
      The payment will be refunded to the account within a day after .
      Thank you`
    );
    await mongodb.bookingcollection.deleteOne({
      flight_id: req.body.number,
      passenger: req.cookies.username,
      ticketcount: req.body.nooftick,
    });
    var av = await mongodb.flightcollection.findOne({
      number: req.body.number,
    });
    await mongodb.flightcollection.updateOne(
      { number: req.body.number },
      {
        $set: {
          bkseats: Number.parseInt(
            Number.parseInt(av.bkseats) - Number.parseInt(req.body.nooftick)
          ),
        },
      }
    );
    await mongodb.flightcollection.updateOne(
      { number: req.body.number },
      {
        $set: {
          avseats: Number.parseInt(
            Number.parseInt(av.avseats) + Number.parseInt(req.body.nooftick)
          ),
        },
      }
    );
    var data = await mongodb.bookingcollection.find({
      email: req.cookies.email,
    });
    for (let d of data) {
      const currentDate = d.date;

      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      d.date.value = `${day}/${month}/${year}`;
    }
    res.render("booking", { bookingData: data });
  } else {
    alert("CANCEL not typed correctly,ticket not cancelled");
  }
});

app.post("/adcanconf", async (req, res) => {
  var rec = await mongodb.flightcollection.findOne({ number: req.body.number });
  var data = {
    flight: rec.flight,
    flight_id: rec.number,
    departure: rec.departure,
    arrival: rec.arrival,
    date: rec.date,
    time: rec.time,
    ticketcount: req.body.count,
    passenger: req.body.passenger,
  };
  res.render("adcanconf", { flightData: data });
});

//admin cancel booking
app.post("/adcancel", async (req, res) => {
  if (req.body.cantext === "CANCEL") {
    await mongodb.bookingcollection.deleteOne({
      flight_id: req.body.number,
      passenger: req.body.passenger,
      ticketcount: req.body.nooftick,
    });
    var av = await mongodb.flightcollection.findOne({
      number: req.body.number,
    });
    await mongodb.flightcollection.updateOne(
      { number: req.body.number },
      {
        $set: {
          bkseats: Number.parseInt(
            Number.parseInt(av.bkseats) - Number.parseInt(req.body.nooftick)
          ),
        },
      }
    );
    await mongodb.flightcollection.updateOne(
      { number: req.body.number },
      {
        $set: {
          avseats: Number.parseInt(
            Number.parseInt(av.avseats) + Number.parseInt(req.body.nooftick)
          ),
        },
      }
    );
    var data = await mongodb.bookingcollection.find();
    for (let d of data) {
      const currentDate = d.date;

      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      d.date.value = `${day}/${month}/${year}`;
    }
    res.render("adbooking", { bookingData: data });
  } else {
    alert("CANCEL not typed correctly,ticket not cancelled");
  }
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
  var rec = await mongodb.flightcollection.findOne({ number: req.body.number });

  if (rec.avseats < req.body.nooftick) {
    alert("You can't book more tickets than the available ones.");
    var data = await mongodb.flightcollection.find({
      date: { $gte: new Date() },
    });
    for (let d of data) {
      const currentDate = d.date;

      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      d.date.value = `${day}/${month}/${year}`;
    }
    res.render("home", { flightData: data });
  } else {
    const data = {
      flight: rec.flight,
      date: rec.date,
      time: rec.time,
      number: rec.number,
      departure: rec.departure,
      arrival: rec.arrival,
      seats: rec.seats,
      nooftick: req.body.nooftick,
      amount: req.body.nooftick * 500,
    };
    res.render("payment", { flightData: data });
  }
});

//update flight
app.post("/updflight", async (req, res) => {
  var rec = await mongodb.flightcollection.findOne({ number: req.body.number });
  var formattedDate = `${rec.date.getFullYear()}-${(rec.date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${rec.date.getDate().toString().padStart(2, "0")}`;
  const data = {
    flight: rec.flight,
    date: formattedDate,
    time: rec.time,
    number: rec.number,
    departure: rec.departure,
    arrival: rec.arrival,
    avseats: rec.avseats,
  };
  res.render("updateflight", { flightData: data });
});

app.post("/updateFlight", async (req, res) => {
  const data = {
    flight: req.body.name,
    date: req.body.date,
    time: req.body.time,
    number: Number.parseInt(req.body.number),
    departure: req.body.from,
    arrival: req.body.to,
    avseats: req.body.seats,
    bkseats: 60 - req.body.seats,
  };
  await mongodb.flightcollection.updateOne(
    { number: req.body.number },
    {
      $set: data,
    }
  );
  var temp_data = await mongodb.bookingcollection.find({
    flight_id: req.body.number,
  });
  temp_data.map((element) => {
    gmail(
      element.email,
      "Changes in flight",
      `Sorry for the inconvenience,there is a change in the flight ${element.flight}
      due to some technical issues.please login to the app and verify it.
      Thank you`
    );
  });
  var data1 = await mongodb.flightcollection.find();
  for (let d of data1) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.render("adhome", { flightData: data1 });
});

//logout
app.get("/lobby", (req, res) => {
  res.render("lobby");
});
app.get("/logout", (req, res) => {
  res.redirect("/lobby");
});

app.listen(3000);

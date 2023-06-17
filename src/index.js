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

let gmail1 = async (to, subject, body) => {
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
    html: body,
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
  var otpv = req.body.fdig + req.body.sdig + req.body.tdig + req.body.fodig;
  if (otpv === req.body.otp) {
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
    gmail(
      req.body.email,
      "Fly Right Booking - Sign Up Successful!",
      `Dear ${req.body.name},
      
      Congratulations! Your sign up on our Flight Ticket Booking website was successful. We're thrilled to have you join our community of travel enthusiasts.
      
      At Fly Right Booking, we strive to provide you with the best flight booking experience. From now on, you can explore a wide range of flights and secure your dream destinations with ease.
      
      If you have any questions or need assistance, our friendly support team is always here to help. Simply reach out to us through flyrightbooking@gmail.com.
      
      Thank you for choosing Fly Right Booking. We look forward to assisting you in your future travel plans.
      
      Happy travels!
      
      Best regards,
      Sundaram
      Fly Right Booking`
    );

    res.render("home", { flightData: data1 });
  } else {
    alert("Incorrect OTP");
  }
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
      res.header(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
      );
      res.header("Pragma", "no-cache");
      res.header("Expires", "0");
      res.render("home", { flightData: data });
    } else {
      alert("wrong password");
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
      "Flight Ticket Booking - Booking Confirmation",
      `Dear ${req.cookies.username},
      Congratulations! Your flight ticket booking has been successfully confirmed. Get ready for an amazing travel experience!
      
      If you have any questions or need further assistance regarding your booking, feel free to reach out to our dedicated support team at flyrightbooking@gmail.com.
      
      Thank you for choosing Fly Right Booking for your travel needs. We hope you have a fantastic journey!
      
      Best regards,
      Sundaram
      Fly Right Booking`
    );
  } catch (error) {
    console.log("some error" + error);
  }
  var data = await mongodb.flightcollection.find({
    date: { $gte: new Date() },
  });
  req.body.nooftick = 0;
  // res.render("home", { flightData: data });
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
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
      res.header(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
      );
      res.header("Pragma", "no-cache");
      res.header("Expires", "0");
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
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
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
    if (d.ticketcount != 1) {
      d.seats_no.value = `${d.seats_no[d.ticketcount - 1]}-${d.seats_no[0]}`;
      console.log(d.ticketcount);
    } else {
      d.seats_no.value = `${d.seats_no[0]}`;
    }
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
        "Fly Right Booking - Flight Cancellation & Refund Notification",
        `Dear ${element.passenger},
        We regret to inform you that your flight has been cancelled by our admin due to unforeseen issues. We sincerely apologize for the inconvenience caused.

        Rest assured, a full refund of your booking amount has been initiated and will be processed back to the original payment method used during the booking process. Please allow a few business days for the refund to be reflected in your account.

        If you have any questions or need further assistance regarding the cancellation or refund, please don't hesitate to contact our support team at flyrightbooking@gmail.com.

        We apologize again for any inconvenience caused and appreciate your understanding.

        Best regards,
        Sundaram
        Fly Right Booking`
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
    if (req.body.noofcan == req.body.nooftick) {
      gmail(
        req.cookies.email,
        "Flight Ticket Booking - Cancellation & Refund Confirmation",
        `Dear ${req.cookies.username},
  
        We regret to inform you that your flight ticket had to be cancelled, but we have processed the cancellation and initiated the refund for your booking.
        
        The refund amount will be credited back to the original payment method used during the booking process. Please note that it may take a few business days for the refund to reflect in your account.
        
        If you have any further questions or concerns regarding the refund process or need any assistance, please reach out to our dedicated support team at flyrightbooking@gmail.com.
        
        Thank you for choosing Fly Right Booking. We appreciate your understanding and hope to have the opportunity to serve you better in the future.
        
        Best regards,
        Sundaram
        Fly Right Booking`
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
              Number.parseInt(av.bkseats) - Number.parseInt(req.body.noofcan)
            ),
          },
        }
      );
      await mongodb.flightcollection.updateOne(
        { number: req.body.number },
        {
          $set: {
            avseats: Number.parseInt(
              Number.parseInt(av.avseats) + Number.parseInt(req.body.noofcan)
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
        if (d.ticketcount != 1) {
          d.seats_no.value = `${d.seats_no[d.ticketcount - 1]}-${
            d.seats_no[0]
          }`;
          console.log(d.ticketcount);
        } else {
          d.seats_no.value = `${d.seats_no[0]}`;
        }
      }
      res.render("booking", { bookingData: data });
    } else if (req.body.noofcan < req.body.nooftick) {
      gmail(
        req.cookies.email,
        "Flight Ticket Booking - Cancellation & Refund Confirmation",
        `Dear ${req.cookies.username},
  
        We regret to inform you that your flight ticket had to be cancelled, but we have processed the cancellation and initiated the refund for your booking.
        
        The refund amount will be credited back to the original payment method used during the booking process. Please note that it may take a few business days for the refund to reflect in your account.
        
        If you have any further questions or concerns regarding the refund process or need any assistance, please reach out to our dedicated support team at flyrightbooking@gmail.com.
        
        Thank you for choosing Fly Right Booking. We appreciate your understanding and hope to have the opportunity to serve you better in the future.
        
        Best regards,
        Sundaram
        Fly Right Booking`
      );
      var temp = await mongodb.bookingcollection.findOne({
        flight_id: req.body.number,
        passenger: req.cookies.username,
        ticketcount: req.body.nooftick,
      });
      console.log(temp.seats_no);
      await mongodb.bookingcollection.updateOne(
        {
          flight_id: req.body.number,
          passenger: req.cookies.username,
          ticketcount: req.body.nooftick,
        },
        {
          $set: {
            ticketcount: Number.parseInt(
              Number.parseInt(req.body.nooftick) -
                Number.parseInt(req.body.noofcan)
            ),
            seats_no: temp.seats_no.splice(req.body.noofcan),
          },
        }
      );
      var av = await mongodb.flightcollection.findOne({
        number: req.body.number,
      });
      await mongodb.flightcollection.updateOne(
        { number: req.body.number },
        {
          $set: {
            bkseats: Number.parseInt(
              Number.parseInt(av.bkseats) - Number.parseInt(req.body.noofcan)
            ),
          },
        }
      );
      await mongodb.flightcollection.updateOne(
        { number: req.body.number },
        {
          $set: {
            avseats: Number.parseInt(
              Number.parseInt(av.avseats) + Number.parseInt(req.body.noofcan)
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
        if (d.ticketcount != 1) {
          d.seats_no.value = `${d.seats_no[d.ticketcount - 1]}-${
            d.seats_no[0]
          }`;
          // console.log(d.ticketcount);
        } else {
          d.seats_no.value = `${d.seats_no[0]}`;
        }
      }

      res.render("booking", { bookingData: data });
    } else {
      alert("No of tickets requested for cancel is more than booked tickets.");
    }
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
    email: req.body.email,
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
    gmail(
      req.body.email,
      "Fly Right Booking - Cancellation & Refund Notification",
      `Dear ${req.body.passenger},
      
      We regret to inform you that your flight ticket booking has been cancelled by our admin due to unforeseen issues. We apologize for any inconvenience caused.
      
      Rest assured that a full refund of your booking amount has been initiated. The refund will be processed back to the original payment method used during the booking process. Please note that it may take a few business days for the refund to reflect in your account.
      
      If you have any questions or need further clarification regarding the cancellation or refund process, please contact our support team at flyrightbooking@gmail.com.
      
      Once again, we apologize for any inconvenience caused and appreciate your cooperation. Thank you for your understanding.
      
      Best regards,
      Sundaram
      Fly Right Booking`
    );

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
      "Flight Schedule Update Notification",
      `Dear ${element.name},
      
      We regret to inform you that there have been changes to the timings or other details of your booked flight. Kindly review the updated information to stay informed about your travel arrangements.
      
      If you have any questions or require further assistance regarding the updated flight details, please don't hesitate to reach out to our dedicated support team at flyrightbooking@gmail.com.
      
      We apologize for any inconvenience caused and appreciate your understanding.
      
      Best regards,
      Sundaram
      Fly Right Booking`
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

//otp verify
app.post("/otpverify", (req, res) => {
  const random = Math.floor(Math.random() * 9000 + 1000);
  gmail1(
    req.body.email,
    "Fly Right Booking - OTP Verification",
    `<p>Dear ${req.body.name},</p>
<p>Your One-Time Password (OTP) for email verification is: <strong>${random}</strong>. Please enter this OTP to complete your email verification process.</p>`
  );
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    otp: random,
  };
  res.render("otppage", { flightData: data });
});

app.get("/prevent-back", function (req, res) {
  res.redirect("lobby");
});

app.listen(3000);

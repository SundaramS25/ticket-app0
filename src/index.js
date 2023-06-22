const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const alert = require("alert");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const session = require("express-session");
dotenv.config();
app.use(cookieParser());
const bodyParser = require("body-parser");
const PDFDocument = require("pdf-lib").PDFDocument;
const exphbs = require("express-handlebars");

// Parse application/x-www-form-urlencoded
var oneHour = 1000 * 60 * 60;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "asdfe45we45w345wegw345werjktjwertkj",
    saveUninitialized: true,
    cookie: { maxAge: oneHour },
    resave: false,
  })
);
//bcrypt salt
const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

app.use(express.static("public"));

//const admincollection = require("./admindb");
const mongodb = require("./mongodb");
const { mongo } = require("mongoose");

function findIndexWithConsecutiveZeros(array, n) {
  let count = 0;
  let startIndex = -1;
  n = Number.parseInt(n);
  for (let i = 0; i < array.length; i++) {
    var x = Number.parseInt(array[i]);
    if (x === 0) {
      if (count === 0) {
        startIndex = i;
      }
      count++;
    } else {
      count = 0;
      startIndex = -1;
    }

    if (count === n) {
      return startIndex;
    }
  }

  return -1; // If n consecutive zeros are not found
}

let gmail = async (to, subject, body, pdfBytes) => {
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
    attachments: [
      {
        filename: "document.pdf",
        content: pdfBytes,
        contentType: "application/pdf",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
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
    text: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
    }
  });
};

let gmail2 = async (to, subject, body, pdfBytes) => {
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
      password: bcrypt.hashSync(req.body.password, salt),
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
    gmail1(
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
  const check1 = await mongodb.usercollection.findOne({
    email: req.body.email,
  });
  for (let d of data) {
    const currentDate = d.date;
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  var userData = {
    name: check1.name,
    email: check1.email,
  };
  try {
    const check = await mongodb.usercollection.findOne({
      email: req.body.email,
    });
    if (bcrypt.compareSync(req.body.password, check.password)) {
      res.cookie("username", check.name);
      res.cookie("email", check.email);
      req.session.username = check.name;
      req.session.email = check.email;
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      res.render("home", { flightData: data, userData });
    } else {
      alert("wrong password");
    }
  } catch {
    alert("wrong password");
  }
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
  var userData = {
    name: req.cookies.username,
    email: req.cookies.email,
  };
  for (let d of data) {
    const currentDate = d.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    d.date.value = `${day}/${month}/${year}`;
  }
  res.render("home", { flightData: data, userData: userData });
});

//searching flight
app.post("/searchFlight", async (req, res) => {
  if (req.body.from == "" || req.body.to == "")
    alert("fill locations for search");
  else {
    var data = await mongodb.flightcollection.find({
      departure: req.body.from,
      arrival: req.body.to,
      date: { $gte: new Date() },
    });
    for (let d of data) {
      const currentDate = d.date;

      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      d.date.value = `${day}/${month}/${year}`;
    }
    var userData = {
      name: req.cookies.username,
      email: req.cookies.email,
    };
    res.render("home", { flightData: data, userData: userData });
  }
});

//show all flights
app.get("/showAll", async (req, res) => {
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
  // res.render("home", { flightData: data });
  res.redirect("/home");
});

//book ticket page navigation
app.post("/bookTicket", async (req, res) => {
  var data = await mongodb.flightcollection.findOne({
    number: req.body.number,
  });
  const currentDate = data.date;
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  data.date.value = `${day}/${month}/${year}`;
  res.render("booktick", { flightData: data });
});

//booking tickets
app.post("/bookTickets", async (req, res) => {
  const arr1 = req.body.arr_passengers;
  const arr2 = req.body.arr_ages;

  var rec = await mongodb.flightcollection.findOne({ number: req.body.number });
  try {
    let arr = [];
    let arr3 = [...rec.seats];
    var si = findIndexWithConsecutiveZeros(rec.seats, req.body.nooftick);

    if (si != -1) {
      for (i = si; i < si + Number.parseInt(req.body.nooftick); i++) {
        arr.push(i + 1);
        arr3[i] = 1;
      }
      await mongodb.flightcollection.updateOne(
        { number: req.body.number },
        { $set: { seats: arr3 } }
      );
    } else {
      var co = 0;
      for (i = 0; i < 60; i++) {
        if (rec.seats[i] === 0) {
          arr3[i] = 1;
          arr.push(i + 1);
          co++;
        }
        if (co === req.body.nooftick) {
          break;
        }
      }
      await mongodb.flightcollection.updateOne(
        { number: req.body.number },
        { $set: { seats: arr3 } }
      );
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
      passenger_names: arr1.split(","),
      passenger_ages: arr2.split(","),
    };
    await mongodb.bookingcollection.insertMany([data]);
    const doc = await PDFDocument.create();

    // Add a new page
    var page = doc.addPage();
    const font = await doc.embedFont("Helvetica");
    page.setFont(font);
    page.setFontSize(20);

    // Calculate the coordinates to position the text at the top of the page
    const text = "Fly Right Booking";
    const textWidth = font.widthOfTextAtSize(text, 20);
    const textHeight = font.heightAtSize(20);
    const pageWidth = page.getWidth();

    // Add the text at the top of the page

    const x = 50;
    var y = page.getHeight() - 50;

    // Add the text at the top of the page
    page.drawText(text, { x: x + 170, y });
    page.drawText(`Flight Ticket Booking Successful`, {
      x,
      y: y - 40,
    });
    page.drawText(`Username: ${req.cookies.username}`, {
      x,
      y: y - 60,
    });
    page.drawText(`Flight Number: ${rec.number}`, {
      x,
      y: y - 80,
    });
    page.drawText(`Departure: ${rec.departure}`, { x, y: y - 100 });
    page.drawText(`Destination: ${rec.arrival}`, { x, y: y - 120 });
    page.drawText("All passenger details:", { x, y: y - 140 });
    var te = 160;
    for (i = 0; i < req.body.nooftick; i++) {
      if (y - te <= 0) {
        page = doc.addPage();
        page.setFont(font);
        page.setFontSize(20);
        y = page.getHeight() - 50;
        te = 0;
      }
      page.drawText(`Passenger Name: ${arr1.split(",")[i]}`, {
        x,
        y: y - te,
      });
      te += 20;
      page.drawText(`Passenger Age: ${arr2.split(",")[i]}`, {
        x,
        y: y - te,
      });
      te += 20;
    }
    // Generate the PDF as a buffer
    const pdfBytes = await doc.save();
    gmail(
      req.cookies.email,
      "Flight Ticket Booking - Booking Confirmation",
      `Dear ${req.cookies.username},
      Congratulations! Your flight ticket booking has been successfully confirmed. Get ready for an amazing travel experience!
      
      If you have any questions or need further assistance regarding your booking, feel free to reach out to our dedicated support team at flyrightbooking@gmail.com.
      
      Thank you for choosing Fly Right Booking for your travel needs. We hope you have a fantastic journey!
      
      Best regards,
      Sundaram
      Fly Right Booking`,
      pdfBytes
    );
  } catch (error) {
    console.log("some error" + error);
  }
  var data = await mongodb.flightcollection.find({
    date: { $gte: new Date() },
  });
  req.body.nooftick = 0;
  // res.render("home", { flightData: data });

  res.redirect("/booking");
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
  var arr = [];
  for (i = 0; i < 60; i++) {
    arr.push(0);
  }
  const data = {
    flight: req.body.name,
    date: req.body.date,
    time: req.body.time,
    number: Number.parseInt(req.body.number),
    departure: req.body.from,
    arrival: req.body.to,
    avseats: req.body.seats,
    bkseats: 0,
    seats: arr,
  };
  try {
    const check = await mongodb.flightcollection.findOne({
      number: Number.parseInt(req.body.number),
    });
    if (check != null) {
      alert("flight number already taken.Unique number is needed");
    } else {
      await mongodb.flightcollection.insertMany([data]);
      var data1 = await mongodb.flightcollection.find();
      for (let d of data1) {
        const currentDate = d.date;

        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();
        d.date.value = `${day}/${month}/${year}`;
      }
      res.render("adhome", { flightData: data1 });
    }
  } catch {}
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
    if (d.ticketcount == 1) {
      d.seats_no.value = `${d.seats_no[0]}`;
    } else if (
      d.seats_no[d.ticketcount - 1] - d.seats_no[0] ==
      d.ticketcount - 1
    ) {
      d.seats_no.value = `${d.seats_no[0]}-${d.seats_no[d.ticketcount - 1]}`;
    } else {
      d.seats_no.value = d.seats_no.join(",");
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
  const currentDate = rec.date;

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  rec.date.value = `${day}/${month}/${year}`;
  res.render("delconf", { flightData: rec });
});

//admin delete flight
app.post("/delFlight", async (req, res) => {
  if (req.body.deltext === "REMOVE") {
    var temp_data = await mongodb.bookingcollection.find({
      flight_id: req.body.number,
    });
    temp_data.map((element) => {
      gmail1(
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
  const currentDate = rec.date;
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  rec.date.value = `${day}/${month}/${year}`;
  var data = {
    flight: rec.flight,
    flight_id: rec.number,
    departure: rec.departure,
    arrival: rec.arrival,
    date: rec.date.value,
    time: rec.time,
    ticketcount: req.body.count,
  };
  res.render("canconf", { flightData: data });
});

app.post("/cancel", async (req, res) => {
  if (req.body.cantext === "CANCEL") {
    if (req.body.noofcan == req.body.nooftick) {
      gmail1(
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
      var si = await mongodb.bookingcollection.findOne({
        flight_id: req.body.number,
        passenger: req.cookies.username,
        ticketcount: req.body.nooftick,
      });
      var sii = si.seats_no[0];

      await mongodb.bookingcollection.deleteOne({
        flight_id: req.body.number,
        passenger: req.cookies.username,
        ticketcount: req.body.nooftick,
      });
      var av = await mongodb.flightcollection.findOne({
        number: req.body.number,
      });
      var arrr = [...av.seats];
      for (i = sii - 1; i < sii - 1 + Number.parseInt(req.body.noofcan); i++) {
        arrr[i] = 0;
      }
      await mongodb.flightcollection.updateOne(
        { number: req.body.number },
        { $set: { seats: arrr } }
      );
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
          d.seats_no.value = `${d.seats_no[0]}-${
            d.seats_no[d.ticketcount - 1]
          }`;
        } else {
          d.seats_no.value = `${d.seats_no[0]}`;
        }
      }
      res.render("booking", { bookingData: data });
    } else if (req.body.noofcan < req.body.nooftick) {
      gmail1(
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

      var si = await mongodb.bookingcollection.findOne({
        flight_id: req.body.number,
        passenger: req.cookies.username,
        ticketcount: req.body.nooftick,
      });
      var sii = si.seats_no[0];
      var av = await mongodb.flightcollection.findOne({
        number: req.body.number,
      });
      var arrr = [...av.seats];
      for (i = sii - 1; i < sii - 1 + Number.parseInt(req.body.noofcan); i++) {
        arrr[i] = 0;
      }
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
            seats_no: si.seats_no.splice(req.body.noofcan),
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
            seats: arrr,
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
          d.seats_no.value = `${d.seats_no[0]}-${
            d.seats_no[d.ticketcount - 1]
          }`;
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
  const currentDate = data.date;

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  data.date.value = `${day}/${month}/${year}`;
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
    gmail1(
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
  const formvalues = req.body;
  const keys = Object.keys(formvalues);
  var arr_passengers = [];
  var arr_ages = [];
  keys.forEach((key, index) => {
    if (key === "number" || key === "nooftick") {
    } else {
      if (index % 2 == 0) arr_passengers.push(formvalues[key]);
      else arr_ages.push(formvalues[key]);
    }
  });

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
    const currentDate = rec.date;

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    rec.date.value = `${day}/${month}/${year}`;
    const data = {
      flight: rec.flight,
      date: rec.date.value,
      time: rec.time,
      number: rec.number,
      departure: rec.departure,
      arrival: rec.arrival,
      seats: rec.avseats,
      nooftick: req.body.nooftick,
      amount: req.body.nooftick * 500,
      arr_passengers: arr_passengers.join(","),
      arr_ages: arr_ages.join(","),
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
  var arr = rec.time.split(":");
  var formattedTime = arr[0].padStart(2, "0") + ":" + arr[1].padStart(2, "0");
  const data = {
    flight: rec.flight,
    date: formattedDate,
    time: formattedTime,
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
    gmail1(
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
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.render("lobby");
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/lobby");
});

//otp verify
app.post("/otpverify", (req, res) => {
  const password = req.body.password;
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!regex.test(password)) {
    res.render("login", {
      error:
        "Invalid password. Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  } else {
    const random = Math.floor(Math.random() * 9000 + 1000);
    gmail2(
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
  }
});

app.get("/prevent-back", function (req, res) {
  res.redirect("lobby");
});

app.get("/fgetpass", function (req, res) {
  res.render("fgetpass");
});

app.post("/otpverify1", function (req, res) {
  const random = Math.floor(Math.random() * 9000 + 1000);
  var data = {
    otp: random,
    email: req.body.emailotp,
  };
  gmail2(
    req.body.emailotp,
    "Fly Right Booking - OTP Verification",
    `<p>Your One-Time Password (OTP) for email verification is: <strong>${random}</strong>. Please enter this OTP to complete your email verification process.</p>`
  );
  res.render("otpemail", { flightData: data });
});

app.post("/resetpass", function (req, res) {
  var data = {
    email: req.body.email,
  };
  res.render("resetpass", { flightData: data });
});

app.post("/passconf", async function (req, res) {
  if (req.body.newp === req.body.conp) {
    var cc = await mongodb.usercollection.findOne({ email: req.body.email });
    await mongodb.usercollection.updateOne(
      { _id: cc._id },
      { $set: { password: bcrypt.hashSync(req.body.newp, salt) } }
    );
    res.render("login");
  } else {
    alert("New password and Confirm password didn't match");
  }
});

app.listen(3000);

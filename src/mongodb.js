const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/ticketapp")
  .then(() => {})
  .catch(() => {});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const flightSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const bookingSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  passenger: {
    type: String,
    required: true,
  },
  flight: {
    type: String,
    required: true,
  },
  flight_id: {
    type: String,
    required: true,
  },
  tickets: {
    type: Number,
    required: true,
  },
});

const usercollection = new mongoose.model("usercol", userSchema);

const admincollection = new mongoose.model("admincol", adminSchema);

const flightcollection = new mongoose.model("flightcol", flightSchema);

const bookingcollection = new mongoose.model("bookingcol", bookingSchema);

module.exports = {
  usercollection,
  admincollection,
  flightcollection,
  bookingcollection,
};

const mongoose = require("mongoose");
const url =
  "mongodb+srv://tmssuthan:Sankardevi25%40@ticketbook.uusiuta.mongodb.net/?retryWrites=true&w=majority";
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(
  "mongodb+srv://tmssuthan:Sankardevi25%40@cluster0.3nsbyfa.mongodb.net/?retryWrites=true&w=majority"
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const myDataSchema = new mongoose.Schema({
  email: {
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
  email: {
    type: String,
    required: true,
  },
});

const flightSchema = new mongoose.Schema({
  flight: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  departure: {
    type: String,
    required: true,
  },
  arrival: {
    type: String,
    required: true,
  },
  avseats: {
    type: Number,
    required: true,
  },
  bkseats: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  seats: {
    type: Array,
    required: true,
  },
});
const bookingSchema = mongoose.Schema({
  passenger: {
    type: String,
    required: true,
  },
  flight: {
    type: String,
    required: true,
  },
  flight_id: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  ticketcount: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  seats_no: {
    type: Array,
    required: true,
  },
  account_no: {
    type: Number,
    required: true,
  },
  passenger_names: {
    type: Array,
    required: true,
  },
  passenger_ages: {
    type: Array,
    required: true,
  },
});

const myDatacollection = new mongoose.model("my-data", userSchema);

const usercollection = new mongoose.model("usercol", userSchema);

const admincollection = new mongoose.model("admincol", adminSchema);

const flightcollection = new mongoose.model("flightcol", flightSchema);

const bookingcollection = new mongoose.model("bookingcol", bookingSchema);

module.exports = {
  usercollection,
  admincollection,
  flightcollection,
  bookingcollection,
  myDatacollection,
};

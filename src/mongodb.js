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

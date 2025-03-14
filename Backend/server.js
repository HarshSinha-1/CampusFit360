require('dotenv').config();
const {MONGO_URI,PORT} = require("./configs/configs")
const express = require('express');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());

const studentRouter = require('./routes/studentRouter');
const AdminRouter = require('./routes/AdminRouter');
const trainerRouter = require('./routes/trainerRouter');

 


app.use("/student",studentRouter);
app.use("/admin",AdminRouter);
app.use("/trainer",trainerRouter);

const connectWithRetry = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 45000,
      socketTimeoutMS: 60000,
    });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => console.log("Server running on port 3000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB. Retrying in 5 seconds...", err);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

require('dotenv').config();
const {MONGO_URI,PORT} = require("./configs/configs")
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

app.use(cors({
  origin: '*', // Change this to your frontend URL if needed (e.g., "http://localhost:3000")
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const studentRouter = require('./routes/studentRouter');
const AdminRouter = require('./routes/AdminRouter');
const trainerRouter = require('./routes/trainerRouter');
const GymRouter = require('./routes/GymRouter');
const workoutRouter = require('./routes/WorkoutPlan');
const nutritionPlanRouter = require("./routes/nutritionPlan");

 
app.use("/student",studentRouter);
app.use("/admin",AdminRouter);
app.use("/trainer",trainerRouter);
app.use("/gym",GymRouter);
app.use("/workout",workoutRouter);
app.use("/nutrition",nutritionPlanRouter);


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

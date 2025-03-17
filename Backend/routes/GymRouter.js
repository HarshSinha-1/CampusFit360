const express = require('express');
 
const { GymModel } = require('../models/db');
const { BookingModel } = require('../models/db');
const {StudentModel} = require('../models/db');
const studentmiddleware = require('../middlewares/StudentMiddleware');

const GymRouter = express.Router();


GymRouter.get("/preview",studentmiddleware, async (req, res) => {
    try {
        const student = req.student;
        const gyms = await GymModel.find({}).populate('gymId', 'location equipments slots');

        if (!gyms || gyms.length === 0) {
            return res.status(404).json({ message: "No gyms found" });
        }

        return res.status(200).json({
            message: "All available gyms",
            gyms
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching gyms", error: error.message });
    }
});

GymRouter.post("/book", studentmiddleware, async (req, res) => {
    try {

        const student  = req.student;
        console.log("Student info:", student);
        const { gymId, bookedDate, selectedTime, equipment } = req.body;

        const gym = await GymModel.findOne({ gymId });
        if (!gym) return res.status(404).json({ 
            message: "Gym not found/Enter correct GymId" 
        });

        const slot = gym.slots.find(s => s.time === selectedTime);
        if (!slot) return res.status(404).json({ 
            message: "Time slot not available"
         });

        if (slot.availability <= 0) {
            return res.status(400).json({
                 message: "Time slot is fully booked. Try another time!"
                 });
        }

        const booking = await BookingModel.create({
            studentId : student._id ,
            gymId: gym._id,
            BookingDate: bookedDate,
            timeSlot: selectedTime,
            equipment: equipment,
            status: "confirmed"
        });

        const gymUpdate = await GymModel.updateOne(
            { gymId, "slots.time": selectedTime, "slots.availability": { $gt: 0 } },
            { $inc: { "slots.$.availability": -1 } }
        );

        if (booking && gymUpdate.modifiedCount > 0) {
            return res.status(200).json({
                message: "Booking Confirmed ✅",
                studentName: student.name,
                gymId: gym.gymId,
                location: gym.location,
                timing: selectedTime,
                equipment,
                status: "confirmed"
            });
        }

        return res.status(400).json({ 
            message: "Booking failed, please try a different time!" 
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = GymRouter;

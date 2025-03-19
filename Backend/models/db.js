const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fitnessLevel: { type: Number, min: 1, max: 10, required: true },
    weight : { type: Number, required: true },

});

const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const GymSchema = new Schema({
    gymId: { type: Number, required: true },
    location: { type: String},
    capacity: { type: Number},
    equipments: { type: [String]},
    slots : [{
        time : { type: String , required: true },
        availability : {type : Number}
    }]
});

const TrainerSchema = new Schema({
    trainerId: { type: String,required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
});

const BookingSchema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    BookingDate: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g., '10:00-11:00 AM'
    equipment: { type: String }, 
    status: { 
        type: String,
        enum: ['confirmed', 'canceled', 'completed'],
        default: 'confirmed'
    }
});

const workoutSchema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    workoutPlan :{ type : String, required: true }
});

const nutritionSchema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
    nutritionPlan :{ type : String, required: true }
});

const StudentModel = mongoose.model('Student', StudentSchema);
const AdminModel = mongoose.model('Admin', AdminSchema);
const GymModel = mongoose.model('Gym', GymSchema);
const TrainerModel = mongoose.model('Trainer', TrainerSchema);
const BookingModel = mongoose.model('Booking',BookingSchema);
const WorkoutModel = mongoose.model('Workout',workoutSchema);
const NutritionModel = mongoose.model('Nutrition',nutritionSchema);

module.exports = {
    StudentModel,
    AdminModel,
    GymModel,
    TrainerModel,
    BookingModel,
    WorkoutModel,
    NutritionModel
};

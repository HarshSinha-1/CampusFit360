const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fitnessLevel: { type: Number, min: 1, max: 10, required: true },
});

const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const GymSchema = new Schema({
    gymId: { type: Number, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    equipments: { type: [String], required: true },
});

const TrainerSchema = new Schema({
    trainerId: { type: String,required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
});

const StudentModel = mongoose.model('Student', StudentSchema);
const AdminModel = mongoose.model('Admin', AdminSchema);
const GymModel = mongoose.model('Gym', GymSchema);
const TrainerModel = mongoose.model('Trainer', TrainerSchema);

module.exports = {
    StudentModel,
    AdminModel,
    GymModel,
    TrainerModel
};

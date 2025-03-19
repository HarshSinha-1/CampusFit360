const API_KEY = require("../configs/configs").API_KEY
const Router = require('express');
const StudentModel = require("../models/db").StudentModel;
const WorkoutModel = require("../models/db").WorkoutModel;
const studentmiddleware = require('../middlewares/StudentMiddleware');
const mongoose = require('mongoose');

const workoutRouter = Router();

workoutRouter.get('/workoutplan', studentmiddleware , async (req, res) => {
 try{
    const student = req.student;
    const student1 = await StudentModel.findById(student._id);
    if(!student1){
        return res.status(404).json({
            message: "Student not found.!"
        });
    }
    const studentId =  new mongoose.Types.ObjectId(student._id);
    const existingWorkout = await WorkoutModel.findOne({ studentId });
    if(existingWorkout){
        return res.status(200).send({
           message : "You already have a workout plan.",
           workoutPlan: existingWorkout.workoutPlan,
            name : student1.name,
    });
   }
    
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(`${API_KEY}`);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Generate a **4-week personalized Workout Plan** for a college student named ${student1.name}, ${student1.age}} years old, fitness level:${student1.fitnessLevel}/10, weighing ${student1.weight} kg.
✅ **Plan specifics:**
- 6 days per week, Day 7 as rest
- Strength (Upper, Lower, Full Body) or Cardio & Core focus each day
- Progressive overload weekly (increase reps/weight each week)
- Balanced mix of compound and isolation exercises for all major muscle groups
- Focus on strength, endurance, and core stability  

🔧 **Output Requirements:**  
- **Strict Table Format** (no intros or explanations)
- **5 columns:** Day | Workout Type | Exercises | Sets/Reps/Weight (Week 1) | Week Progression (Weeks 2-4)
- Each day should include **5 exercises**  
- **Week Progression:** Detail how weight, reps, or time increases weekly  
- **Consistent Markdown-style Table** (| Day | Workout Type | Exercises | etc.)  
- No extra text before or after the table — output the table only.`;


    const result = await model.generateContent(prompt);
    
    if(!result){
        return res.status(404).json({
            message: "Failed to generate workout plan."
            });
    }

    const workoutPlan = result?.response?.text?.() ?? null;
    const workout = await WorkoutModel.create({
                               studentId: student._id,
                               workoutPlan: workoutPlan
                             });
  
    if(!workout){
        return res.status(404).json({
            message: "/Failed to create workout plan."
            });
    }
    console.log("Student Generated Workout Plan");
    return res.status(200).send({
              name : student1.name,
              age : student1.age,
              workoutPlan : workoutPlan,
    });
    

    }catch(error){
        res.status(404).json({
            message: "Error generating workout plan.",
            error: error.message
        })
    }
    
});

module.exports = workoutRouter;


 
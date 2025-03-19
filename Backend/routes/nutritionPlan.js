const API_KEY = require("../configs/configs").API_KEY
const Router = require('express');
const StudentModel = require("../models/db").StudentModel;
const NutritionModel = require("../models/db").NutritionModel;
const studentmiddleware = require('../middlewares/StudentMiddleware');
const mongoose = require('mongoose');

const nutritionPlanRouter = Router();

nutritionPlanRouter.get('/nutritionplan', studentmiddleware , async (req, res) => {
 try{
    const student = req.student;
    const student1 = await StudentModel.findById(student._id);
    if(!student1){
        return res.status(404).json({
            message: "Student not found.!"
        });
    }

    const studentId =  new mongoose.Types.ObjectId(student._id);
    const existingWorkout = await NutritionModel.findOne({ studentId });
        if(existingWorkout){
            return res.status(200).send({
               message : "You already have a workout plan.",
                nutritionPlan: existingWorkout.nutritionPlan,
                name : student1.name,
        });
       }
        
    
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(`${API_KEY}`);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Meal Plan for a college student named ${student1.name}, ${student1.age} years old, fitness level: ${student1.fitnessLevel}/10, weighing ${student1.weight} kg, aiming for **muscle gain** (calorie surplus).
✅ Meal Plan specifics:
- 3 main meals + 2 snacks per day
- Balanced macronutrient breakdown per meal for **muscle growth**
- Each meal must include: **Calories, Protein (g), Carbs (g), Fats (g)**
- Varied, realistic food choices that are affordable and easy to prepare
- **Balanced macros** — ensure high protein intake, moderate carbs, healthy fats

🔧 **Output Requirements:**
- **Strict Table Format** (no introductions, explanations, or disclaimers)
- **7 columns:** Day | Meal | Food Items | Calories | Protein (g) | Carbs (g) | Fats (g)
- **5 meals per day** (Breakfast, Snack 1, Lunch, Snack 2, Dinner)
- **Day Names** rotate from **Monday to Sunday**
- **Consistent Markdown-style Table** (| Day | Meal | Food Items | Calories | etc.)
- **No extra text before or after the table** — output the table only`;

const result = await model.generateContent(prompt);
    
    if(!result){
        return res.status(404).json({
            message: "Failed to generate workout plan."
            });
    }
    const nutritionPlan = result.response.text();
    const nutrition = await NutritionModel.create({
                               studentId: student._id,
                               nutritionPlan : nutritionPlan
                             });
    if(!nutrition){
        return res.status(404).json({
            message: "Failed to create Nutrition plan."
            });
    }
    console.log("Student Generated Workout Plan");
    return res.status(200).send({
        name : student1.name,
        age : student1.age,
        nutritionPlan : nutritionPlan
    });
    

    }catch(error){
        res.status(404).json({
            message: "Error generating Nutrition plan.",
            error: error.message
        })
    }
    
});

module.exports = nutritionPlanRouter;


 
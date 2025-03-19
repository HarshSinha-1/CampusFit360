const Router = require('express');
const { TrainerModel } = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const studentmiddleware = require('../middlewares/StudentMiddleware');
const JWT_USER_PASSWORD = require('../configs/configs').JWT_USER_PASSWORD;

const trainerRouter = Router();

trainerRouter.post('/register', async (req, res) => {
    try {
        const { name, password, gender, email, specialization } = req.body;
        const hashpwd = await bcrypt.hash(password, 10);

        const generateUserId = async () => {
            const lastUser = await TrainerModel.findOne().sort({ _id: -1 });
            let newId = "T001";
        
            if (lastUser && lastUser.TrainerId) {
                const lastIdNum = parseInt(lastUser.TrainerId.replace("T", ""), 10);
                newId = `T${String(lastIdNum + 1).padStart(3, "0")}`;
            }
        
            return newId;
        };
        

        const trainerId = await generateUserId();

        const trainer = await TrainerModel.create({
            trainerId,
            name,
            password: hashpwd,
            gender,
            email,
            specialization
        });

        if (!trainer) {
            return res.status(400).json({
                message: "Failed to register Trainer"
            });
        }

        res.status(201).json({
            message: "Trainer Registered Successfully",
            trainerId: trainerId
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

trainerRouter.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const trainer = await TrainerModel.findOne({ email });

        if (!trainer) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        const isMatch = await bcrypt.compare(password, trainer.password);

        if (trainer && isMatch) {
            const token = jwt.sign(
                { trainerId: trainer.trainerId },
                JWT_USER_PASSWORD,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                message: "Trainer Signed In Successfully",
                token: token
            });
        } else {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

trainerRouter.get("/preview", async (req,res)=>{
    try {
        const trainers = await TrainerModel.find({}).populate('trainerId','name','gender','specialization');

        if (!trainers || trainers.length === 0) {
            return res.status(404).json({ message: "No gyms found" });
        }

        return res.status(200).json({
            message: "All available gyms",
            trainers
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching Trainers", error: error.message });
    }
})


module.exports = trainerRouter;

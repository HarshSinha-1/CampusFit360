const Router = require('express');
const {StudentModel} = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_USER_PASSWORD = require('../configs/configs').JWT_USER_PASSWORD;

const studentRouter = Router();

studentRouter.post('/register',async(req,res)=>{
    try{
        const {name,age,gender,email,password,fitnessLevel}=req.body;
        const hashpwd = await bcrypt.hashSync(password,10);

        const student = await StudentModel.create({
            name,
            age,
            gender,
            email,
            password : hashpwd,
            fitnessLevel
        });
        if(!student){
            res.status(400).json({
                message : "Failed to register Student"
            });
        }
        res.status(201).json({
            message : "Student Registered Successfully"
        });
    }catch(error){
        res.status(500).json({ 
            message : "Internal Server Error",
            error : error.message
        });
    }
})



studentRouter.post('/signin',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const student = await StudentModel.findOne({email});

        if(!student){
            res.status(400).json({
                message : "Invalid email"
            });
        }

        const ismatch = await bcrypt.compare(password,student.password);

        if(student && ismatch){
            const token =  await jwt.sign({studentId : student._id},JWT_USER_PASSWORD,{expiresIn : '1h'});
            if(!token){
                res.status(400).json({
                    message : "Failed to generate token"
                    });
            }
            res.status(200).send({
                message : "Student Signed In Successfully",
                token : token
                });
        }else{
            res.status(400).json({
            message : "Invalid Password"
        });
        }
    }catch(error){
        res.status(500).json({
            message : "Internal Server Error",
            error : error.message
        });
    }
});

module.exports = studentRouter;
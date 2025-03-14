const {Router} = require('express');
const {AdminModel,GymModel} = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_ADMIN_PASSWORD = require('../configs/configs').JWT_ADMIN_PASSWORD;

const AdminRouter = Router();

AdminRouter.post('/register',async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        const hashpwd = await bcrypt.hash(password,10);

        const newAdmin = await AdminModel.create({
            name,
            email,
            password : hashpwd
        });
        if(newAdmin){
            res.status(201).json({message : "Admin Registered Successfully"});
        }else{
            res.status(400).json({message : "Failed to register Admin"});
        }   
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
           error : error.message
        });
    }
        
});

AdminRouter.post('/login',async (req,res)=>{
    try {
        const {email,password} = req.body;
        const admin = await AdminModel.findOne({email});
        if(admin){
            const isValid = await bcrypt.compare(password,admin.password);
            if(isValid){
                const token = jwt.sign({id : admin._id},JWT_ADMIN_PASSWORD,{ expiresIn : '1h'});
                if(!token){
                    res.status(400).json({
                        message : "Failed to generate token"
                        });
                }
            res.status(200).send({
                message : "Admin Logged In Successfully",
                token : token
            });
          }else{
                res.status(400).json({message : "Invalid Credentials"});
            }
        }else{
            res.status(400).json({message : "Invalid Credentials"});
        }
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
            error : error.message
        });
    }
});


module.exports = AdminRouter
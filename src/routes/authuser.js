const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')

const {Usermodel}=require("../models/userSchema");
const {validationFile}=require('../validations/validation');
const {Authmiddle}=require('../middlewares/authmiddleware')


 const authRouter=express.Router();

// post the data
authRouter.post('/signup',async(req,res)=>{

    const {firstName,lastName,emailId,password,gender,age,photourl,skills}=req.body;
   

    try {
        // validattion api level
        validationFile(req);
        // const user=new Usermodel(req.body) //this one way but we use another method to store

        const hashpassword= await bcrypt.hash(password,10);
     
       
        
        const user= new Usermodel({firstName,lastName,emailId,password:hashpassword,gender,photourl,age,skills});
        

        await user.save();
        res.send("user added sucessfully")
        
    } catch (error) {
        res.status(400).send("error"+error.message)
    }
});

//  login  api
authRouter.post('/login',async(req,res)=>{
    try {

   const {emailId,password}=req.body;

    const user=await Usermodel.findOne({emailId:emailId});
    if(!user){
       throw new Error("user is not present");

    }
   //  const isUservalidate=await bcrypt.compare(password,user.password);
   const isUservalidate=await user.passwordValidation(password); //creating schema methods 
    if(isUservalidate){

        const token=await jwt.sign({_id:user._id},"Dev@123");
       //  console.log(token);

        res.cookie("token",token,{expiresIn: new Date(Date.now()+ 10 * 3600000)});//hours
        // res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });//days


       res.send(user)
    }else{
       res.send("login failed incorrect password")
    }
       
    } catch (error) {
        res.status(401).json({message:error.message});
    }
});

authRouter.post('/logout',Authmiddle,async(req,res)=>{
          res.cookie('token',null,{expires:new Date(Date.now()),});
          res.send("logout");
})


module.exports=authRouter;
const express=require('express');
const { Authmiddle } = require('../middlewares/authmiddleware');
const {Usermodel}=require("../models/userSchema");
const  bcrypt=require("bcrypt");
const validator=require('validator');
const profileRouter=express.Router();


profileRouter.get('/profile/view',Authmiddle,async(req,res)=>{
    const user=req.user;
    res.send(user);

});

profileRouter.post('/profile/edit',Authmiddle,async(req,res)=>{
        
   try {
    const user=req.user;
    const {firstName,lastName,gender,age,photourl,skills}=req.body;

    const allowedfields= ["firstName","lastName","gender","age","photourl","skills"];

    const isAllowed=Object.keys(req.body).every((k)=>allowedfields.includes(k));
       if(!isAllowed){
       
        throw new Error("first/lastname/emailId/password is not allowed to edit")
    }

   if(!user){
        
           throw new Error("user not found");
    }
    const edit=await Usermodel.findByIdAndUpdate(user._id,{firstName:firstName,lastName:lastName,gender:gender,age:age,photourl:photourl,skills:skills},{runValidators:true})
     
    if(edit){
        res.send("your profile is updated")
    }else{
        res.send("your profile is not updated")
    }
    
   } catch (error) {
      res.status(401).send("Error :"+error.message)
   }
 
})

profileRouter.patch('/profile/password',Authmiddle,async(req,res)=>{
        
    try {

        const userPassword=req.user.password;
        const cpassword=req.body.currentPassword;
        const upassword=req.body.updatePassword;

    if(! validator.isStrongPassword(upassword)){
              throw new Error("New Password must be strong")
    }

    const encryptPssword=await bcrypt.compare(cpassword,userPassword);
    if(!encryptPssword){
        throw new Error("current password is not match")
    }

    const newHashPassword=await bcrypt.hash(upassword,10);
    
const updateduser=await Usermodel.findByIdAndUpdate(req.user._id,{password:newHashPassword});
 if(!updateduser){
    throw new Error("user not found");
}
res.send("password updated")
   
        
    } catch (error) {
        res.send("ERROR :"+error.message)
    }
})

module.exports=profileRouter;
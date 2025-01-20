const express = require('express');

const {ConnectionRequestModel}=require('../models/connectionRequestSchema.js')
const {Usermodel}=require('../models/userSchema.js')

const { Authmiddle}=require('../middlewares/authmiddleware')

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:touserId',Authmiddle,async (req, res) => {

    try {

    const fromUserId = req.user._id; //login user id
    const toUserId=req.params.touserId; //req.parms id //toUserId
    const status=req.params.status

   const allowedStatus=["intrested","ignored"];

   // if(fromUserId.equals(toUserId)){
   //    throw new Error("you cannot send the request to you")
   // }

   if(!allowedStatus.includes(status)){
    throw new Error("Invalid status code")
   }
   const toUserDetails=await Usermodel.findById(toUserId);
   if(!toUserDetails){
     throw new Error('User not found to send request')
   }
   const SenduserExistingConnection=await ConnectionRequestModel.findOne({fromUserId:fromUserId,toUserId:toUserId});

   const TouserExistingConnection=await ConnectionRequestModel.findOne({fromUserId:toUserId,toUserId:fromUserId});
   
   if(SenduserExistingConnection){
     
    throw new Error("you alredy send connection request ");

  }
  if(TouserExistingConnection){

   throw new Error("you have alredy got connection request from these user ");

}
   const request=new ConnectionRequestModel({fromUserId:fromUserId,toUserId:toUserId,status:status});

   await request.save();

    res.send(fromUserId+" sent a request to "+toUserId); 
   
    } catch (error) {

       res.status(401).json({message:error.message})

    }
});

requestRouter.post('/request/review/:status/:reqId',Authmiddle,async(req,res)=>{
   try {
      const loginuser=req.user;
      const reqId=req.params.reqId;
      const reqStatus=req.params.status;

     const allowedStatus=["accepted","rejected"];

     if(!allowedStatus.includes(reqStatus)){
            throw new Error('invalid status code');
     }

   const connectionRequest=await ConnectionRequestModel.findOne({fromUserId:reqId,toUserId:loginuser._id,status:"intrested"});

   
   if(!connectionRequest){
      throw new Error("Error :you dont have any requests from the user")
   };
   
   connectionRequest.status=reqStatus

   
   await connectionRequest.save();
   
   
   
   res.send("saved connection");
      
   } catch (error) {
     res.status(400).json({message:error.message})
   }
});

module.exports = requestRouter;


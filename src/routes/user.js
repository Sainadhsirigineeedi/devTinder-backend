const express=require("express");

const userRouter=express.Router();

const {ConnectionRequestModel}=require('../models/connectionRequestSchema')

const {Authmiddle}=require("../middlewares/authmiddleware");
const { Usermodel } = require("../models/userSchema");
const { all } = require("./requests");


userRouter.get('/user/connections',Authmiddle,async(req,res)=>{
  
    try {

        const loginuser=req.user;

        const connections=await ConnectionRequestModel.find(
            {
               $or:[
                    {fromUserId:loginuser._id,status:"accepted"},

                    {toUserId:loginuser._id,status:"accepted"}
    
                ]
            }
        ).populate("fromUserId",["firstName","lastName","age","gender","skills"])
        .populate("toUserId",["firstName","lastName","age","gender","skills"]);

        

       if(!connections.length>0){
        return res.status(400).send("no inrests found")
       }

      const data= connections.map((connection)=>{
        //   if//connection.fromUserId._id.toString() === loginuser._id.toString()
            if(connection.fromUserId._id.equals(loginuser._id) ){ 
                return connection.toUserId
            }else{
                return connection.fromUserId
            }
      })

       res.send(data);
        
    }catch (error) {
       res.send("Error :"+error.message) 
    }
    
});

userRouter.get('/user/requests',Authmiddle,async(req,res)=>{
    try {
        const loginuser=req.user;

    const intrestedRequests=await ConnectionRequestModel.
                            find({toUserId:loginuser._id,status:"intrested"})
                            .populate("fromUserId",["firstName","lastName","age","gender","skills","photourl"])

    if(!intrestedRequests.length>0){
        throw new Error("no intrestes are found");
    }

    res.send(intrestedRequests);

        
    } catch (error) {
        res.status(400).json({message:error.message})
    }
});

userRouter.get('/user/feed',Authmiddle,async(req,res)=>{
      try {
        const page=req.query.page || 1;
        let limit=req.query.limit || 3;

        if(limit >10){
            limit= 8;
        }
        const skip=(page-1)*limit;

      
        const loginuser=req.user;
        const  ExistingConnections=await ConnectionRequestModel.find(
            {
                $or :[
                    {fromUserId:loginuser._id},
                    {toUserId:loginuser._id}
                   
                ]
            }
        ).select("fromUserId toUserId");

        let existingIds=ExistingConnections.map((req)=>{
                return req.fromUserId.toString();
        });
        ExistingConnections.map((req)=>{
            existingIds.push(req.toUserId.toString())
    })
    const existingset=new Set(existingIds);
    // console,log(existing)
    // Array.from(existingset) //converts set into array
   
    const allusers=await Usermodel.find({
                $and:[
                    {
                        _id:{
                            $nin:Array.from(existingset)
                          }
                    },
                    {
                        _id:{
                            $ne:loginuser._id
                        }
                    }
                ]
            }).select("_id firstName lastName photourl skills age")
            .skip(skip).limit(limit)
    
     if(!allusers.length>0){
        throw new Error("no users are prsent")
     }
     res.send(allusers);
       
}catch (error){

        res.status(400).json({message:error.message});
        
      }
    })

module.exports={userRouter}
const mongoose=require('mongoose');

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","accepted","intrested","rejected"],
            message:`{value} is not suported`
        }
    }
},{timestamps:true});

connectionRequestSchema.pre("save",function (next){
    const connectionRequest=this;
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection to yourself");
   }
     next();
})

const ConnectionRequestModel =new mongoose.model("ConnectionRequests",connectionRequestSchema);

module.exports={ConnectionRequestModel};
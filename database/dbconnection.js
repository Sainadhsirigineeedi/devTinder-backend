const mongoose=require("mongoose");

const url="mongodb://localhost:27017/tinderpractdb";

const  connectToDb = async()=>{
   await mongoose.connect(url)
}

module.exports={connectToDb}
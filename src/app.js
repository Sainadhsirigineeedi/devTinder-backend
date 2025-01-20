const express=require("express");
const cors=require("cors")

const {connectToDb}=require("../database/dbconnection");

const cookeiParser=require('cookie-parser');

const authRouter=require('./routes/authuser.js');

const requestRouter=require('./routes/requests.js');

const profileRouter=require('./routes/profile.js');

const {userRouter}=require("./routes/user.js")

const app=express();
const corsOptions = {
    origin: 'http://localhost:5173',  // Allow requests from this origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],  // Add PATCH to allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Specify headers if necessary
    credentials:true
    
  };
app.use(cors(corsOptions))
app.use(express.json()); // this middleware converts json object into js object

app.use(cookeiParser());// this middleware is used read the cookeis

 
app.use('/',authRouter);
app.use('/',requestRouter);
app.use('/',profileRouter);
app.use('/',userRouter);

 

    




connectToDb().then(()=>{
    console.log("connected to db");
    app.listen(3000,()=>{
        console.log("server run at 3000")
    })
 }).catch(()=>{
    console.log("not connected")
 })


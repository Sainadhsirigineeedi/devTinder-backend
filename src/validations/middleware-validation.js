// this is the one way of validation
const validator=require('validator')


const validationM=(req,res,next)=>{
    try {
       
    const {firstName,lastName,emailId,skills,password}=req.body;

    if(!firstName || !lastName){
          throw new Error("first/last name required")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("email must be strong")
    }
    else if(skills.length>10){
        throw new Error("skill must be 10")

    }
    else{
        next();
    }
        
        
    } catch (error) {
       res.send("ERRor :"+error.message) 
    }
}

module.exports={validationM};
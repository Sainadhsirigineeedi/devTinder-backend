const validator=require('validator')


const validationFile=(req)=>{
     
    const {firstName,lastName,emailId,skills,password}=req.body;

    if(!firstName || !lastName){
          throw new Error("first/last name required")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password must be strong")
    }
  else if(!validator.isEmail(emailId)){
        throw new Error("email is invalid")
  }
  else if(skills){
     if(skills.length>10){
        throw new Error("skills is wrong")
      }
  }
}

module.exports={validationFile}
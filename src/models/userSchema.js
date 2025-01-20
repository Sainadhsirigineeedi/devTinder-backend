const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema({
  
    firstName:{
        type:String,
        required:true,
        minlength:2
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value) {
             
             if (validator.isEmail(value)) {

                
                if (value.endsWith('@gmail.com')) {
                    
                } else {
                    throw new Error('Email must end with @gmail.com');
                }
            } else {
                // Email is not a valid format
                throw new Error('Invalid email format');
            }
        }

    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter a storng password :" + value)
            }
        }
    },
    age:{
        type:Number,
        required:true,
        min:18
    },
    skills:{
        type:[String]
        
        
    },
    photourl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4RZl4rXT_nAjdeMz0EhJMnulkobm_5TQU-A&s"
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender is not valid");
            }
        },
        required:true
       

    }

},{
    timestamps:true
});

userSchema.methods.passwordValidation = async function (logindatapassword){
    const user=this; //this refers to current user
   const isValidpassword= await bcrypt.compare(logindatapassword,user.password);
    if(isValidpassword){
        return isValidpassword;
    }
    else{
        throw new Error("invalid cridentials");
    }
}


const Usermodel=mongoose.model("User",userSchema);
module.exports={Usermodel}
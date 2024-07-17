import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "name is required"],
        trim:true
    },
    username: {
      type: String,
      unique: true,
      lowercase:true,
      required: [true, "username is required"],
      trim:true,
    },
    email: {
      type: String,
      unique: true,
      lowercase:true,
      required: [true, "email is required"],
      trim:true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim:true

    },
      profileImage: String,
      bio: String,
     
    
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save",async function(next){
  if (!this.isModified("password")) {
    return next();
  }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(this.password,salt);
    this.password=hashedPassword;
    next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken=async function(){

    const token=jwt.sign({id:this._id,email:this.email},process.env.JWT_KEY,{expiresIn:3*24*60*60*1000})

    return token

}

 const User= mongoose.model("User", userSchema);

 export default User
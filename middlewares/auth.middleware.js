import jwt from "jsonwebtoken"

export const isAuth=(req,res,next)=>{

    const token=req.headers.authorization;
    console.log("token",token)

    if(!token){
        return res.status(401).json({message:"Token is Expired"})
    }

        jwt.verify(token,process.env.JWT_KEY,(err,decoded)=>{
            if(err){
                return res.status(401).json({message:"Unauthorized"})
            }
            console.log(decoded);
        })

next()
        


}   
import  jwt  from "jsonwebtoken";
import User from "../models/Users.js";
import 'dotenv/config'

const protectRoute=async(req,res,next)=>{

    try {
        const token=req.header('Authorization').replace("Bearer","")
        if(!token) return res.status(401).json({message:"No authentication token"})
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        const user= await User.findById(decoded.userId).select("-password")

        if(!user) return res.status(401).json({message:'Token invalid'})
            req.user=user

            next()
    } catch (error) {
        return res.status(401).json({message:'Token is not valid'})
        
    }
}
export default protectRoute;
import express from 'express'
import User from '../models/Users.js';
import jwt from 'jsonwebtoken'
const router=express.Router();

const generateToken=(userId)=>{
   return jwt.sign({userId},process.env.MY_SECRET,{expiresIn:"15d"})
}
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Passowrd  length must be greater than 6" })
        }

        const existinguser = await User.findOne({ $or: [{ email }, { username }] })
        if (existinguser) return res.status(400).json({ message: "User already exists" })
        

        const profileImage = `https://api.dicebear.com/7.x/aataaars/svg?seed=${username}`
        const user = new User({ email, password, username, profileImage })

        await user.save()

        const token = generateToken(user._id)

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        })
    } catch (error) {
        console.log("Error in registration",error.message)
        console.error("Mongo error",error.stack);
        res.status(500).json({
            message: "Internal Server error"
        })

    }
})

router.post('/login', async (req, res) => {
         console.log("Incoming body:", req.body);
    try{
        const {email,password}=req.body

        if(!email || !password) return res.status(400).json({message:"Please fill all the required fields"})

        const user= await User.findOne({email})

        if(!user) return res.status(400).json({message:"user does not exsits"})

        // const isPassword=await User.comparePassword(password)
        const isPassword = await user.comparePassword(password);  // ✅ CORRECT

            console.log('hoooo')

        if(!isPassword) return res.status(400).json({message:"Enter correct password"})
            
        const token=generateToken(user._id)

        return res.status(200).json({
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage
            }
        })
    }catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})

export default router;
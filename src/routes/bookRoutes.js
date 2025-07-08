import express from 'express';
import cloudinary from '../lib/cloudinery.js';
import Book from '../models/Book.js';
const router=express.Router();
import protectRoute from '../middleware/auth.middleware.js'

router.post("/",protectRoute , async (req,res)=>{
    try{
    const {title,caption,rating,image,id}=req.body
        console.log(id)
        if(!image ||!title ||!rating ||!caption||!id) return res.status(400).json({message:"Please provide all required fields"})
            console.log('regbody',req)
            const uploadRes= await cloudinary.uploader.upload(image);
            const imageUrl=uploadRes.secure_url
            console.log("Image url ",imageUrl)
            const newBook=new Book({
                title,
                rating,
                image:imageUrl,
                caption,
                user:id
            })

            await newBook.save()

            return res.status(201).json(newBook);
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }


})

router.get('/',protectRoute,async(req,res)=>{
    try {
        const page=req.query.page|| 1;
        const limit=req.query.limit ||5;
        const skip=(page-1)*limit;
        const books=await Book.find().sort({createdAt:-1}).skip(skip).limit(limit).populate("user","username profileImage");

        const totalBooks=await Book.countDocuments();
        res.send({
            books,
            totalBooks,
            currentPage:page,
            totalBooks:Math.ceil(totalBooks/limit)
        })
    } catch (error) {
        res.status(500).json({message:"Internal Server error"})
    }
})

router.get('/users',protectRoute,async(req,res)=>{
    try {
        const books=await Book.find({user:req.user._id}).sort({createdAt:-1});
        res.json(books)
    } catch (error) {
        res.status(500).json({message:"Internal Server error"})
    }
})

router.delete('/id',protectRoute,async(req,res)=>{
    try {
        const book=await Book.findById(req.params.id)
        if(!book)return res.status(404).json({message:"Book not found"})
        //checking if user is the creater of the book
        if(book.user._id.toString()!=req.user._id.toString())
        res.status(400).send({message:"Unauthorized"})

        if(book.image && book.image.includes('./cloudinary'))
            try {
                const publicId=book.image.split('/').pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId)
            } catch (deletionError) {
                res.status(500).send({message:"Error in deletetion of Cloudinary.Internal server error"})
            }
        await book.deleteOne();
        return res.json({message:"Book deleted successfully"})

    } catch (error) {
        res.status(500).send({message:"Error in deletetion .Internal server error"})
    }
})
export default router;
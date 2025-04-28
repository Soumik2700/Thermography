
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../model/user.model.js";

export async function createUser(req, res){
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required!"});
    }

    
    try{
        const hashedPass = bcrypt.hashSync(password, 10);
        const user = new User({
            name, email, 
            password: hashedPass
        })

        const savedUser = await user.save();
        if(!savedUser){
            return res.status(400).json({message: "Faild to create user!"})
        }

        res.send({savedUser});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export async function login(req, res){
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Both fields are required!"});
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "Invalid email!"});
        }

        const validatePass = bcrypt.compareSync(password, user.password);
        if (!validatePass){
            return res.status(403).json({message: "Acess denied! Invalid password!"});
        }

        const token = jwt.sign({id: user._id}, "MY_JWT_SECRET_KEY", {expiresIn:"24h"})

        res.send({
            userId:user._id,
            name:user.name,
            email:user.email,
            token
        })

    }catch(err){
        res.status(500).json({message: err.message});
    }
}
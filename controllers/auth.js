import mongoose from "mongoose";
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import { createError } from "../error.js";
import jwt from 'jsonwebtoken'


export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password.toString();
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).send("User has been created");
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    try {
        const {email , password} = req.body
        const user = await User.findOne({email}).select("+password");
        if (!user) return next(createError(404, "User Not Found"));

        const isCorrectPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!isCorrectPassword)
            return next(createError(400, "Please Enter correct details"));
        
        const token = jwt.sign({ _id: user._id }, process.env.JWT)
        res.cookie("access_token", token, {
        maxAge: 86400000, 
        httpOnly: true,
        sameSite:process.env.NODE_ENV === "Development" ? "lax": "none",
        secure:process.env.NODE_ENV === "Development" ? false: true
        }).status(200).json(others)
    } catch (error) {
        next(error);
    }
};


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
        const { email, password } = req.body
        const user = await User.findOne({ email }).select("+password");
        if (!user) return next(createError(404, "User Not Found"));

        let newPassword = password;
        if (typeof password !== "string") {
            newPassword = password.toString();
        }

        if (typeof user.password !== "string") {
            user.password = user.password.toString();
        }

        const isCorrectPassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (!isCorrectPassword)
            return next(createError(400, "Please Enter correct details"));

        const token = jwt.sign({ id: user._id }, process.env.JWT)
        const { newpassword, ...others } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "Development" ? false : true
        }).status(200).json(others)
    } catch (error) {
        next(error);
    }
};
export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT)
            res.cookie("access_token", token,
                {
                    httpOnly: true,
                    maxAge: 86400000,
                    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
                    secure: process.env.NODE_ENV === "Development" ? false : true
                }).status(200).json(user._doc)
        } else {
            const newUser = await User.create({ ...req.body, fromGoogle: true })
            const savedUser = await newUser.save()
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT)
            res.cookie("access_token", token,
                {
                    httpOnly: true,
                    maxAge: 86400000,
                    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
                    secure: process.env.NODE_ENV === "Development" ? false : true
                }).status(200).json(savedUser._doc)
        }
    } catch (error) {
        next(error)
    }
}
export const signout = (req, res, next) => {
    try {
        res.clearCookie("access_token", {
            sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "Development" ? false : true,
        });
        res.status(200).send("User has been logged out");
    } catch (error) {
        next(error);
    }
};




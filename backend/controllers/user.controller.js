import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const profileFile = req.files?.file?.[0];
        const resumeFile = req.files?.resume?.[0];
    
        let profilePhotoUrl='';
        let resumeUrl = '';
        let resumeOrignalName = '';

        if (profileFile) {
            const fileUri = getDataUri(profileFile);
            const cloudResponse = await cloudinary.uploader.upload(fileUri,{
                folder:"profiles"
            });
            profilePhotoUrl = cloudResponse.secure_url;
        }
        if (resumeFile) {
            const resumeUri = getDataUri(resumeFile);
            const cloudResponse = await cloudinary.uploader.upload(resumeUri,{
                folder:"resumes",
                resource_type:"rew"
            });
            resumeUrl = cloudResponse.secure_url;
            resumeOriginalName = resumeFile.originalname;
        }


        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
                resume:resumeUrl
            }
        });

        return res.status(201).json({
            message: "Account created succesfully.",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "incorrect email or password. ",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "incorrect email or password. ",
                success: false,
            })
        };
        //check role is correct or not 
        /*if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };*/

        const tokenData = {
            userId: user._id
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })


    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudresponse = await cloudinary.uploader.upload(fileUri)


        //cloudinary will come here 
        let skillsArray = [];
        if (typeof skills === "string") {
            skillsArray = skills.split(",").map(skill => skill.trim());
        }
        const userId = req.id; //middleWare authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        //updating data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray

        //resume comes later here...
        if (cloudresponse) {
            user.profile.resume = cloudresponse.secure_url // save the cloudinary url
            user.profile.resumeOrignalName = file.originalname // save the orignal file name
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            skills: user.skills
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })


    } catch (error) {
        console.log(error)
    }
}
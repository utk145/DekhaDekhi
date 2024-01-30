import { User } from "../models/user.models";
import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Both email and password are required" })
    }


    if (password.length < 6) {
        return res
            .status(400)
            .json({ message: "Length of the password must be atleast 6 characters" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User already exists" })
        }

        const user = await User.create({
            email,
            password
        });

        const userCreated = await User.findById(user._id).select("-password")
        if (!userCreated) {
            return res
                .status(500)
                .json({ message: "Something went wrong while registering the user" })
        }

        return res
            .status(201)
            .json({ message: "User registered  successfully", userCreated })


    } catch (error: any) {
        res
            .status(500)
            .json({ error: error.message })
    }


})


export { registerUser };
import { User } from "../models/user.models.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { StreamChat } from "stream-chat";

const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const client = StreamChat.getInstance(STREAM_API_KEY!, STREAM_API_SECRET!)

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

        // creating user in Stream Chat
        await client.upsertUser({
            id: userCreated.id,
            email: userCreated.email,
            name: userCreated.email.split('@')[0] + "dekhais"
        });

        // create user for token
        const token = client.createToken(userCreated.id)

        return res
            .status(201)
            .json({ message: "User registered  successfully", userCreated, token })


    } catch (error: any) {
        res
            .status(500)
            .json({ error: error.message })
    }


})

const loginUser = asyncHandler(async (req, res) => {
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
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res
                .status(400)
                .json({ message: "User doesn't exist" })
        }

        //@ts-ignore
        const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res
                .status(401)
                .json({ message: "Password is invalid" })
        };


        const loggedInUser = await User.findById(existingUser._id).select("-password");
        const token = client.createToken(existingUser.id);
        return res
            .status(200)
            .json({ message: "User logged in successfully", token, user: loggedInUser })


    } catch (error: any) {
        res
            .status(500)
            .json({ error: error.message })
    }

})

export { registerUser, loginUser };
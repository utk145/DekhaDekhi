import { Router } from "express";
import bcrypt from "bcrypt";
import { StreamChat } from 'stream-chat';
// import dotenv from "dotenv" ; // Not required now as the fix is made in index.ts . Reference: https://stackoverflow.com/questions/62287709/environment-variable-with-dotenv-and-typescript 


// dotenv.config({ path: './.env' }); // if this is commented then the values are undefined; even though i am calling dotenv.config() in index.ts.**** Figure out why****
const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;


// https://getstream.io/chat/docs/node/?language=javascript
console.log("API Key:", STREAM_API_KEY);
console.log("API Secret:", STREAM_API_SECRET);
const client = StreamChat.getInstance(STREAM_API_KEY!, STREAM_API_SECRET!)


const userRouter = Router();


interface User {
    id: string,
    email: string,
    hashed_password: string;
}

const Users: User[] = [];

userRouter.route("/register").post(async (req, res) => {
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


    const existingUser = Users.find((user) => user.email === email);
    if (existingUser) {
        return res
            .status(400)
            .json({ message: "User already exists" })
    }

    try {
        const hashed_password = await bcrypt.hash(password, 10);

        const idRegistering = (Math.random() + 1).toString(36).slice(2)
        // console.log("id", idRegistering);

        const newUser = {
            id: idRegistering,
            email,
            hashed_password,
        }

        Users.push(newUser);
        // console.log(Users);


        await client.upsertUser({
            id: idRegistering,
            email,
            name: email
        });

        const token = client.createToken(newUser.id);

        return res
            .status(200)
            .json({
                token,
                newUser
            });


    } catch (error: any) {
        res
            .status(500)
            .json({ error: error.message })
    }

});


userRouter.route("/login").post(async (req, res) => {
    const { email, password } = req.body;
    const user = Users.find((user) => user.email === email);
    const hashed_password = await bcrypt.hash(password, 10);

    if (!user || user.hashed_password !== hashed_password) {
        return res
            .status(400)
            .json({
                message: 'Invalid credentials.',
            });
    }
    // Create token for user
    const token = client.createToken(user.id);

    return res
        .json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
})

export default userRouter;
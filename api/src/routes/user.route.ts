import { Router } from "express";
import bcrypt from "bcrypt";

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
        


    } catch (error: any) {
        res
            .status(500)
            .json({ error: error.message })
    }

});


export default userRouter;
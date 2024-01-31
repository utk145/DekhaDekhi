import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.ts";


const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)

export {userRouter}

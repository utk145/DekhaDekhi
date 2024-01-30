import express from "express";




const app = express();

// configs
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))


// routes
import { userRouter } from "./routes/prod.route";


// routes declaration
app.use("/api/v1/users", userRouter)


export { app };
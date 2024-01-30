// import dotenv from "dotenv";
import 'dotenv/config'
import { app } from "./app";

// dotenv.config({ path: "./.env" })

// to check if dotenv is loaded
// console.log("API Key:", process.env.STREAM_API_KEY);
// console.log("API Secret:", process.env.STREAM_API_SECRET);

// const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;
// console.log("API Key:", STREAM_API_KEY);
// console.log("API Secret:",STREAM_API_SECRET);

const PORT_NUM = process.env.PORT || 7000;

app.listen(PORT_NUM, () => {
    console.log(`Server is listening on Port:  ${PORT_NUM}`);
})
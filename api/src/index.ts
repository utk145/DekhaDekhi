import dotenv from "dotenv";
import { app } from "./app";

dotenv.config({ path: "./.env" })

const PORT_NUM = process.env.PORT || 7000;

app.listen(PORT_NUM, () => {
    console.log(`Server is listening on Port:  ${PORT_NUM}`);
})
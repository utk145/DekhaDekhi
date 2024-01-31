// import dotenv from "dotenv";
import 'dotenv/config'
import { app } from "./app.ts";
import connectDataBase from './db/index.ts';

const PORT_NUM = process.env.PORT || 7000;

connectDataBase()
    .then(() => {
        app.listen(PORT_NUM, () => {
            console.log(`Server is listening on Port:  ${PORT_NUM}`);
        })

    })
    .catch((err: any) => {
        console.log("MONGODB ERROR CONNECTION Failed !!! ", err);
    })
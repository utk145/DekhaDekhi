import mongoose from "mongoose";

const connectDataBase = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/dekadekhi`)
        console.log(`\nMongoDB connected !!`)
    } catch (error) {
        console.log("MONGODB ERROR CONNECTION - FAILED: ", error);
        process.exit(1);
    }
}


export default connectDataBase
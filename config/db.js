import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`The mongo db is connected on : ${connect.connection.host}`);
  } catch (error) {
    console.log(`There was an error connecting to DB: ${error}`);
  }
};

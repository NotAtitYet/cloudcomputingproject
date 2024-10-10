import mongoose from "mongoose";
mongoose.set('debug', true);
const connectDB = async()=>{
    try{
        console.log(process.env.MONGO_URL);
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log(
            `Connected to MongoDB database ${conn.connection.host}`
        );
    }catch(error){
        console.log('Error connecting to MongoDB',error);
       
    }
    
    
};
mongoose.connection.on('error', err => {
    console.log('Mongoose default connection error: ' + err);
  });
export default connectDB;
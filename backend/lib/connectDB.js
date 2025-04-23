import mongoose from "mongoose"

// Funktsioon MongoDB-ga ühenduse loomiseks
const connectDB = async () => {
    try {
        // Ühendub MongoDB-ga kasutades .env failis määratud ühenduse stringi
        await mongoose.connect(process.env.MONGO)
        console.log('MongoDB connected');        
    } catch (err) {
        // Kuvab vea korral veateate
        console.log(err);
    }
};

export default connectDB;
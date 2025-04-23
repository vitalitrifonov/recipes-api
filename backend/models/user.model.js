import { Schema } from "mongoose";
import mongoose from "mongoose";

// Kasutaja skeem MongoDB jaoks
const userSchema = new Schema(
  {
    // Clerk'i kasutaja ID (unikaalne)
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    // Kasutajanimi (unikaalne)
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // Kasutaja e-posti aadress (unikaalne)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Profiilipildi URL
    img: {
      type: String,
    },
    // Kasutaja poolt salvestatud retseptide ID-de massiiv
    savedPosts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // Lisab createdAt ja updatedAt väljad automaatselt
);

// Ekspordib mudeli nimega "User"
export default mongoose.model("User", userSchema);
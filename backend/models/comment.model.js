import { Schema } from 'mongoose';
import mongoose from 'mongoose';

// Kommentaari skeem MongoDB jaoks
const commentSchema = new Schema({
        // Viide kasutajale, kes kommentaari kirjutas
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // Viide postitusele, millele kommentaar kuulub
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        // Kommentaari tekstiline sisu
        desc: {
            type: String,
            required: true,
        },
    }, 
    { timestamps: true } // Lisab automaatselt createdAt ja updatedAt väljad
);

// Ekspordib mudeli nimega "Comment"
export default mongoose.model('Comment', commentSchema);
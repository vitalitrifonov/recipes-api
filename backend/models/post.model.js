import { Schema } from 'mongoose';
import mongoose from 'mongoose';

// Retsepti (postituse) skeem MongoDB jaoks
const postSchema = new Schema({
        // Viide kasutajale, kes postituse lõi
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // Retsepti pilt (URL)
        img: {
            type: String,
        },
        // Retsepti pealkiri
        title: {
            type: String,
            required: true
        },
        // SEO-sõbralik URL-i osa (unikaalne)
        slug: {
            type: String,
            required: true,
            unique: true
        },
        // Retsepti lühikirjeldus
        desc: {
            type: String
        },
        // Kategooria, nt "Magustoit", "Pearoog" vms
        category: {
            type: String,
            default: 'Uncategorized',
        },
        // Retsepti sisu (täistekst)
        content: {
            type: String,
            required: true
        },
        // Kas retsept on esile tõstetud (esilehe jaoks)
        isFeatured: {
            type: Boolean,
            default: false
        },
        // Külastuste arv
        visit: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true } // Lisab createdAt ja updatedAt väljad automaatselt
);

// Ekspordib mudeli nimega "Post"
export default mongoose.model('Post', postSchema);
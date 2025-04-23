import express from "express"
import { addComment, deleteComment, getPostComments } from "../controllers/comment.controller.js" // Kommentaaride kontrollerid

const router = express.Router()

// Tagastab kõik kommentaarid, mis on seotud konkreetse retseptiga (postitusega)
router.get("/:postId", getPostComments)
// Lisab kommentaari konkreetsele retseptile
router.post("/:postId", addComment)
// Kustutab konkreetse kommentaari ID alusel
router.delete("/:id", deleteComment)

export default router
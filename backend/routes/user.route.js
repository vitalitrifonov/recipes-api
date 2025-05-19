import express from "express"
import { getUserSavedPosts, savePost, getUserSavedPostsFull } from "../controllers/user.controller.js" // Kontrollerid kasutaja salvestatud retseptide jaoks

const router = express.Router()

// Tagastab kasutaja salvestatud retseptid (lemmikud)
router.get("/saved", getUserSavedPosts)
// Lisab või eemaldab retsepti kasutaja lemmikute seast
router.patch("/save", savePost)
// Tagastab kasutaja salvestatud retseptid koos andmetega
router.get("/saved/full", getUserSavedPostsFull);

export default router
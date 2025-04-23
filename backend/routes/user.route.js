import express from "express"
import { getUserSavedPosts, savePost } from "../controllers/user.controller.js" // Kontrollerid kasutaja salvestatud retseptide jaoks

const router = express.Router()

// Tagastab kasutaja salvestatud retseptid (lemmikud)
router.get("/saved", getUserSavedPosts)
// Lisab või eemaldab retsepti kasutaja lemmikute seast
router.patch("/save", savePost)

export default router
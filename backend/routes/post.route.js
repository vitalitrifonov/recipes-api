import express from 'express'
import { getPosts, getPost, createPost, deletePost, uploadAuth } from '../controllers/post.controller.js' // Postituste kontrollerid

const router = express.Router();

// Pildi üleslaadimise autoriseerimise endpoint (ImageKit)
router.get('/upload-auth', uploadAuth);

// Kõigi retseptide (postituste) päring
router.get('/', getPosts);
// Ühe konkreetse retsepti päring slug'i alusel
router.get('/:slug', getPost);
// Uue retsepti (postituse) loomine
router.post('/', createPost);
// Retsepti kustutamine ID alusel
router.delete('/:id', deletePost);


export default router
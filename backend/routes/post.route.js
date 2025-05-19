import express from 'express'
import { getPosts, getPost, createPost, deletePost, uploadAuth, featurePost } from '../controllers/post.controller.js' // Postituste kontrollerid
import increaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

// Pildi üleslaadimise autoriseerimise endpoint (ImageKit)
router.get('/upload-auth', uploadAuth);

// Kõigi retseptide (postituste) päring
router.get('/', getPosts);
// Ühe konkreetse retsepti päring slug'i alusel, kõigepealt käivitab middleware 'increaseVisit', mis suurendab postituse külastuste arvu
// Seejärel käivitab route handler 'getPost', mis tagastab vastava postituse andmed
router.get('/:slug', increaseVisit, getPost);
// Uue retsepti (postituse) loomine
router.post('/', createPost);
// Retsepti kustutamine ID alusel
router.delete('/:id', deletePost);
// Retsepti esile tõstmine (feature)
router.patch("/feature", featurePost);


export default router
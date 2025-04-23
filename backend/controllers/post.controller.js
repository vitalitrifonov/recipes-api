import ImageKit from 'imagekit'; // ImageKit'i teek piltide üleslaadimiseks
import Post from '../models/post.model.js'; // Postituse mudel (retsepti mudel)
import User from '../models/user.model.js'; // Kasutaja mudel

// Funktsioon, et saada kõik postitused (retseptid) - ei nõua autentimist
export const getPosts = async (req, res) => {
    // Otsime kõik postitused andmebaasist
    const posts = await Post.find()
    // Tagastame postitused JSON formaadis
    res.status(200).json(posts)
}

// Funktsioon, et saada konkreetne postitus (retsept) - ei nõua autentimist
export const getPost = async (req, res) => {
    // Otsime postitust slug järgi (slug on postituse unikaalne identifikaator)
    const post = await Post.findOne({ slug: req.params.slug });
    // Tagastame postituse andmed
    res.status(200).json(post)
}

// Funktsioon, et luua uus postitus (retsept) - nõuab autentimist
export const createPost = async (req, res) => {
    const clerkUserId = req.auth.userId; // Kasutaja ID autentimisest

    // Kui kasutaja ei ole autentitud, tagastame veateate
    if (!clerkUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Otsime kasutajat andmebaasist
    const user = await User.findOne({ clerkUserId })

    // Kui kasutajat ei leita, tagastame veateate
    if (!user) {
        return res.status(401).json({ message: 'User not found!' });
    }

    // Loome slug (unikaalne URL osa) postituse pealkirjast
    let slug = req.body.title.replace(/ /g, '-').toLowerCase();

    // Kontrollime, kas postitus sama slug'iga juba eksisteerib
    let existingPost = await Post.findOne({ slug });

    let counter = 2;

    // Kui postitus eksisteerib, lisame numbreid, et slug oleks unikaalne
    while (existingPost) {
        slug = `${slug}-${counter}`;
        existingPost = await Post.findOne({ slug });
        counter++;
    }

    // Loome uue postituse ja salvestame selle andmebaasi
    const newPost = new Post({ user: user._id, slug, ...req.body });
    const post = await newPost.save();
    // Tagastame loodud postituse andmed
    res.status(200).json(post);
};

// Funktsioon, et kustutada postitus (retsept) - nõuab autentimist
export const deletePost = async (req, res) => {
    const clerkUserId = req.auth.userId; // Kasutaja ID
  
    // Kui kasutaja ei ole autentitud, tagastame veateate
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }
  
    // Kontrollime kasutaja rolli (kasutaja või administraator)
    const role = req.auth.sessionClaims?.metadata?.role || "user";
  
    // Kui kasutajal on administraatori roll, saab ta kõiki postitusi kustutada
    if (role === "admin") {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("Post has been deleted with admin role");
    }
  
    // Kui kasutaja ei ole administraator, saab ta ainult oma postitusi kustutada
    const user = await User.findOne({ clerkUserId });
  
    // Otsime postitust, mille on loonud konkreetne kasutaja
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      user: user._id,
    });
  
    // Kui postitust ei leita, tagastame veateate
    if (!deletedPost) {
      return res.status(403).json("You can delete only your posts!");
    }
  
    // Kui postitus on kustutatud, tagastame edukas vastuse
    res.status(200).json("Post has been deleted");
};

// Funktsioon piltide üleslaadimiseks kasutades ImageKit'i
const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT, // URL ImageKit teenuse jaoks
    publicKey: process.env.IK_PUBLIC_KEY, // ImageKit avalik võti
    privateKey: process.env.IK_PRIVATE_KEY, // ImageKit privaatne võti
  });
  
// Funktsioon piltide üleslaadimise autentimisvõtmete saamiseks
export const uploadAuth = async (req, res) => {
    // Saame autentimisvõtmed ImageKit'ist
    const result = imagekit.getAuthenticationParameters();
    // Tagastame tulemuse
    res.send(result);
};
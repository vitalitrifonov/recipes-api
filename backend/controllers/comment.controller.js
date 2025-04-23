import Comment from "../models/comment.model.js"; // Kommentaari mudel
import User from "../models/user.model.js"; // Kasutaja mudel

// Funktsioon, et saada kõik kommentaarid postitusele (retseptile) - ei nõua autentimist
export const getPostComments = async (req, res) => {
  // Otsime kommentaare, mis on seotud antud postitusega (retseptiga)
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img") // Populeerime kasutaja andmed (nimi ja pilt)
    .sort({ createdAt: -1 }); // Sorteerime kommentaarid loomiskuupäeva järgi kahanevas järjekorras

  // Tagastame kommentaarid JSON formaadis
  res.json(comments);
};

// Funktsioon, et lisada kommentaar postitusele (retseptile) - nõuab autentimist
export const addComment = async (req, res) => {
  const clerkUserId = req.auth.userId; // Kasutaja ID autentimisest
  const postId = req.params.postId; // Postituse (retsepti) ID

  // Kui kasutaja ei ole autentitud, tagastame veateate
  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  // Otsime kasutajat andmebaasist
  const user = await User.findOne({ clerkUserId });

  // Loome uue kommentaari
  const newComment = new Comment({
    ...req.body, // Kommentaari andmed (tekst)
    user: user._id, // Seome kommentaari kasutajaga
    post: postId, // Seome kommentaari postitusega (retseptiga)
  });

  // Salvestame kommentaari andmebaasi
  const savedComment = await newComment.save();

  // Tagastame salvestatud kommentaari
  res.status(201).json(savedComment);
};

// Funktsioon, et kustutada kommentaar - nõuab autentimist
export const deleteComment = async (req, res) => { 
  const clerkUserId = req.auth.userId; // Kasutaja ID
  const id = req.params.id; // Kommentaari ID

  // Kui kasutaja ei ole autentitud, tagastame veateate
  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  // Kontrollime kasutaja rolli (kasutaja või administraator)
  const role = req.auth.sessionClaims?.metadata?.role || "user";

  // Kui kasutajal on administraatori roll, saab ta kõiki kommentaare kustutada
  if (role === "admin") {
    await Comment.findByIdAndDelete(id); // Kustutame kommentaari
    return res.status(200).json("Comment has been deleted with admin role");
  }

  // Otsime kasutajat andmebaasist
  const user = await User.findOne({ clerkUserId });

  // Kui kasutajat ei leita, tagastame veateate
  if (!user) {
    return res.status(404).json("User not found!");
  }

  // Otsime kommentaari, mille on postitanud konkreetne kasutaja
  const deletedComment = await Comment.findOneAndDelete({
    _id: id,
    user: user._id, // Kontrollime, et kommentaari on postitanud just see kasutaja
  });

  // Kui kommentaari ei leita, tagastame veateate
  if (!deletedComment) {
    return res.status(403).json("You can delete only your comment!");
  }

  // Kui kommentaar on kustutatud, tagastame edukas vastuse
  res.status(200).json("Comment deleted");
};
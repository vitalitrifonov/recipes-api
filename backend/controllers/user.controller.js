import User from "../models/user.model.js"; // Kasutaja mudel

// Funktsioon, et saada kasutaja salvestatud postitused
export const getUserSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId; // Saame kasutaja ID, mis on autentimisega seotud

  // Kui kasutaja ei ole autentitud, tagastatakse viga
  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  // Otsime kasutaja andmebaasist
  const user = await User.findOne({ clerkUserId });

  // Tagastame kasutaja salvestatud postitused
  res.status(200).json(user.savedPosts);
};

// Funktsioon, et salvestada või eemaldada postitus kasutaja salvestatud postitustest
export const savePost = async (req, res) => {
  const clerkUserId = req.auth.userId; // Saame kasutaja ID
  const postId = req.body.postId; // Saame postituse ID, mis on lisatud või eemaldatud

  // Kui kasutaja ei ole autentitud, tagastatakse viga
  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  // Otsime kasutaja andmebaasist
  const user = await User.findOne({ clerkUserId });

  // Kontrollime, kas postitus on juba salvestatud
  const isSaved = user.savedPosts.some((p) => p === postId);

  // Kui postitus ei ole salvestatud, lisame selle salvestatud postituste nimekirja
  if (!isSaved) {
    await User.findByIdAndUpdate(user._id, {
      $push: { savedPosts: postId },
    });
  } else {
    // Kui postitus on juba salvestatud, eemaldame selle salvestatud postituste nimekirjast
    await User.findByIdAndUpdate(user._id, {
      $pull: { savedPosts: postId },
    });
  }

  // Tagastame vastuse, kas postitus on salvestatud või eemaldatud
  res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
};
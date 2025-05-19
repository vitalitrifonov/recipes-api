import Post from "../models/post.model.js";
// Middleware funktsioon, mis suurendab postituse "visit" (külastuste) arvu ühe võrra
const increaseVisit = async (req, res, next) => {
  const slug = req.params.slug; // Võtame URL-ist postituse unikaalse identifikaatori (slug)
  // Otsime postitust slug järgi ja suurendame välja "visit" väärtust 1 võrra
  await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });

  next(); // Kutsume järgmise middleware või route handleri välja
};

export default increaseVisit;
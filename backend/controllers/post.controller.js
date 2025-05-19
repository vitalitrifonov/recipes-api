import ImageKit from 'imagekit'; // ImageKit'i teek piltide üleslaadimiseks
import Post from '../models/post.model.js'; // Postituse mudel (retsepti mudel)
import User from '../models/user.model.js'; // Kasutaja mudel

// Funktsioon, et saada kõik postitused (retseptid) - ei nõua autentimist
export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Praegune leht, vaikimisi 1
  const limit = parseInt(req.query.limit) || 2; // Maksimaalne postituste arv ühelt lehelt, vaikimisi 2

  // Koostame päringuobjekti postituste filtreerimiseks
  const query = {};
  
  const cat = req.query.cat; // Kategooria filter URL-st
  const author = req.query.author; // Autori filter URL-st
  const searchQuery = req.query.search; // Otsingusõna filter URL-st
  const sortQuery = req.query.sort; // Sorteerimise parameeter URL-st
  const featured = req.query.featured; // Esile tõstetud postituste filter URL-st

  if (cat) {
    query.category = cat; // Kui kategooria on määratud, filtreerime selle järgi
  }

  if(searchQuery) {
    // Otsime postitusi, mille pealkiri sisaldab otsingusõna, tõstetud suur- ja väiketähtedest sõltumata
    query.title = { $regex: searchQuery, $options: 'i' };
  }

  if (author) {
    // Kui on antud autor, otsime tema kasutaja ID
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      // Kui kasutajat ei leita, tagastame veateate
      return res.status(404).json('User not found!');
    }

    query.user = user._id; // Filtreerime postitused selle kasutaja ID järgi
  }
  // Vaikimisi sorteerimine - uusimad postitused ees
  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    // Sorteerime vastavalt kasutaja valikule
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        // Trendikad postitused viimase 7 päeva jooksul
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true; // Kui esile tõstetud filter on sees, otsime ainult neid
  }

  // Teostame päringu postituste leidmiseks
  const posts = await Post.find(query)
    // Lisame kasutaja nime info iga postituse juurde
    .populate('user', 'username')
    // Rakendame sorteerimise
    .sort(sortObj)
    // Piirame postituste arvu ühe lehe kohta 
    .limit(limit)   
    // Jätame vahele juba näidatud postitused (leheküljendus)               
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments(query); // Loendame kõik postitused andmebaasis (kõikide postituste koguarv)
  const hasMore = page * limit < totalPosts; // Arvutame, kas on veel postitusi, mida laadida (kas on järgmine leht)

  // Tagastame leitud postitused ja info, kas on rohkem postitusi saadaval
  res.status(200).json({ posts, hasMore });
};

// Funktsioon, et saada konkreetne postitus (retsept) - ei nõua autentimist
export const getPost = async (req, res) => {
    // Otsime postitust slug järgi (slug on postituse unikaalne identifikaator)
    const post = await Post.findOne({ slug: req.params.slug }).populate('user', 'username img'); // Populeerime kasutaja nime ja tema pildi
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
// Funktsioon, et esile tõsta postitus (retsept) - nõuab autentimist admin rolliga
export const featurePost = async (req, res) => {
    const clerkUserId = req.auth.userId; // Kasutaja ID
    const postId = req.body.postId; // Postituse ID
  
    // Kui kasutaja ei ole autentitud, tagastame veateate
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }
  
    // Kontrollime kasutaja rolli (kasutaja või administraator)
    const role = req.auth.sessionClaims?.metadata?.role || "user";
  
    // Kui kasutajal ei ole administraator, ei saa ta retsepti esile tõsta
    if (role !== "admin") {
      return res.status(403).json("Sina ei saa retsepti esile tõsta!");
    }
  
    const post = await Post.findById(postId); // Otsime postitust ID järgi

    // Kui postitust ei leita, tagastame veateate
    if (!post) {
      return res.status(404).json("Retsept ei ole leitud!");
    }

    const isFeatured = post.isFeatured; // Kontrollime, kas postitus on juba esile tõstetud
    // Muudame postituse esile tõstmise staatust
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { isFeatured: !isFeatured },
      { new: true }
    );
      
    // Tagastame postituse andmed
    res.status(200).json(updatedPost);
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
// Webhook kontroller Clerk autentimise jaoks
import User from "../models/user.model.js"; // Kasutaja mudel
import Post from "../models/post.model.js"; // Postituse (retsepti) mudel
import Comment from "../models/comment.model.js"; // Kommentaari mudel
import { Webhook } from "svix"; // Svix teek, mis haldab webhook'ide kontrollimist

// Funktsioon, mis töötab Clerk'i webhookiga
export const clerkWebHook = async (req, res) => {
  console.log("Clerk Webhook: Запрос получен");

  // Webhooki salajane võti .env failist
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // Kui salajane võti puudub, tagastatakse viga
  if (!WEBHOOK_SECRET) {
    console.error("Ошибка: Webhook секрет отсутствует!");
    return res.status(500).json({ message: "Webhook secret needed!" });
  }

  const payload = req.body; // Webhooki andmed
  const headers = req.headers; // Webhooki päised

  // Svix Webhooki objekti loomine ja andmete kontrollimine
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    // Kontrollib, kas webhooki andmed on kehtivad
    evt = wh.verify(payload, headers);
    console.log("Webhook проверен:", evt.type);
  } catch (err) {
    // Kui kontrollimine ebaõnnestub, tagastatakse viga
    console.error("Ошибка верификации Webhook:", err);
    return res.status(400).json({ message: "Webhook verification failed!" });
  }

  console.log("👤 Пользовательские данные:", evt.data);

  try {
    // Kui kasutaja on loodud
    if (evt.type === "user.created") {
      console.log("Создание нового пользователя:", evt.data.id);

      // Uue kasutaja loomine andmete põhjal
      const newUser = new User({
        clerkUserId: evt.data.id,
        username: evt.data.username || evt.data.email_addresses?.[0]?.email_address,
        email: evt.data.email_addresses?.[0]?.email_address,
        img: evt.data.image_url,
      });

      await newUser.save(); // Salvestab uue kasutaja andmebaasi
      console.log("Пользователь создан:", newUser);
    }

    // Kui kasutaja on uuendatud
    if (evt.type === "user.updated") {
      console.log("Обновление пользователя:", evt.data.id);

      const updatedUser = await User.findOneAndUpdate(
        { clerkUserId: evt.data.id },
        {
          username: evt.data.username || evt.data.email_addresses?.[0]?.email_address,
          email: evt.data.email_addresses?.[0]?.email_address,
          img: evt.data.image_url,
        },
        { new: true }
      );

      console.log("Пользователь обновлён:", updatedUser);
    }

    // Kui kasutaja on kustutatud
    if (evt.type === "user.deleted") {
      console.log("Удаление пользователя:", evt.data.id);

      // Otsib ja kustutab kasutaja andmebaasist
      const deletedUser = await User.findOneAndDelete({ clerkUserId: evt.data.id });

      // Kui kasutaja on leitud, kustutatakse ka tema postitused ja kommentaarid
      if (deletedUser) {
        console.log("Пользователь найден и удален:", deletedUser._id);
        await Post.deleteMany({ user: deletedUser._id });
        await Comment.deleteMany({ user: deletedUser._id });
        console.log("Связанные посты и комментарии удалены");
      } else {
        console.warn("Пользователь не найден:", evt.data.id);
      }
    }

    // Kui kõik läks hästi, tagastatakse edukas vastus
    return res.status(200).json({ message: "Webhook обработан успешно" });
  } catch (err) {
    // Kui tekib viga webhooki töötlemisel, tagastatakse viga
    console.error("Ошибка обработки Webhook:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
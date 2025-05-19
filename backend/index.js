// node --watch --env-file .env index.js
// ngrok http http://localhost:3000 – kasutatakse Clerk'iga testimiseks, kuna Clerk ei toeta localhost'i. 
// Kontrollida url, sisestada clerk endpontisse, et saaks kasutada localhost'i
import dotenv from 'dotenv';
dotenv.config(); // Laetakse .env failist keskkonnamuutujad
import express from 'express' // Express serveri raamistik
import connectDB from './lib/connectDB.js' // MongoDB ühenduse funktsioon
import userRouter from './routes/user.route.js' // Kasutajatega seotud päringute marsruut
import postRouter from './routes/post.route.js' // Retseptidega seotud päringute marsruut
import commentRouter from './routes/comment.route.js' // Kommentaaridega seotud päringute marsruut
import webHookRouter from './routes/webhook.route.js' // Clerk veebikonksude (webhook'ide) marsruut
import { clerkMiddleware, requireAuth } from '@clerk/express' // Clerk autentimise middleware’id
import cors from 'cors' // CORS-i (Cross-Origin Resource Sharing) tugi


const app = express();
// CORS-i seadistamine – lubab kõik päringud
app.use(cors(process.env.CLIENT_URL));
// Clerk autentimise middleware – kontrollib kasutaja identiteeti
app.use(clerkMiddleware());
// Clerk webhook marsruut – kuulab Clerk’i saadetud sündmusi (nt registreerimine, kustutamine)
app.use('/webhooks', webHookRouter)

// JSON andmete töötlemine päringutes
app.use(express.json());

// Lubab CORS-i (Cross-Origin Resource Sharing), vajalik näiteks pilditeenuse (ImageKit) jaoks
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Kasutajate, postituste (retseptide) ja kommentaaride marsruudid
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter)


// Veakäsitleja – püüab kinni kõik serveripoolsed vead
app.use((error, req, res, next) => {
    res.status(error.status || 500);

    res.json({
        message: error.message || 'Something broke!',
        status: error.status,
        stack: error.stack,
    });
});

// Serveri käivitamine – kuulab pordil 3000
app.listen(3000, () => {
    connectDB() // Ühendab MongoDB andmebaasiga
    console.log('Server is running on port 3000');
})
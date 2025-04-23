// webhook marsruut Clerk autentimise jaoks
import express from 'express'
import { clerkWebHook } from '../controllers/webhook.controller.js' // Webhook'i käsitlev kontroller
import bodyParser from "body-parser";

const router = express.Router();

// Clerk'i webhook – kuulab sündmusi nagu kasutaja registreerimine, kustutamine jne
// Kasutatakse Svix teeki, mis nõuab raw body-parser'it
router.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebHook)

export default router
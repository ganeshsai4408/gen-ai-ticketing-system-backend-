import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {serve} from "inngest/express";
import userRoutes from './routes/user.js';
import ticketRoutes from './routes/ticket.js';
import {inngest} from './inngest/client.js'; // Assuming inngest.js is set up correctly
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import dotenv from "dotenv"; // ES Modules way

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [onUserSignup, onTicketCreated],

    })
)

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}).catch(err => {
    console.error("MongoDB connection error:", err);
});   
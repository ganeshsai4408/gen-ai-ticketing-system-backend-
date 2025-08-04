import express from 'express';
import {UpdateUser, getUsers, login,logout, signup, deleteUser} from "../controllers/user.js"
import {authenticate} from "../middlewares/auth.js";

const router = express.Router();
router.post("/update-user", authenticate, UpdateUser);
router.get("/users", authenticate, getUsers);
router.delete("/users/:email", authenticate, deleteUser);

router.post("/signup",  signup)
router.post("/login",login)
router.post("/logout",logout)
export default router

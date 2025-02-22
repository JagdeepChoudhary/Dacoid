import { Router } from "express";
import { register, login, logout } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
// router.get("/me", me);

export default router;
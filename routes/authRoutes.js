import { Router } from "express";
import { auth } from "../controllers/authController.js";

const authRouter = Router();




authRouter.post('/register', auth.register);
authRouter.post('/login', auth.login);








export {authRouter};


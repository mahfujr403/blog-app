import { Router } from "express";
import { auth } from "../controllers/authController.js";
import { authentication } from "../middlewares/authMiddleware.js";

const authRouter = Router();


authRouter.post('/register', auth.register);
authRouter.post('/login', auth.login);
authRouter.get('/me', authentication.verifyUser, auth.me);




export {authRouter};


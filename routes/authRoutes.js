import { Router } from "express";

const authRouter = Router();

// Sample route for user login
authRouter.get('/login', (req, res) => {
  res.send('User login');
});

export {authRouter};


import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { blog } from "../controllers/blogController.js";

const blogRouter = Router();

blogRouter.post('/create', authentication.verifyUser, blog.createPost);
blogRouter.get('/posts', blog.getAllPosts);






export {blogRouter};
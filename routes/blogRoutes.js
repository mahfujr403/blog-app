import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { blog } from "../controllers/blogController.js";

const blogRouter = Router();

blogRouter.post('/create', authentication.verifyUser, blog.createPost);
blogRouter.get('/', blog.getAllPosts);
blogRouter.get('/:id', blog.getPostById);
blogRouter.get('/search', blog.searchBlog);
blogRouter.put('/:id', authentication.verifyUser, blog.updatePost);
blogRouter.delete('/:id', authentication.verifyUser, blog.deletePost);






export {blogRouter};
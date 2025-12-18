import { Router } from "express";

const blogRouter = Router();

// Sample route for getting all blog posts
blogRouter.get('/blog', (req, res) => {
  res.send('List of all blog posts');
});

export {blogRouter};
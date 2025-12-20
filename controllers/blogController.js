import { Blog } from "../models/blogModel.js";

const blog = {};

const inputValidator = (data = {}) => {
    const errors = {};

    const title = typeof data.title === 'string' ? data.title.trim() : '';
    if (!title) {
        errors.title = 'Title is required.';
    } else if (title.length < 5) {
        errors.title = 'Title must be at least 5 characters long.';
    }

    const content = typeof data.content === 'string' ? data.content.trim() : '';
    if (!content) {
        errors.content = 'Content is required.';
    } else if (content.length < 10) {
        errors.content = 'Content must be at least 10 characters long.';
    }

    if (data.category) {
        if (typeof data.category !== 'string') {
            errors.category = 'Category must be a string.';
        }
    }

    if (typeof data.isPublished !== 'boolean') {
        errors.isPublished = 'isPublished must be a boolean.';
    }


    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}


blog.createPost = async (req, res) => {
    try {
        const { title, content, category, isPublished } = req.body;

        const { isValid, errors } = inputValidator({ title, content, category, isPublished });
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        const newPost = new Blog ({title, content, category, isPublished, author: req.userId})
        await newPost.save();

        const postResponse = {
            title: newPost.title,
            content: newPost.content,
            category: newPost.category,
            isPublished: newPost.isPublished,
            author: newPost.author
        };

        res.status(201).json({ 
            success: true, 
            message: "Blog post created successfully", 
            data: postResponse 
        });


    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

blog.getAllPosts = async (req, res) => {
    try {
        const blogs = await Blog.find().select('title content category isPublished author');
        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs: blogs
        })
        
    } catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}


blog.getPostById = async (req, res) =>{
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id).select('title content category isPublished author -_id')

        if(!blog){
            return  res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }
        res.status(200).json({
            success: true,
            blog,
        });

    } catch (error) {
        console.error('Get post by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

blog.updatePost = async (req, res) =>{
    try {
        const {id} = req.params;
        const {userId} = req;

        const { title, content, category, isPublished } = req.body;
        const { isValid, errors } = inputValidator({ title, content, category, isPublished });

        if (!isValid) {
            return res.status(400).json({ errors });
        }


        const blog = await Blog.findById(id);
        // console.log(blog);
        if(blog.author.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog post"
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, 
            { title, content, category, isPublished }, 
            { new: true }
        ).select('title content category isPublished author');

        if(!updatedBlog){
            return  res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog post updated successfully",
            updatedBlog,
        });
        
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

blog.deletePost = async (req, res) =>{
    try {
        const {id} = req.params;

        const blog = await Blog.findById(id);
        if(blog.author.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog post"
            });
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if(!deletedBlog){
            return  res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog post deleted successfully",
            deletedBlog,
        });

    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

blog.searchBlog = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }

        const filter = {
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { content: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } }
            ]}

        const blogs = await Blog.find(filter).select('title content category isPublished author');

        res.status(200).json({
            success: true,
            count: blogs.length,
            keyword: keyword,
            blogs: blogs
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}


export { blog };
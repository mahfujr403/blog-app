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

        const newPost = new Blog ({title, content, category, isPublished, author: req.userId});
        await newPost.save();

        res.status(201).json({ 
            success: true, 
            message: "Blog post created successfully", 
            data: newPost 
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
        const blogs = await Blog.find().select('title content _id');
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
        const blog = await Blog.findById(id).select('title content -_id')

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

export { blog };
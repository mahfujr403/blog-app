import {User} from "../models/userModel.js";
import jwt from "jsonwebtoken";

const auth = {}


const inputValidator = (data = {}, requiredFields = ['email', 'password']) => {
    const errors = {};

    if (requiredFields.includes('name')) {
        const name = typeof data.name === 'string' ? data.name.trim() : '';
        if (!name) {
            errors.name = 'Name is required.';
        } else if (name.length < 3) {
            errors.name = 'Name must be at least 3 characters long.';
        }
    }

    if (requiredFields.includes('email')) {
        const email = typeof data.email === 'string' ? data.email.trim() : '';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = 'Email is required.';
        } else if (!emailPattern.test(email)) {
            errors.email = 'Email must be valid.';
        }
    }

    if (requiredFields.includes('password')) {
        const password = typeof data.password === 'string' ? data.password.trim() : '';
        if (!password) {
            errors.password = 'Password is required.';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        }
    }

    return { 
        valid: Object.keys(errors).length === 0, 
        errors 
    };
};

 

auth.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { valid, errors } = inputValidator({ email, password });
    if (!valid) {
        return res.status(400).json({ errors: errors });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ errors: { email: 'Email not found.' } });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ errors: { password: 'Incorrect password.' } });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
        message: 'Login successful', 
        user: { name: user.name, email: user.email },
        token : token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
}


auth.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const { valid, errors } = inputValidator({ name, email, password }, ['name', 'email', 'password']);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errors: { email: 'Email is already registered.' } });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: { name, email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
}


auth.me = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('name email createdAt');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });

    } catch (error) {
        console.error('Fetch user error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export {auth};
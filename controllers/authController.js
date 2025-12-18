import {User} from "../models/userModel.js";
import mongoose from "mongoose";

const auth = {}


const inputValidator = (data = {}) => {
    const errors = {};

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) {
        errors.name = 'Name is required.';
    } else if (name.length < 3) {
        errors.name = 'Name must be at least 3 characters long.';
    }

    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = 'Email is required.';
    } else if (!emailPattern.test(email)) {
        errors.email = 'Email must be valid.';
    }

    const password = typeof data.password === 'string' ? data.password.trim() : '';
    if (!password) {
        errors.password = 'Password is required.';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
    }

    return { valid: Object.keys(errors).length === 0, errors };
};

 

auth.login = (req, res) => {
  res.send('User login');
}


auth.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const { valid, errors } = inputValidator({ name, email, password });
        if (!valid) {
            return res.status(400).json({ errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errors: { email: 'Email is already registered.' } });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).send('User registered successfully');

        
    } catch (error) {
        res.status(500).send('Server error');
    }
}


auth.me = (req, res) => {
  res.send('User profile');
}

export {auth};
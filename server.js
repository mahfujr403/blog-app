import express from 'express';
import dotenv from 'dotenv';

import {blogRouter} from './routes/blogRoutes.js';
import {authRouter} from './routes/authRoutes.js';
import {Database} from './config/db.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

Database.connectDB();
app.use('/api', blogRouter);
app.use('/api', authRouter);



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
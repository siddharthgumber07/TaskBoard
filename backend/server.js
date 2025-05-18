import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' }); 

import { connectDB } from './db/db.js';
import taskRoutes from './routes/task.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());  

// Routes
app.use('/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send('Task Board API is running');
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

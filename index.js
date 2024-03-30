
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './Database/DB_config.js';
import StudentMenterRouter from './Routers/routers.js';

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
connectDB();

app.use('/', StudentMenterRouter);

app.listen(port, ()=>{
    console.log(`Server connected http://localhost:${port}`);
});
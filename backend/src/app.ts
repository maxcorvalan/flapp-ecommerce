import express from 'express';
import cors from 'cors';
import cartRouter from './routes/cartRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', cartRouter);

export default app;
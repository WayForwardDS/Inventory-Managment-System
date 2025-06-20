import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import rootRouter from './routes';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorhandler';

const app: Application = express();

// ✅ Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://imsrevenspire.netlify.app'
];

// ✅ Improved CORS config with dynamic origin checking
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());
app.use(morgan('dev'));

// ✅ Application routes
app.use('/api/v1', rootRouter);

// ✅ Health check route (optional but useful)
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ✅ Global error handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;

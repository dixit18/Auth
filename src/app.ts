import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import './jobs/activateUsers'

dotenv.config();

const app = express();

app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/', healthRoutes);

const isProd = process.env.NODE_ENV === 'production';
const routesGlob = isProd
  ? path.join(__dirname, 'routes', '*.js')
  : path.join(__dirname, 'routes', '*.ts');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SeePossible API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [routesGlob],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});


export default app; 
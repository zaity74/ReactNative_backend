import express from 'express';
import dotenv from 'dotenv';
import dbConnect from '../config/dbConnect.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import bookRouter from '../routes/bookRoutes.js';


dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Database connexion 
dbConnect();



const allowedOrigins = [
    'http://localhost:8082', 
    'http://localhost:8081'
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      // Check if the origin is allowed
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  };
  
  app.use(cors(corsOptions));

app.use('/api/v1/books/', bookRouter);

// MIDDLEWARE
app.use(notFound);
app.use(globalErrHandler);
export default app;
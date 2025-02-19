import routes from './routes/routes';
import dotenv from 'dotenv';

dotenv.config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.listen(5000);
module.exports = app;

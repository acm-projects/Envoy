require('colors');
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Disable "X-Powered-By" headers for security
app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

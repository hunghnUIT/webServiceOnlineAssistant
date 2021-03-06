const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const multer = require('multer');

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

const connectDB = require('./config/db');

// Load env
dotenv.config({path: './config/config.env'})

// Connect to DB
connectDB();

const app = express();

// Body Parser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(multer().array()); // for parsing application/form-data

// Cookie Parser
app.use(cookieParser());

// Mongo sanitize => Prevent mongodb ejections
app.use(sanitize()); 

// Set security headers => Add more header to prevent xss attack
app.use(helmet());

// Prevent xss attack
app.use(xss());

// Enable CORS
app.use(cors());

// prevent http params pollution
app.use(hpp());

//Logger only in development mode
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use("/api/v1/users/", userRoute);
app.use("/api/v1/auth/", authRoute);


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));

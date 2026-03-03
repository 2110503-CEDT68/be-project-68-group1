const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const rooms = require('./routes/rooms');
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
  req.query = mongoSanitize.sanitize(req.query);
  req.params = mongoSanitize.sanitize(req.params);
  next();
});

app.use(helmet());

app.use(xss());

app.use(hpp());

app.use(cors());

const limiter = rateLimit({
    windowMs:10*60*1000,
    max: 1000
})

app.use(limiter);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express VacQ API'
    },
    servers: [
        {
            url: 'http://localhost:5003/api/v1'
        }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.set('query parser', 'extended');

app.use('/api/v1/rooms', rooms);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations', reservations);

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, console.log('server runnig in', process.env.NODE_ENV, 'mode on port', PORT));

process.on('unhandleRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})
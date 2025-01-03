const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./src/routes/User');
const folderRoutes = require('./src/routes/Folder');
const formRoutes = require('./src/routes/Form');

const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
dotenv.config();
const allowedOrigins = [
    'https://finalformbot.vercel.app/', // Vercel domain
    //'http://localhost:1000',           // Local development
  ];

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests from any origin (you may want to restrict this to specific domains)
      if (!origin) return callback(null, true); // Allows requests from Postman or other tools without origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true); // Allow the request
      } else {
        return callback(new Error('Not allowed by CORS')); // Block the request
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
    credentials: true,  // If you use cookies or authentication tokens
  }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userRoutes);
app.use(folderRoutes);
app.use(formRoutes);

app.get('/', (req, res) => {
    res.status(200).send({ status: "success", msg: "API is working well." });
})

app.use((req, res, next) => {
    const err = Object.assign(Error("Endpoint not found"), { code: 404 });
    next(err);
})

app.use(errorHandler);

const port = process.env.PORT || 1000
app.listen(port, () => {
    mongoose.connect(process.env.DB_URL).then(() => console.log('Server is running :)')).catch((error) => console.log(error))
})

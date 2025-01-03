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
    'https://finalformbot.vercel.app', // Frontend on Vercel
    'http://localhost:3000',          // Local development
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., Postman or mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies if required
  }));
app.use(bodyParser.urlencoded({ extended: true }));
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

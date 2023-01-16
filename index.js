const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');

const multer = require("multer");

global.__basedir = __dirname;

///Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const initRoutes = require("./routes/upload");

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

///Connect to DB
mongoose.set('strictQuery', true);
mongoose.connect( process.env.DB_CONNECT ,
{ useNewUrlParser: true, useUnifiedTopology: true } 
, (err) => {
    if(!err) console.log('Db Connected');
    else console.log('Db Error');
});


/////Middleware
app.use(express.json());
///////////just Test of UPLOAD
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Incorrect file");
      error.code = "INCORRECT_FILETYPE";
      return cb(error, false)
    }
    cb(null, true);
  }
  
  const upload = multer({
    dest: './uploads',
    fileFilter,
    limits: {
      fileSize: 5000000
    }
  });

  app.post('/api/image-upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
  });
  
  app.use((err, req, res, next) => {
    if (err.code === "INCORRECT_FILETYPE") {
      res.status(422).json({ error: 'Only images are allowed' });
      return;
    }
    if (err.code === "LIMIT_IMAGE_SIZE") {
      res.status(422).json({ error: 'Allow IMAGE size is 500KB' });
      return;
    }
  });

///////////////////////////////////////////////////////////////////////////////////////

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/company', authRoute);
app.use('/api/employer', authRoute);
app.use('/api/posts', postRoute);

///////////////////////////////////////
app.use(express.urlencoded({ extended: true }));


app.listen(3000, () => console.log('Server Up and running'));
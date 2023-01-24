const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');

const multer = require("multer");
////////////////////////////////////////////
var fileExtension = require('file-extension')











////////////////////////////////////////
/*api2
var fs = require('fs');
var path = require('path');
/*var imageModel = require('./model/Image');*/

////////////////////////////////////////

global.__basedir = __dirname;

///Import Routes

/////////////////////test 23/01/2023
const testRoute = require('./routes/routes');



const authRoute = require('./routes/auth');


const postRoute = require('./routes/posts');

const initRoutes = require("./routes/upload");

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
////////////////////////////////test 23/01/2023

//////////////////////////////////


///Connect to DB
require("dotenv").config();
const connection = require("./db");
connection();
/*
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser: true,
     useUnifiedTopology: true }
  , (err) => {
    if (!err) console.log('Db Connected');
    else console.log('Db Error');
  });

*/
/////Middleware
app.use(express.json());
////////////////////////////////////////
// Configure Storage
var storage = multer.diskStorage({

  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
});
var upload = multer({
  storage: storage,
  limits: {
      // Setting Image Size Limit to 2MBs
      fileSize: 2000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          //Error 
          cb(new Error('Please upload JPG and PNG images only!'))
      }
      //Success 
      cb(undefined, true)
  }
})
app.post('/uploadfile', upload.single('uploadedImage'), (req, res, next) => {
  const file = req.file
  console.log(req);
  if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
  }
  res.status(200).send({
      statusCode: 200,
      status: 'success',
      uploadedFile: file
  })

}, (error, req, res, next) => {
  res.status(400).send({
      error: error.message
  })
})


// Upload.js



/*

// upload.js


//importing mongoose schema file
const Upload = require("./model/Upload");


//setting options for multer
//const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post("/api/upload", upload.single("file"), async (req, res) => {
  // req.file can be used to access all file properties
  try {
    //check if the request has an image or not
    if (!req.file) {
      res.json({
        success: false,
        message: "You must provide at least 1 file"
      });
    } else {
      let imageUploadObject = {
        file: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        },
        fileName: req.body.fileName
      };
      const uploadObject = new Upload(imageUploadObject);
      // saving the object into the database
      const uploadProcess = await uploadObject.save();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
//////////////////////////////////////////////////
api2
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const imageSchema = new mongoose.Schema({
  image: {
      data: Buffer,
      contentType: String,
      
  },
  date: {
    type: Date,
    default: Date.now
},
});

const ImageModel = mongoose.model("Image", imageSchema);

app.post("/api/uploadPhoto", upload.single("myImage"), (req, res) => {
  const obj = {
      img: {
          data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
          contentType: "image/png"
      }
  }
  const newImage = new ImageModel({
      image: obj.img
  });

  newImage.save((err) => {
      err ? console.log(err) : res.redirect("/");
  });
});

app.get('/', (req, res) => {
  ImageModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('imagesPage', { items: items });
      }
  });
});


////////////////////////////////////////////////
///////////just Test of UPLOAD /*
/*const fileFilter = (req, file, cb) => {
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
  */

///////////////////////////////////////////////////////////////////////////////////////

//Route Middlewares
app.use('/api/employer',testRoute );

app.use('/api/user', authRoute);


app.use('/api/company', authRoute);
app.use('/api/employer', authRoute);
app.use('/api/posts', postRoute);
////////////////////////////////////////
// Make Images "Uploads" Folder Publicly Available
app.use('/uploads/employers', express.static('employers'))
///////////////////////////////////////
app.use(express.urlencoded({ extended: true }));


app.listen(3000, () => console.log('Server Up and running'));
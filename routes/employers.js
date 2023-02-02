const express = require("express");
const router = require('express').Router();
const Joi = require('@hapi/joi');
const { registerEmployerValidation } = require('../validations');

const {ObjectId} = require('mongodb')
const Employer = require('../model/Employer');
const multer = require("multer");



var mongoose = require('mongoose');
// Configure Storage
var storage = multer.diskStorage({

  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
    cb(null, './uploads/employers')
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
    // const fname = file.fieldname + '-' + Date.now() + '.' + file.originalname;
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname) 
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
router.post(`/employerImage`, upload.single("file"), async (req, res) => {
  // console.log(req.files);


  ////////lets validate the data before we a user
  // This is a shorter version
  req.body = {
    ...req.body,
    createdByu: ObjectId(req.body.createdByu), 
    companyBy: ObjectId(req.body.companyBy),
  }
 const { error } = registerEmployerValidation(req.body);
  // Error in response
  if (error) return res.status(400).send(error.details[0].message);

  /////checking if the email of employer is already in the database
  const emailExist = await Employer.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  // console.log(req.file);
  // console.log(req.file.path);


  console.log(req.body);
  const employer = new Employer({
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    city: req.body.city,
    zipcode: req.body.zipcode,
    avatar: 'uploads/employers/'+req.file.filename,
    ///req.file.avatar,

    jobs: {
      level: req.body.level,
      companyjob: req.body.companyjob,
      startdate: req.body.startdate,
      endDate: req.body.endDate,
  },

  /*createdByu: mongoose.Types.ObjectId(req.body.createdByu),*/
            createdByu: {_id : req.body.createdByu}, 
            companyBy: {_id : req.body.companyBy},
  })
  try {
    const savedEmployer = await employer.save();
    res.send(savedEmployer);
    //res.redirect("/");
    


  } catch (err) {
    res.status(400).send(err);

    // res.status(500).json({ message: err.message });
  }
});


// DELETE Employer 
//////api1
router.delete('/delete-employer/:_id', async (req, res, next) => {
  const id = req.params.id
  const deletedData = req.body;
  const options = { new: true };
  try {
    const result = await Employer.findByIdAndDelete(req.params);
    res.send(result)
  } catch (error) {
    // console.log(error.message);
  }
});

//////////////api2
router.patch('/update-employerr/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const delettedData = req.body;
      const options = { new: true };

      const result = await Employer.findByIdAndUpdate(
          id, updatedData, options
      )
      
      res.send(result)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});



///////////////////////////get companies
router.get('/employerList', async (req, res) => {
  try {
      const employerList = await Employer.find()
      if (!employerList) throw new Error('No Employers List found')
      res.status(200).json(employerList)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
});
///////////////////////////get company
router.get('/employerOne/:id', async (req, res) => {
  try {
      const employer = await Employer.findOne({_id:req.params.id})
      if (!employer) throw new Error('No Company found')
      res.status(200).json(employer)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
});
///////////////////////////get company
router.get('/employerCompany/:id', async (req, res) => {
  try {
      const employer = await Employer.find({companyBy:req.params.id})
      if (!employer) throw new Error('No Employer found')
      res.status(200).json(employer)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
});



module.exports = router;
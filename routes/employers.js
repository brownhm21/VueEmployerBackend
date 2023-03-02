const express = require("express");
const router = require('express').Router();
const Joi = require('@hapi/joi');
const { registerEmployerValidation } = require('../validations');

const {ObjectId} = require('mongodb')
const Employer = require('../model/Employer');
const multer = require("multer");

var fs = require('fs');





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
    // companyBy: ObjectId(req.body.companyBy),
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
    avatar: req.file.filename,
    ///req.file.avatar,

    jobs: {
      level: req.body.level,
      companyjob: req.body.companyjob,
      company: req.body.company,
      startdate: req.body.startdate,
      endDate: req.body.endDate,
  },

  /*createdByu: mongoose.Types.ObjectId(req.body.createdByu),*/
            createdByu: {_id : req.body.createdByu}, 
            //companyBy: {_id : req.body.companyBy},
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
router.patch('/update-employerr/:id', upload.single("image"), async (req, res) => {
 
  /////checking if the email of employer is already in the database
  const emailExist = await Employer.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  console.log(req.params)
  console.log(req.body)
  

  
  try {
      const id = req.params.id;


      const updatedData = req.body;
      
    const updateData = Object.assign({},req.body); // Copy req.body in order not to change it
    
    if (req.file) {
      const image = req.file.filename;
      updateData.avatar = image;
  }
   


      const options = { new: true };

      const result = await Employer.findByIdAndUpdate(
          id,  updatedData,options
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
      if (!employer) throw new Error('No Employer found')
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

///////////////////////////get company by user
router.get('/employerCompanyByuser/:id', async (req, res) => {
  try {
      const employer = await Employer.find({createdByu:req.params.id}).populate({ path: 'jobs.company',
      select:
        'companyName companyEmail phoneNumber companyAdress companyCity ' })
      if (!employer) throw new Error('No Employer found')
      res.status(200).json(employer)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
});
///////////////////////////get Employers count by user
router.get('/EmployerUserr/:id', async (req, res) => {
  try {
    const employer = await Employer.find({createdByu:req.params.id}).count()
    if (!employer) throw new Error('No Employer found')
    res.status(200).json(employer)
} catch (error) {
    res.status(500).json({ message: error.message })
}
});
///////////////////////////get Employers count by user Trainees
router.get('/EmployerUserrr/:id', async (req, res) => {
  try {
    
    const employer = await Employer.find({createdByu:req.params.id}).find({"jobs.level" : "Trainee"}).count()
    if (!employer) throw new Error('No Employer found')
    res.status(200).json(employer)
} catch (error) {
    res.status(500).json({ message: error.message })
}
});
///////////////////////////get Employers count by user Working Student
router.get('/EmployerUserrrr/:id', async (req, res) => {
  try {
    
    const employer = await Employer.find({createdByu:req.params.id}).find({"jobs.level" : "Working Student"}).count()
    if (!employer) throw new Error('No Employer found')
    res.status(200).json(employer)
} catch (error) {
    res.status(500).json({ message: error.message })
}
});

///////////////////////////get employers count
router.get('/employerCountt/:id',async(req, res) =>{
  try {
    const employer = await Employer.find({companyBy:req.params.id})
    if (!employer) throw new Error('No Employer found')
    res.status(200).json(employer)
} catch (error) {
    res.status(500).json({ message: error.message })
}
});
///////////////////////////get employers count by Id
router.get('/employerCount',(req, res) =>{
  try{
    Employer.count( {}, function(err, result){

      if(err){
          res.send(err)
      }
      else{
          res.json(result)
      }

 })
  }catch (error) {
    res.status(500).json({ message: error.message })
}
});

///////////////////////////get Trainee count
router.get('/employerCountOfTrainee',(req, res) =>{
  try{
    Employer.count( { }, function(err, result){

      if(err){
          res.send(err)
      }
      else{
          res.json(result)
      }

 })
  }catch (error) {
    res.status(500).json({ message: error.message })
}
});
/////////////////////////Update Employer
router.patch('/update-Employer/:id',upload.single("file") ,async (req, res) => {


  /////checking if the email of employer is already in the database
  const emailExist = await Employer.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');
  console.log(req.params)
  console.log(req.body)
  req.body = {
    ...req.body,
     
    companyBy: ObjectId(req.body.companyBy),
  }


  
  try {
      const id = req.params.id;


      const updatedData = req.body;


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
/////////////////////////////////Update Employer 2
router.put('/update-Employer2/:id',  async (req, res, next) => {

  req.body = {
    ...req.body,
     
    companyBy: ObjectId(req.body.companyBy),
  }
 

  // /////checking if the email of employer is already in the database
  // const emailExist = await Employer.findOne({ email: req.body.email });
  // if (emailExist) return res.status(400).send('Email already exists');




  console.log(req.params)
  const employer = new Employer({
    
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    city: req.body.city,
    zipcode: req.body.zipcode,
    //avatar: req.file.filename,
    ///req.file.avatar,

    jobs: {
      level: req.body.level,
      companyjob: req.body.companyjob,
      startdate: req.body.startdate,
      endDate: req.body.endDate,
  },

  /*createdByu: mongoose.Types.ObjectId(req.body.createdByu),*/ 
            companyBy: {_id : req.body.companyBy},
    
  });
  Employer.updateOne({_id: req.params.id}, employer).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


/////////////////////////test of populate
router.get('/employerOne1/:id', async (req, res) => {
  try {
      const employer = await Employer.findOne({_id:req.params.id}).populate({ path: 'jobs.company',
      select:
        'companyName companyEmail phoneNumber companyAdress companyCity ' })
      if (!employer) throw new Error('No Employer found')
      res.status(200).json(employer)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
});



module.exports = router;
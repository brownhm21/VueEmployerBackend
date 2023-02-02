const express = require("express");
const router = require('express').Router();
const Joi = require('@hapi/joi');
const { registerEmployerValidation } = require('../validations');

const Employer = require('../model/Employer');
const multer = require("multer");

const bodyParser = require("body-parser");
const fs = require("fs");

var mongoose = require('mongoose');



//global.__basedir = __dirname;

const DIR = './uploads/employers';
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
      },
      filename: (req, file, cb) => {
        const fileNamek = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileNamek)
      }
});

var upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5
    // },
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
}).single('file');

router.post('/addEmployer', upload, async (req, res) => {

    ////////lets validate the data before we a user
    // This is a shorter version
    const { error } = registerEmployerValidation(req.body);
    // Error in response
    if (error) return res.status(400).send(error.details[0].message);

    /////checking if the email of employer is already in the database
    const emailExist = await Employer.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');
    

    const employer = new Employer({

        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        city: req.body.city,
        zipcode: req.body.zipcode,
        avatar:  req.file.avatar,

        jobs: {
            level: req.body.level,
            companyjob: req.body.companyjob,
            startdate: req.body.startdate,
            endDate: req.body.endDate,
        },


        createdByu: req.body.createdByu, 
        companyBy: req.body.companyBy,

    });

    try {
        const savedEmployer = await employer.save();
        res.send(savedEmployer);
        //res.redirect("/");
        

    } catch (err) {
        res.status(400).send(err);

       // res.status(500).json({ message: err.message });
    }

}




);

module.exports = router;

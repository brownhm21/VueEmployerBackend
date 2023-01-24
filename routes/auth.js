const router = require('express').Router();
const Joi = require('@hapi/joi');
const User = require('../model/User');
const Company = require('../model/Company');
const Employer = require('../model/Employer');

const { registerValidation, loginValidation, registerCompanyValidation, registerEmployerValidation } = require('../validations');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.patch('/update-company/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Company.findByIdAndUpdate(
            id, updatedData, options
        )
        
        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});





router.post('/register', async (req, res) => {

    ////////lets validate the data before we a user
    // This is a shorter version
    const { error } = registerValidation(req.body);
    // Error in response
    if (error) return res.status(400).send(error.details[0].message);

    /////checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    /////hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        confirmpassword: hashedPassword


    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);

    } catch (err) {
        res.status(400).send(err);
    }

});

/////Employer
router.post('/registerEmployer', async (req, res) => {

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
        email:req.body.email,
        phoneNumber: req.body.phoneNumber,
        adress:req.body.adress,
        city:req.body.city,
        zipcode:req.body.zipcode,

        jobs:{
            level: req.body.jobs.level,
            companyjob: req.body.jobs.companyjob,
            startdate : (req.body.jobs.startdate) ? req.body.jobs.startdate : "",

        },
        



        createdByu:req.body.createdByu,
        companyBy:req.body.companyBy,
       
    });

    try {
        const savedEmployer = await employer.save();
        res.send(savedEmployer);

    } catch (err) {
        res.status(400).send(err);
    }

});

/////Company
router.post('/registerCompany', async (req, res) => {

    ////////lets validate the data before we a user
    // This is a shorter version
    const { error } = registerCompanyValidation(req.body);
    // Error in response
    if (error) return res.status(400).send(error.details[0].message);

    /////checking if the email of company is already in the database
    const emailExist = await Company.findOne({ companyEmail: req.body.companyEmail });
    if (emailExist) return res.status(400).send('Email already exists');

    const company = new Company({
        
        companyName: req.body.companyName,
        companyEmail:req.body.companyEmail,
        phoneNumber: req.body.phoneNumber,
        companyAdress:req.body.companyAdress,
        companyCity:req.body.companyCity,
        zipcode:req.body.zipcode,
        createdBy:req.body.createdBy
       
    });

    try {
        const savedCompany = await company.save();
        res.send(savedCompany);

    } catch (err) {
        res.status(400).send(err);
    }

});

///////////////////////////get companies
router.get('/companyList', async (req, res) => {
    try {
        const companyList = await Company.find()
        if (!companyList) throw new Error('No Company List found')
        res.status(200).json(companyList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});
///////////////////////////get company
router.get('/companyOne/:id', async (req, res) => {
    try {
        const company = await Company.findOne({_id:req.params.id})
        if (!company) throw new Error('No Company found')
        res.status(200).json(company)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


///////////////////////////get company by user
router.get('/companyUser/:id', async (req, res) => {
    try {
        const company = await Company.findOne({createdBy:req.params.id})
        if (!company) throw new Error('No Company found')
        res.status(200).json(company)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

///////////////////////////////////Update company by Id/*
/*router.put('/update-company/:id',async (req, res) =>{
    try{
       const company = await Company.findByIdAndUpdate()
       if(!company) throw new Error('No Company found')

    }catch(error){
        res.status(500).json({ message: error.message })
    }

});*/

/*router.put('/update-company/:id',async (req, res, next) => {
    Company.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, (error, data) => {
        if (error) {
          return next(error);
        } else {
         
            res.status(200).json(data)
          res.json(data)
          console.log('Student successfully updated!')
        }
      })
  });*/

///Login
router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    // Error in response
    if (error) return res.status(400).send(error.details[0].message);

    /////checking if the user is already in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');
    //////password checking
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

     //////Token Assign
     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    /* res.header('auth-token', token).send(token);*/
    return res.status(200).json({
        title: 'login success',
        token: token,
        user: user
      });



    ////res.send('Logged In !');

});

module.exports = router;
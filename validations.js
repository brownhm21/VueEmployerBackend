

////Validation 
const Joi = require('@hapi/joi');

//////Register Validation
const registerValidation = data =>{
    const schema = {
        name:Joi.string()
             .min(6).required(),
        email:Joi.string()
              .min(6).required().email(),
        password:Joi.string()
              .min(6).required(),
        confirmpassword:Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })     
    };

    return Joi.validate(data, schema);
};
//////Register Company Validation
const registerCompanyValidation = data =>{
    const schema = {
        companyName:Joi.string().required(),
        companyEmail:Joi.string().min(6).required().email(),
        phoneNumber: Joi.string().max(10).required(),
        companyAdress:Joi.string().min(6).required(),
        companyCity:Joi.string().required(),
        zipcode:Joi.string().max(5).required(),
        createdBy:Joi.object().required()   
    };

    return Joi.validate(data, schema);
   
};
//////Register Company Validation
const registerEmployerValidation = data =>{
    const schema = {
        Firstname:Joi.string().required(),
        Lastname:Joi.string().required(),
        email:Joi.string().min(6).required().email(),
        phoneNumber: Joi.string().max(10).required(),
        address:Joi.string().min(6).required(),
        city:Joi.string().required(),
        zipcode:Joi.string().max(5).required(),
        ///jobs:Joi.object().required(),
        // jobs:Joi.object().keys({

            level :Joi.string().required(),
            companyjob:Joi.string().required(),
            startdate:Joi.date(),
            endDate:Joi.date(),

        // }),
        avatar: Joi.string(),
        createdByu:Joi.object(), //.required(),
        companyBy:Joi.object(), //.required(),
    };

    return Joi.validate(data, schema);
   
};

//////Login Validation
const loginValidation = data =>{
    const schema = {
        
        email:Joi.string()
              .min(6).required().email(),

        password:Joi.string()
              .min(6).required()
    };

    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.registerCompanyValidation = registerCompanyValidation;
module.exports.loginValidation = loginValidation;
module.exports.registerEmployerValidation = registerEmployerValidation;


const router = require('express').Router();
const verify = require('../routes/verifyToken');

const User = require('../model/User');



router.get('/', verify,async(req,res)=> {
 const users  =  await User.find();
    return res.status(200).json(users);
    
    
    

});

/*router.get('/user', (req, res, next) => {
    let token = req.headers.token; //token
    jwt.verify(token, 'secretkey', (err, decoded) => {
      if (err) return res.status(401).json({
        title: 'unauthorized'
      })
      //token is valid
      User.findOne({ _id: decoded.userId }, (err, user) => {
        if (err) return console.log(err)
        return res.status(200).json({
          title: 'user grabbed',
          user: {
            email: user.email,
            name: user.name
          }
        })
      })
  
    })
  });*/





module.exports = router;
const User = require('../models/users.models')

module.exports.profile = (req, res, next) => {
   
        res.render('users/profile');
      
  
  };
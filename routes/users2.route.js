//need express router
 const router = require('express').Router();
 // require the mongoose model
 let User2 = require('../models/user2.model');
 let Outlet = require('../models/outlet.model');

 const bcrypt = require('bcryptjs')

 require('dotenv').config();
 const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');


router.route('/signup').post((req, res) => {
  // console.log(req.body);
  const { username, email, password, preferences } = req.body.user;

  //validation
  if(!username || !email || !password){
    return res.json({ msg: 'Please enter all fields'});
  };

  //check for existing user, if false, create
  User2.findOne({ email, username })
    .then( user => {

      if(user && user.username === username) {
            return res.json({ msg: 'Username already exists'})
      } else if (user) {
            return res.json({ msg: 'Email already exists'})
      } //if

      const newUser = new User2({
        username,
        email,
        password,
        preferences
      }); //new user

      //create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (e, hash) => {
          if (e) throw e;

          newUser.password = hash;

          //save user to db
          newUser.save()
            .then( user => {

              //payload
              jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: 86400},
                (error, token) => {
                  if (error) throw error;
                  res.json({
                    token,
                    user: {
                      username: user.username,
                      email: user.email,
                      preferences: user.preferences
                    }
                  })
                }
              )//res.status(400).json({ msg: err.message})
            }) //then
            .catch( err => res.json( {msg: err.message}))
            // .catch( err => console.log(err.message))
            // .catch( err => res.status(400).json(err.message))
        })
      })
    }) //then




}); //post register


module.exports = router;





// {
//   "token":,
//   "user": {
//     "username": "Test2",
//     "email": "test2@t.com",
//     "preferences": [
//       {
//         "_id": "5e5325af5b9a7402b6e53464",
//         "outlet": "High Snobiety",
//         "route": "/hs",
//         "categories": [
//           {
//             "_id": "5e5325af5b9a7402b6e53465",
//             "category_name": "music",
//             "category_url": "category/music/feed/"
//           }
//         ]
//       }
//     ]
//   }
// }

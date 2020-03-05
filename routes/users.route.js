//need express router
 const router = require('express').Router();
 // require the mongoose model
 let User = require('../models/user.model');
 let Outlet = require('../models/outlet.model');

 const bcrypt = require('bcryptjs')

 require('dotenv').config();
 const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');



router.route('/signup').post((req, res) => {
  // console.log(req.body.user.preferences);
  const { username, email, password, preferences } = req.body.user;

  // console.log(preferences);
  //validation
  if(!username || !email || !password){
    return res.json({ msg: 'Please enter all fields'});
  };

  //check for existing user, if false, create
  User.findOne({ email, username })
    .then( user => {

      if(user && user.username === username) {
            return res.json({ msg: 'Username already exists'})
      } else if (user) {
            return res.json({ msg: 'Email already exists'})
      } //if

      const newUser = new User({
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



router.route('/setup').post( auth, (req, res) => {
  // console.log('from 2/setup', req.body.userPreferences);
  // console.log('from /setup', req.user);

  // const { preferences } = req.body.userPreferences;

  // console.log(preferences);

  // validation
  if(!req.body.userPreferences){
    return res.json({ msg: 'Please select some outlets'});
  };


  //updateOne //not add $set to stop overwriting
  User.updateOne( { _id: req.user.id }, {preferences: req.body.userPreferences } )
    .then( user => {
      res.json( { msg: 'Preferences added'});
    }) //then
    .catch( err => res.json( {msg: err.message}))



}); //post setup

router.route('/login').post((req, res) => {
  const { username, password } = req.body.user;

  //validation
  if(!username || !password){
    return res.status(400).json({ msg: 'Please enter all fields'});
  };

  //check for user
  User.findOne({ username })
    .then( user => {

      if(!user) {
            return res.status(400).json({ msg: 'User does not exist'})
      } //if


      //compare password hash
      bcrypt.compare( password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'invalid credentials'})

          //payload
          jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: 86400},
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  username: user.username,
                  email: user.email,
                  preferences: user.preferences
                }
              })
            }
          )

        }) //bcrypt then
        .catch( err => { errors: {
          msg: 'Token is not valid'
        }} )

    }) //then



}); // loginpost


router.route('/outlets/update').post( auth, (req, res) => {
    // console.log(req.body);

    const {outlet_name, category_name, category_url, action}  = req.body.selections
    // console.log(outlet_name, category_name, category_url, action);

    // Add or delete passed on action
    //syntax to return the document
    const operation = (action === 'add') ? '$set' : '$unset';
    const key = `preferences.${outlet_name}.${category_name}`;
    User.findOneAndUpdate(
      {_id: req.user.id},
      { [operation]: { [key]: category_url  } },
      { new: true }
    )
    .then( data => {
      console.log('DONE UPDATE', data);
      res.json( data );
    })




})


router.route('/dashboard').get( auth, (req, res) => {
  User.findById( req.user.id )
    .select('-password')
    .then(user => res.json(user))
    .catch( err => console.warn('auth route', err))
})


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

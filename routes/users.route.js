//need express router
 const router = require('express').Router();
 // require the mongoose model
 let User = require('../models/user.model');

 const bcrypt = require('bcryptjs')

 require('dotenv').config();
 const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

//route POST /user
//desc register new user
//acess public
router.route('/').post((req, res) => {
  const { username, email, password } = req.body;

  //validation
  if(!username || !email || !password){
    return res.status(400).json({ msg: 'Please enter all fields'});
  };

  //check for existing user
  User.findOne({ email, username })
    .then( user => {

      if(user && user.username === username) {
            return res.status(400).json({ msg: 'Username already exists'})
      } else if (user) {
            return res.status(400).json({ msg: 'Email already exists'})
      } //if

      const newUser = new User({
        username,
        email,
        password
      }); //new user

      //create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;

          //save user to db
          newUser.save()
            .then( user => {

              //payload
              jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: 3600},
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    token,
                    user: {
                      username: user.username,
                      email: user.email
                    }
                  })
                }
              )
            }) //then
            .catch( err => console.log('bcrypt error', err ))
        })
      })
    }) //then
    .catch( err => console.log('save error', err))



}); //post register



//route POST /login
//desc authenticate user
//acess public
router.route('/login').post((req, res) => {
  const { username, password } = req.body;

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
            { expiresIn: 3600},
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  username: user.username,
                  email: user.email
                }
              })
            }
          )

        }) //bcrypt then
        .catch( err => console.log('bcrypt err', err))

    }) //then
    .catch( err => console.log('to then err', err ))



}); // auth post


//route GET /users/auth
//desc get user data, by sending token
//access private
router.route('/auth').get( auth, (req, res) => {
  User.findById( req.user.id )
    .select('-password')
    .then(user => res.json(user))
    .catch( err => console.warn('auth route', err))
})

module.exports = router;

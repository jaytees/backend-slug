//need express router
const router = require("express").Router();
// require the mongoose model
let User = require("../models/user.model");
let Outlet = require("../models/outlet.model");

const bcrypt = require("bcryptjs");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");

//parse error messages into consistent format
const errorHandler = error => {
  let errors = [];

  if (error.code === 11000 && error.keyPattern.email) {
    errors.push("Email already exists");
  } else if (error.code === 11000 && error.keyPattern.username) {
    errors.push("Username already exists");
  } else {
    let errorObject = error.errors;
    //make an array of descriptive messages
    Object.keys(errorObject).forEach(key => {
      errors.push(errorObject[key].message);
    });
  }

  return errors;
};

router.route("/signup").post((req, res) => {
  const { username, email, password, preferences } = req.body.user;

  //check for existing user, if false, create
  User.findOne({ email, username }).then(user => {
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
        newUser
          .save()
          .then(user => {
            //payload
            jwt.sign(
              { id: user.id },
              process.env.JWT_SECRET,
              { expiresIn: 86400 },
              (error, token) => {
                if (error) throw error;
                res.json({
                  token,
                  user: {
                    username: user.username,
                    email: user.email,
                    preferences: user.preferences
                  }
                });
              }
            );
          }) //then
          .catch(err => res.status(401).send(errorHandler(err)));
      });
    });
  }); //then
}); //post register

router.route("/setup").post(auth, (req, res) => {
  // validation
  if (!req.body.userPreferences) {
    return res.json({ msg: "Please select some outlets" });
  }

  //updateOne //not add $set to stop overwriting
  User.updateOne(
    { _id: req.user.id },
    { preferences: req.body.userPreferences }
  )
    .then(user => {
      res.json({ msg: "Preferences added" });
    }) //then
    .catch(err => res.json({ msg: err.message }));
}); //post setup

router.route("/login").post((req, res) => {
  const { username, password } = req.body.user;

  //validation
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //check for user
  User.findOne({ username }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    } //if

    //compare password hash
    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        if (!isMatch)
          return res.status(400).json({ msg: "invalid credentials" });

        //payload
        jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                username: user.username,
                email: user.email,
                preferences: user.preferences
              }
            });
          }
        );
      }) //bcrypt then
      .catch(err => {
        errors: {
          msg: "Token is not valid";
        }
      });
  }); //then
}); // loginpost

router.route("/outlets/update").post(auth, (req, res) => {
  // console.log(req.body);

  const {
    outlet_name,
    category_name,
    category_url,
    action
  } = req.body.selections;

  // Add or delete passed on action
  //syntax to return the document
  const operation = action === "add" ? "$set" : "$unset";
  const key = `preferences.${outlet_name}.${category_name}`;
  User.findOneAndUpdate(
    { _id: req.user.id },
    { [operation]: { [key]: category_url } },
    { new: true }
  ).then(data => {
    console.log("DONE UPDATE", data);
    res.json(data);
  });
});

router.route("/dashboard").get(auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user))
    .catch(err => console.warn("auth route", err));
});

router.route("/index").get((req, res) => {
  User.find((err, results) => {
    res.json(results);
  });
});

module.exports = router;

var express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const secretkey = "secret";

const User = require('../models/user')

const { body, validationResult } = require('express-validator');

const router = express.Router()

/* Post route the create user form to the database */
router.post('/create',
body("inputFirstName", "Please fill out first name field").isLength({min: 1}),
body("inputLastName", "Please fill out last name field").isLength({min: 1}),
body("email", "Please fill out email field").isLength({min: 3}), //Validatng user inputs
body("inputPhone", "Please fill out phone field").isLength({min: 1}),
body("password", "Password must be at least 8 characters long").isLength({min: 8}),
async (req, res) => {
  try {
    const user = new User({ //Creates the user document
      first_name: req.body.inputFirstName,
      last_name: req.body.inputLastName,
      email: req.body.email,
      username: req.body.email,
      phone_number: req.body.inputPhone,
      profile_photo: req.body.photo_source,
      alumni: req.body.alumniRadio,
      student: req.body.studentRadio,
      major: req.body.inputMajor,
      interests: req.body.inputInterests,
      degree: req.body.inputDegree,
      job: req.body.inputWork
    })
    const result= validationResult(req); //validates the results
    var errors = result.errors;
    let useremail = req.body.email;

    if (errors.length !== 0) {
      res.render('create', {errors: errors[0].msg}) //Reports to the user if any validation checks failed

  } else {

    const existingUser = await User.findOne({ email: useremail }); //Checks if the user email is already in use
    if(existingUser != undefined){ 
      res.render('create', {errors: "Email is already registered, please use a different email, or log in"}) //Reports to the user if said email is in use
    }

    if(req.body.photo_source!="default.jpg"){
      req.files.photo_upload.mv('./public/profilePictures/' + req.files.photo_upload.name); //moves the profile picture into the profile picture folder
    }
    await User.register(user, req.body.password); //Registers the user
    return res.redirect('/home/signin'); //redirects to the sign-in page so the user can sign in
    }
  } catch (error) { //catches any errors and prints them to the console
    console.log(error);
  }
})

/* Gets/renders the create page, if the user isn't alreay logged in, if they are it is redirected to the profile page */
router.get('/create', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('profile');
  } else {
    res.render('create', { title: 'Create Account' })
  }
})

/* Gets/renders the sign in page if the user isn't alreay logged in, if they are it is redirected to the profile page */
router.get('/signin', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('profile');
}
else {
  res.render('signin', { title: 'Sign In' })
}
})

/* Post route for the sign in page */
router.post ('/signin', 
body("email", "Please fill out email field").isLength({min: 3}), //validates the email and password have been entered on the server side
body("password", "Please fill out password field. Note password when created had to be at least 8 characters long").isLength({min: 1}),
function(req, res, next) {
  const result= validationResult(req); //validates the results from the body based on the conditions provided
  var errors = result.errors; 
  if (errors.length !== 0) {
    res.render('signin', {errors: errors[0].msg}) //If the validation is not passed it sends an error message to the user

} else {
  passport.authenticate( 'local', function(err, user) { //Otherwise authenticaties the user
    if (err) {
      return next(err) 
    }

    if (!user) {
      return res.render('signin', {title: "Sign In", errors: "Incorrect Username or Password"}) //if the user isn't returned .. tells the user they have the wrong username or password
    }

    // If all checks are passed it logs the user in
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/home/profile');
    });
  })(req, res, next);
}
});

module.exports = router

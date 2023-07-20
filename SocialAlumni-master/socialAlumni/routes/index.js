var express = require('express');
const { req } = require('express');
const { body, validationResult } = require('express-validator');
var search_controller = require('../controllers/search_controller');

/* initalising collection variables */
const PostDB = require('../models/post_schema');
const USERDB = require('../models/user');
const group_json = require('../models/group_schema');

const router = express.Router();

/* Get/render the home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) { //if the user is signed in, render the profile page instead
    res.redirect('profile');
  }
  else { //if the user isn't signed in render the home page
  res.render('index', { title: 'Social Alumni' });
}
});

/* get/render the search results */
router.get('/search', async(req, res) => {
  if (req.isAuthenticated()) { //if the user is authetnicated allow search
    let users = await USERDB.find({}); //find all of the users in the database
    let search = req.query.search;
  
    res.render('search' , { //render the search page with the users filtered by the search criteria
      usersearch: search_controller.filter_users(search, users), 
      isAuthenticated: true
    });
  }
  else { //if the user isn't authenticated, render the home page
  res.redirect("/home/");
}
});



router.get('/logout', function(req, res){
  if (req.isAuthenticated()) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/home/signin');
    });
  }
  else {
    res.redirect('/home/')
}

  });


var auth = function (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.status(401).json("not authenticated!");
}

router.get('/profile', async(req, res) => {
  if (req.isAuthenticated()) {
    let user = await USERDB.findOne({email: req.session.passport.user});
    
    if(user.major!=""){
    res.render('profile', {
      isAuthenticated: true, 
      title: "User Profile", 
      lastname: user.last_name, 
      firstname: user.first_name, 
      email: user.email, 
      major: user.major,
      work: user.interests,
      profilePictures: req.user.profile_photo
    });
  } else {
    res.render('profile', {
      isAuthenticated: true, 
      title: "User Profile", 
      lastname: user.last_name, 
      firstname: user.first_name, 
      email: user.email, 
      major: user.degree,
      work: user.job,
      profilePictures: req.user.profile_photo
    });
  }

  } else {
    res.redirect("/home/");
  }
});

router.get('/groups', async(req, res) => {
  if (req.isAuthenticated()) {
    let yourGroups = await group_json.find({members: req.user.email}); 
    let groups = await group_json.find({ members: { $ne: req.user.email }});
    
    res.render('groups', {
      yourGroups : yourGroups, 
      groups: groups, 
      isAuthenticated: true, 
      title: "Groups"
    });

  } else {
    res.redirect("/home/");
  }
});

router.post('/create-group', 
  body("group_name", "Please fill out the name field").isLength({min: 1}),
  body("group_description", "Please fill out the group description field").isLength({min: 1}),
async(req, res) => {
  if (req.isAuthenticated()) {
    const group_document = {
      name: req.body.group_name,
      description: req.body.group_description,
      members: req.user.email
    }
    const result= validationResult(req); //validates the results from the body based on the conditions provided
    var errors = result.errors; 
    if (errors.length !== 0) {
      res.render('create_group', {
        isAuthenticated: true,
        errors: errors[0].msg}) //Reports to the user if any validation checks failed
    } else {
      const db_info = await group_json.create(group_document);
      res.redirect('/home/groups');
    }
  } else {
  res.redirect("/home/");
  }
});


router.get('/create-group', async(req, res) => {
  if (req.isAuthenticated()) {
    res.render('create_group', {
      isAuthenticated: true, 
      title: "Create Group"
    });
  } else {
    res.redirect("/home/");
}
});

router.get('/:id/join', async(req, res) => {
  if (req.isAuthenticated()) {
    let group = req.params.id
    // insert the data into the database
    const db_info = await group_json.findOneAndUpdate({name: group}, {$push: {members: req.user.email}});

    // tell the client it worked!
    res.redirect('/home/groups');
  } else {
    res.redirect("/home/");
  }
});


module.exports = router;


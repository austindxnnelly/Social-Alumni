const express = require('express');
const MessageDB = require('../models/message_schema');
const UserDB = require('../models/user');
const PostDB = require('../models/post_schema');
const ReplyDB = require('../models/reply_schema');
var assign_badge = require('../public/javascripts/assign_badge');
const passport = require('passport');

const { body, validationResult } = require('express-validator');

const router = express.Router();

/* Renders the feed page if the user currently has a session, if they don't the home page is loaded instead */
router.get('/:id/feed', async(req, res) => {
  if (req.isAuthenticated()) { //checks authentication status
    const group = req.params.id; 
    var postsSent = await PostDB.find({group: group}); //find all posts for that group
    
    const posts = postsSent;
    var sort_func = (a, b) => b.date - a.date; 
    posts.sort(sort_func); //sorts the post so that the most recent is on top

    // renders the feed plage with the posts and group
    res.render('feed',{
        title: "Timeline",
        isAuthenticated: true,
        posts: posts,
        group: group,
    });

  } else { //if the user isn't authenticated, redirect to the home page.
    res.redirect('/home/')
  }

});



/* Posting route for the feed page, if a new post is created */
router.post('/:id/feed', 
body("content", "Please enter the content of the post").isLength({min: 1}),
async (req, res) => {
  if (req.isAuthenticated()) { //if the user is authenticated
    const post_document = { //create the post document
      profile_photo_sent: req.user.profile_photo,
      first_name_sent: req.user.first_name,
      last_name_sent: req.user.last_name,
        username_sent: req.user.email,
        message_content: req.body.content,
        date: new Date().getTime(),
        group: req.params.id
    };
    group = req.params.id;
    user = req.user.email;
  
  const result= validationResult(req); //validates the results from the body based on the conditions provided
  var errors = result.errors; 
    if (errors.length !== 0) {
      res.redirect('/home/' + group + '/feed') //Reports to the user if any validation checks failed
      
    } else {
      // insert the data into the database
      const db_info = await PostDB.create(post_document);
      var user_info = await UserDB.findOne({email: user});
      var user_points_prev = user_info["points"] ;
      var points = user_points_prev + 3; //Increase the number of points the user has for each post they make
      var level = assign_badge.reassign(points); //calculate the badge based on the number of points 
      const post_point_info = await UserDB.findOneAndUpdate({email: user}, {points: points, level: level});
      
      // Redirect back to the group feed
      res.redirect('/home/' + group + '/feed');
    }
  } else { //if the user isn't authenticated, load the home page
    res.redirect('/home/');
  }
  });

/* Posting route for the feed page replies, if a new reply is sent */
router.post('/:groupid/feed/:postid/reply', async (req, res) => {
  if (req.isAuthenticated()) {  //if the user is authenticated
    const reply_document = { //create the reply document 
        profile_photo_sent: req.user.profile_photo,
        first_name_sent: req.user.first_name,
        last_name_sent: req.user.last_name,
        username_sent: req.user.email,
        date: new Date().getTime(),
        message_content: req.body.reply,
        group: req.params.groupid,
        parent_post: req.params.postid
    };
    group = req.params.groupid;
    post = req.params.postid;
    user = req.user.email;

    if(message_document.message_content == ""){ //If there is no content in the reply, redirect back to the feed page and stop
      res.redirect('/home/' + group + '/feed');
  } else {

    // insert the data into the database
    const reply_info = await ReplyDB.create(reply_document);
    replyid = reply_info.id;
    
    const post_info = await PostDB.findOneAndUpdate({_id: post}, {$push: {replies: reply_document}});
    var user_info = await UserDB.findOne({email: user});
    var user_points_prev = user_info["points"] ;
    var points = user_points_prev + 2; //increase the number of points the user has for each reply
    var level = assign_badge.reassign(points); //calculate the badge level based on the new number points
    const post_point_info = await UserDB.findOneAndUpdate({email: user}, {points: points, level: level});

    //redirect back to the feed page
    res.redirect('/home/' + group + '/feed');
  }
  } else { //if the user isn't authenticated, redirect to the home page
    res.redirect('/home/');
  }
  });


module.exports = router;
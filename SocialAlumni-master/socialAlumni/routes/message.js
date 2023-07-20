const express = require('express');
const MessageDB = require('../models/message_schema');
const UserDB = require('../models/user');
const { lastMessage } = require('../public/javascripts/last_messages');

const router = express.Router();

/* Get all message between two users */
router.get('/:id/all-messages', async (req, res) => {
    if (req.isAuthenticated()) { //if the user is authenticated/has a current session
    const reciever = req.params.id;
    const sender = req.user.email;
    
    //Find all the messages in the database which the user sent, and the other user recieved
    var messagesSent = await MessageDB.find({username_recieved: reciever , username_sent: sender});
    for(let i = 0; i < messagesSent.length; i++){
        messagesSent[i]["owner"] = true; //loop through those messages and set the owner to true
    }

    //Find all messages in the database which the user recieved, and the other user sent
    var messagesRecieved = await MessageDB.find({username_recieved: sender, username_sent: reciever});
    
    //Find the user information of the other user
    var userRecieved = await UserDB.findOne({email: reciever});
    var nameRecieved = userRecieved["first_name"];

    //Sort the messages so the most recent is on the bottom
    const messages = messagesSent.concat(messagesRecieved);
    var sort_func = (a, b) => b.date - a.date;
    messages.sort(sort_func);
    
    /* Find all messages sent by the user */
    var userMessagesRecieved = await MessageDB.find({username_recieved: sender});
    var userMessagesSent = await MessageDB.find({username_sent: sender});
    for(let i = 0; i < userMessagesSent.length; i++){
        userMessagesSent[i]["owner"] = true;
    }

    /* Find the last message sent between each unqiue user */
    let uniqueMessages = lastMessage(userMessagesSent, userMessagesRecieved, sender);

    /* loop through the unqiue messages and add the first name and last name of the other user*/
    for (let k = 0; k < uniqueMessages.length; k++){
        var nameUser = await UserDB.findOne({email: uniqueMessages[k].username_sent});
        uniqueMessages[k].first_name_sent = nameUser["first_name"];
        uniqueMessages[k].last_name_sent = nameUser["last_name"];
    }

    /* render the message page*/
    res.render('message_page', {
        isAuthenticated: true, 
        uniquemessages: uniqueMessages, 
        messages: messages, 
        recieved: reciever, 
        username: nameRecieved
    }); 
} else { // If the user isn't authenticated, redirect home
    res.redirect('/home/');
}

});

/* Posting messages to the database */
router.post('/:id/all-messages', async (req, res) => {
    if (req.isAuthenticated()) { //If the user is authenticated
    const message_document = { //Create the message document
        username_sent: req.user.email,
        username_recieved: req.params.id,
        message_content: req.body.content,
        date: new Date().getTime(),
    };
    let reciever = req.params.id

    if(message_document.message_content == ""){ //If there is no content in the message, redirect back to the message page and stop
        res.redirect('/home/' + reciever + '/all-messages');
    } else {
    // insert the data into the database
    const db_info = await MessageDB.create(message_document);
    
    // redirect to the message page again to load the new message
    res.redirect('/home/' + reciever + '/all-messages');
    }
} else { //if there is no user session, redirect home.
    res.redirect('/home/');
}
});

/* Load the messages, when the message tab is clicked */
router.get('/messages', async(req, res) => {
    if (req.isAuthenticated()) {  //If there is an active session
    const sender = req.user.email;

    /* Get all the messages sent by the current user */
    var messagesSent = await MessageDB.find({username_sent: sender});
    for(let i = 0; i < messagesSent.length; i++){
        messagesSent[i]["owner"] = true;
    }
    /* Get all the messages recieved by the current user */
    var messagesRecieved = await MessageDB.find({username_recieved: sender});

    /* Find the last message sent between each unqiue user */
    let uniqueMessages = lastMessage(messagesSent, messagesRecieved, sender);

    if(uniqueMessages[0] == undefined){ //If there are no messages, redirect to the user search message page
            res.render('message_search', {isAuthenticated: true});
    } else { 
    // otherwise redirect to the message page relating to the last messaged user
    res.redirect('/home/' + uniqueMessages[0].username_sent + '/all-messages'); 
    }
} else { //If there is no active session redirect home.
    res.redirect('/home/');
}
  });


module.exports = router;


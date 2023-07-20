/**
 * Creates an array of the last message that has been sent between the user and every other user 
 * 
 * @param {*} messagesSent The messages the user has sent
 * @param {*} messagesRecieved The messages the user has recieved
 * @param {*} sender The users username
 * @returns An array of the last message from each user the user has messaged
 */
function lastMessage(messagesSent, messagesRecieved, sender){
    let uniqueMessages= []
    let otherUsers = []
    //Concat the sent and recieved messages, and sort them by date
    const messages = messagesSent.concat(messagesRecieved);
    var sort_func = (a, b) => b.date - a.date;
    messages.sort(sort_func);

    //Loop through all the messages
    for (let j = 0; j < messages.length; j++){
        //If the username sent is not the current users username, set it as so, and change the username_recieved to the other user
        if(messages[j].username_sent == sender){ 
            //check that the first method between the user and the other user hasn't already been found
            if(!otherUsers.includes(messages[j].username_recieved)){ 
                otherUsers.push(messages[j].username_recieved);
                messages[j].username_sent = messages[j].username_recieved;
                messages[j].username_recieved = sender;
                uniqueMessages.push(messages[j]); //push the message to the unique message array
            }
        } else {
            //Else push the message to the unique message array as is
            if(!otherUsers.includes(messages[j].username_sent)){
                otherUsers.push(messages[j].username_sent);
                uniqueMessages.push(messages[j]);
            }            
        }
    }

    return uniqueMessages;
}

module.exports = { lastMessage };
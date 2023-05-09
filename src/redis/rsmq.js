const RedisSMQ = require('rsmq');
const rsmq = new RedisSMQ({host: 'localhost', port: 6379});

// create the RSMQ queue if it doesn't exist
rsmq.createQueue({qname: 'tasks'}, function(err, resp) {
  if (resp === 1) {
    console.log('RSMQ queue created.');
  }
});

// publish a message to the RSMQ queue
function sendMessageToQueue(message, vt) {
  rsmq.sendMessage({qname: 'tasks', message: message, vt: vt}, function(err, resp) {
    if (err) {
      console.error(err);
    } else {
      console.log('Message sent to RSMQ queue: ' + resp);
    }
  });
}

// listen for incoming messages from the RSMQ queue
function listenForMessages() {
  rsmq.receiveMessage({qname: 'tasks'}, function(err, resp) {
    if (resp) {
      console.log('Message received from RSMQ queue: ' + resp.message);
      
      // do something with the message
      
      // delete the message from the queue
      rsmq.deleteMessage({qname: 'tasks', id: resp.id}, function(err, resp) {
        if (err) {
          console.error(err);
        } else {
          console.log('Message deleted from RSMQ queue: ' + resp);
        }
      });
    } else {
      console.log('No messages in RSMQ queue.');
    }
    
    // continue listening for messages
    setTimeout(listenForMessages, 1000);
  });
}

module.exports = {
  sendMessageToQueue: sendMessageToQueue,
  listenForMessages: listenForMessages
};

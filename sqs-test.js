// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
// Set the region we will be using
AWS.config.update({region: 'us-east-2'});

// Create SQS service client
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = "https://sqs.us-east-2.amazonaws.com/293779097326/test.fifo";

// Replace with your accountid and the queue name you setup
const accountId = '293779097326';
const queueName = 'test.fifo';

// Setup the sendMessage parameter object
// const params = {
//   MessageBody: JSON.stringify({
//     order_id: "o2",
//     date: (new Date()).toISOString()

//   }),
//   MessageGroupId: "auction",
//   MessageDeduplicationId: "order_id",
//   QueueUrl: `https://sqs.us-east-2.amazonaws.com/293779097326/test.fifo`
// };

var params = {
  QueueName: 'SQSQUEUENAME1111.fifo',
  Attributes: {
    'DelaySeconds': '60',
    'MessageRetentionPeriod': '86400',
    'FifoQueue': "true"
    
  },
  
};

sqs.createQueue(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.QueueUrl);
  }
});
// sqs.sendMessage(params, (err, data) => {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Successfully added message", data.MessageId);
//   }
// });


// const app = Consumer.create({
//   queueUrl: queueUrl,
//   handleMessage: async (message) => {
//       console.log(message);
//   },
//   sqs: new AWS.SQS()
// });

// app.on('error', (err) => {
//   console.error(err.message);
// });

// app.on('processing_error', (err) => {
//   console.error(err.message);
// });

// console.log('Emails service is running');
// app.start();


// var params1 = {
//   AttributeNames: [
//      "All"
//   ],
//   MaxNumberOfMessages: 10,
//   MessageAttributeNames: [
//      "All"
//   ],
//   QueueUrl: queueUrl,
//   // VisibilityTimeout: 20,
//   // WaitTimeSeconds: 0
//  };
 
//  sqs.receiveMessage(params1, function(err, data) {
//   console.log("Total Messages:",data.Messages.length);
//   console.log(data);
//    if (err) {
//      console.log("Receive Error", err);
//    } else if (data.Messages) {
//     //  for(let i=0;i< data.Messages.length;i++){
//     //   var deleteParams = {
//     //     QueueUrl: queueUrl,
//     //     ReceiptHandle: data.Messages[i].ReceiptHandle
//     //   };
//     //   sqs.deleteMessage(deleteParams, function(err, data) {
//     //       if (err) {
//     //         console.log("Delete Error", err);
//     //       } else {
//     //         console.log("Message Deleted", data);
//     //       }
//     //   });
//     //  }
     
//    }
//  });
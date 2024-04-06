const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

async function publishMessageToPubSub(userData, verificationCode) {
  const data = JSON.stringify({ userData, verificationCode });
  const dataBuffer = Buffer.from(data);
  const topicName = 'verify_email';

  try {
    await pubsub.topic(topicName).publishMessage({data: dataBuffer});;
    console.log('Message published to Pub/Sub.');
  } catch (error) {
    console.error('Error publishing message to Pub/Sub:', error);
    throw new Error('Error publishing message to Pub/Sub');
  }
  }

  module.exports = publishMessageToPubSub
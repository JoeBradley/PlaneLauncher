// Import the appropriate service and chosen wrappers
const {
  conversation,
  Image,
} = require('@assistant/conversation')
const pi = require('./../PiController');

// Create an app instance
const app = conversation();

// Register handlers for Actions SDK

app.handle('welcome', conv => {
  console.log('actions.launch', { conv });
  
  conv.add('Welcome to Plane Launcher');
  // conv.add(new Image({
  //   url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
  //   alt: 'A cat',
  // }));
});

app.handle('launch', async conv => {
  try {
    console.log('actions.launch', { 
      speed: conv.request.session.params.speed
     });

    await pi.launchAsync(+conv.request.session.params.speed);

    conv.add('Take-off!');
  } catch (error) {
    conv.add('Failed to take-off!');
  }
});

module.exports = app;
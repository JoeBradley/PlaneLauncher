// Import the appropriate service and chosen wrappers
const {
  conversation,
  Image,
} = require('@assistant/conversation')
const pi = require('./../PiController');

// Create an app instance
const app = conversation()
 
// Register handlers for Actions SDK
 
app.handle('welcome', conv => {
  conv.add('Welcome to plane launcher');
  conv.add(new Image({
    url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    alt: 'A cat',
  }));
})

module.exports = app;
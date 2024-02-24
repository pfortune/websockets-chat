const messagesList = document.getElementById('messages');
const form = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Prompt the user for their chat name
const userName = prompt('Enter your chat name:', 'Guest');

const socket = new WebSocket('ws://localhost:3000');

// Function to handle the display of messages
function handleMessage(data) {
  const messageData = JSON.parse(data);
  const messageItem = document.createElement('li');

  // Differentiating between messages sent by the user and others
  if (messageData.sender === userName) {
    messageItem.textContent = `Me: ${messageData.text}`;
    messageItem.className = 'my-message'; // Apply specific class for styling
  } else {
    messageItem.textContent = `${messageData.sender}: ${messageData.text}`;
    messageItem.className = 'other-message'; // Different class for other users' messages
  }

  messagesList.appendChild(messageItem);
}

// Listen for messages from the server
socket.addEventListener('message', function (event) {
  // Check if the incoming message is a Blob
  if (event.data instanceof Blob) {
    // Create a FileReader to read the Blob
    const reader = new FileReader();

    reader.onload = function () {
      // Once the Blob has been read as text, handle the message
      handleMessage(reader.result);
    };

    reader.readAsText(event.data); // Read the Blob as text
  } else {
    // If the message is not a Blob, handle it directly
    handleMessage(event.data);
  }
});

// Send a message when the form is submitted
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the form from submitting in the traditional way
  if (messageInput.value) {
    const messageData = {
      sender: userName, // Use the userName obtained from the prompt
      text: messageInput.value,
    };

    // Append the message to the chat window immediately for the sender
    const messageItem = document.createElement('li');
    messageItem.textContent = `Me: ${messageInput.value}`;
    messageItem.className = 'my-message'; // Apply specific class for styling
    messagesList.appendChild(messageItem);

    socket.send(JSON.stringify(messageData)); // Send the message as a JSON string
    messageInput.value = ''; // Clear the input field
  }
});

const messagesList = document.getElementById('messages');
const form = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const userName = prompt('Enter your chat name:', 'Guest');

let host = location.origin.replace(/^http/, 'ws')
const socket = new WebSocket(host);

function handleMessage(data) {
  const messageData = JSON.parse(data);
  const messageItem = document.createElement('li');

  if (messageData.sender === userName) {
    messageItem.textContent = `Me: ${messageData.text}`;
    messageItem.className = 'my-message';
  } else {
    messageItem.textContent = `${messageData.sender}: ${messageData.text}`;
    messageItem.className = 'other-message'; 
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
    messageItem.className = 'my-message';
    messagesList.appendChild(messageItem);

    socket.send(JSON.stringify(messageData)); 
    messageInput.value = ''; // Clear the input field
  }
});

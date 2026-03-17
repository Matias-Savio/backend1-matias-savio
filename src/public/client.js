const socket = io();

function sendMessage() {
  const message = document.getElementById(`messsageInput`).value;
  socket.emit(`newMessage`, message);
}

function appendMessage(sockrtID, message) {
  const messageList = document.getElementById(`messageList`);
  const newMessage = document.createElement(`p`);
  newMessage.textContent = `${sockrtID}: ${message} `;
  messageList.appendChild(newMessage);
}

socket.on(`messaList`, (messages) => {
  const messageList = document.getElementById(`messsageList`);
  messageList.innerHTML = "";
  messages.forEach((message) => {
    appendMessage(message.sockrtID, message.message);
  });
});

socket.on(`newMessage`, (data) => {
  appendMessage(data.sockrtID, data.message);
});

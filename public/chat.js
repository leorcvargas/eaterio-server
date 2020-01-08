let ws = null;

function startChat() {
  ws = adonis.Ws().connect()

  ws.on('open', () => {
    const connectionStatus = document.querySelector('.connection-status');
    connectionStatus.classList.add('connected');
    subscribeToChannel();
  });

  ws.on('error', () => {
    const connectionStatus = document.querySelector('.connection-status');
    connectionStatus.classList.remove('connected');
  });

  const message = document.getElementById('message');

  message.onkeyup = event => {
    if (event.key === 'Enter') {
      event.preventDefault()

      const message = event.target.value;
      ws.getSubscription('chat').emit('message', {
        username: window.username,
        body: message
      });

      event.target.value = '';
    }
  };
}


function subscribeToChannel() {
  const chat = ws.subscribe('chat');

  chat.on('error', () => {
    const connectionStatus = document.querySelector('.connection-status');
    connectionStatus.classList.remove('connected');
  });

  chat.on('message', (message) => {
    const messages = document.querySelector('.messages');
    messages.innerHTML += (`<div class="message"><h3>${message.username}</h3><p>${message.body}</p></div>`);
  });
}

startChat();

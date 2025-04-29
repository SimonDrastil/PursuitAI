// script.js

// Replace with your actual n8n webhook URL
const WEBHOOK_URL = 'https://your-n8n-webhook-url/endpoint';

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Helper to create and append a message bubble
function appendMessage(text, sender, isLoading = false) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);            // add classes "message user" or "message bot"
  if (isLoading) msg.classList.add('loading');     // optional loading style
  msg.textContent = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return msg;
}

// Send the user message to n8n and display the bot reply
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // show user's message
  appendMessage(text, 'user');
  userInput.value = '';

  // show loading indicator
  const loadingMsg = appendMessage('...', 'bot', true);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    const data = await res.json();

    // Remove loading indicator
    loadingMsg.remove();

    // Adjust based on your n8n response structure
    const reply = data.reply || data.response || JSON.stringify(data);
    appendMessage(reply, 'bot');
  } catch (err) {
    loadingMsg.remove();
    appendMessage('⚠️ Oops, something went wrong.', 'bot');
    console.error(err);
  }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

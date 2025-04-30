// script.js

const WEBHOOK_URL = 'https://n8n-production-f223.up.railway.app/webhook/[REDACTED]/chat';
const chatContainer = document.getElementById('chat-container');
const userInput     = document.getElementById('user-input');
const sendBtn       = document.getElementById('send-btn');

// smooth scroll to chat on hero button
document.getElementById('scroll-chat').onclick = () =>
  document.getElementById('chat').scrollIntoView({ behavior: 'smooth' });

// append a bubble, returns the element
function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  chatContainer.appendChild(msg);
  return msg;
}

// typewriter effect for bot
function typeWriter(el, text, i = 0) {
  if (i < text.length) {
    el.textContent += text[i++];
    chatContainer.scrollTop = chatContainer.scrollHeight;
    setTimeout(() => typeWriter(el, text, i), 20);
  }
}

// send flow
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // user bubble
  const userMsg = appendMessage(text, 'user');
  userMsg.style.opacity = 1;

  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled  = true;

  // bot loading bubble
  const botMsg = appendMessage('', 'bot');
  botMsg.textContent = '…';
  botMsg.style.opacity = 1;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data  = await res.json();
    const reply = data.reply || data.response || 'No reply';

    // clear loading & type
    botMsg.textContent = '';
    typeWriter(botMsg, reply);

  } catch (err) {
    botMsg.textContent = '⚠️ Oops, something went wrong.';
    console.error(err);
  } finally {
    userInput.disabled = false;
    sendBtn.disabled   = false;
    userInput.focus();
  }
}

// listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

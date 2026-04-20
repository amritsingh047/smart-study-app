const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitButton = chatForm.querySelector('button');

// Modals
const mapModal = document.getElementById('map-modal');
const menuModal = document.getElementById('menu-modal');

// Quick Action Buttons
document.getElementById('btn-map').addEventListener('click', () => openModal(mapModal));
document.getElementById('btn-menu').addEventListener('click', () => openModal(menuModal));
document.getElementById('btn-restroom').addEventListener('click', () => {
    sendUserMessage("Where is the nearest restroom from my current location?");
});
document.getElementById('btn-merch').addEventListener('click', () => {
    sendUserMessage("Where can I buy team merchandise?");
});

// Close Modals
document.getElementById('close-map').addEventListener('click', () => closeModal(mapModal));
document.getElementById('close-menu').addEventListener('click', () => closeModal(menuModal));

window.addEventListener('click', (e) => {
    if (e.target === mapModal) closeModal(mapModal);
    if (e.target === menuModal) closeModal(menuModal);
});

function openModal(modal) {
    modal.style.display = 'flex';
    // Small delay to allow display:flex to apply before adding opacity
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// Food Orders
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const item = e.target.getAttribute('data-item');
        closeModal(menuModal);
        sendUserMessage(`I would like to order one ${item} to my seat.`);
    });
});

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;
    
    sendUserMessage(message);
});

async function sendUserMessage(message) {
    // Add user message to UI
    appendMessage(message, 'user');
    userInput.value = '';
    
    // Disable input while waiting
    userInput.disabled = true;
    submitButton.disabled = true;

    let loadingId;
    try {
        // Show loading state
        loadingId = appendMessage('Thinking...', 'assistant');

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        
        // Remove loading state
        document.getElementById(loadingId).remove();

        if (response.ok) {
            appendMessage(data.reply, 'assistant');
        } else {
            appendMessage('Sorry, an error occurred: ' + data.error, 'assistant');
        }
    } catch (error) {
        console.error('Error:', error);
        const loadingEl = document.getElementById(loadingId);
        if(loadingEl) loadingEl.remove();
        appendMessage('Network error. Please try again.', 'assistant');
    } finally {
        userInput.disabled = false;
        submitButton.disabled = false;
        userInput.focus();
    }
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    // Support basic markdown like **bold** (just for a nice touch)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    const p = document.createElement('p');
    p.innerHTML = formattedText;
    
    messageDiv.appendChild(p);
    
    // Generate a unique ID for loading messages
    const id = 'msg-' + Date.now();
    messageDiv.id = id;

    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return id;
}

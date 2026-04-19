const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitButton = chatForm.querySelector('button');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to UI
    appendMessage(message, 'user');
    userInput.value = '';
    
    // Disable input while waiting
    userInput.disabled = true;
    submitButton.disabled = true;

    try {
        // Show loading state
        const loadingId = appendMessage('Thinking...', 'assistant');

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
        appendMessage('Network error. Please try again.', 'assistant');
    } finally {
        userInput.disabled = false;
        submitButton.disabled = false;
        userInput.focus();
    }
});

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const p = document.createElement('p');
    p.textContent = text;
    
    messageDiv.appendChild(p);
    
    // Generate a unique ID for loading messages
    const id = 'msg-' + Date.now();
    messageDiv.id = id;

    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return id;
}

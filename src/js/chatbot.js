document.addEventListener('DOMContentLoaded', function() {
    const chatbot = document.getElementById('chatbot');
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    const chatbotMaximize = document.getElementById('chatbot-maximize');
    const chatbotFullscreen = document.getElementById('chatbot-fullscreen');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Toggle chatbot visibility
    chatbotTrigger.addEventListener('click', function() {
        chatbotTrigger.classList.toggle('active');
        chatbot.classList.toggle('active');

        // If chatbot was minimized before closing, restore it when opened
        if (chatbot.classList.contains('minimized') && chatbot.classList.contains('active')) {
            chatbot.classList.remove('minimized');
        }

        // Focus input when chatbot is opened
        if (chatbot.classList.contains('active')) {
            setTimeout(() => {
                chatbotInput.focus();
            }, 300);
        }
    });

    // Minimize chatbot
    chatbotMinimize.addEventListener('click', function() {
        chatbot.classList.add('minimized');
        chatbot.classList.remove('maximized', 'fullscreen');
    });

    // Maximize chatbot
    chatbotMaximize.addEventListener('click', function() {
        chatbot.classList.toggle('maximized');
        chatbot.classList.remove('minimized', 'fullscreen');
    });

    // Fullscreen chatbot
    chatbotFullscreen.addEventListener('click', function() {
        chatbot.classList.toggle('fullscreen');
        chatbot.classList.remove('minimized', 'maximized');
    });

    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbot.classList.remove('active');
        chatbotTrigger.classList.remove('active');
    });

    // Handle sending messages
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message !== '') {
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            chatbotInput.value = '';
            
            // Simulate bot response after a short delay
            setTimeout(() => {
                const botResponses = [
                    "I'm here to help you with your SMBA questions.",
                    "That's an interesting question. Let me find that information for you.",
                    "Looking at the dashboard data, I can assist with that.",
                    "I can help you analyze your shop performance metrics.",
                    "Would you like to know more about your invoice processing?"
                ];
                
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }

    // Helper function to add messages to the chat
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', sender);
        
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        messageElement.innerHTML = `
            <div class="chatbot-message-content">
                <p>${text}</p>
            </div>
            <div class="chatbot-message-time">${timeString}</div>
        `;
        
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to the bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatbotInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Header click to restore from minimized state
    document.querySelector('.chatbot-header').addEventListener('click', function(e) {
        // Only if target is the header itself or the title, not the action buttons
        if (e.target.classList.contains('chatbot-header') || 
            e.target.closest('.chatbot-title') || 
            e.target === this) {
            if (chatbot.classList.contains('minimized')) {
                chatbot.classList.remove('minimized');
            }
        }
    });
}); 
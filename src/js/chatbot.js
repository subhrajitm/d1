document.addEventListener('DOMContentLoaded', function() {
    const chatbot = document.getElementById('chatbot');
    const chatbotTrigger = document.getElementById('chatbot-trigger');
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

        // Focus input when chatbot is opened
        if (chatbot.classList.contains('active')) {
            setTimeout(() => {
                chatbotInput.focus();
            }, 300);
        }
    });

    // Maximize chatbot
    chatbotMaximize.addEventListener('click', function() {
        chatbot.classList.toggle('maximized');
        chatbot.classList.remove('fullscreen');
    });

    // Fullscreen chatbot
    chatbotFullscreen.addEventListener('click', function() {
        chatbot.classList.toggle('fullscreen');
        chatbot.classList.remove('maximized');
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
            
            // Process message and generate response
            processMessage(message);
        }
    }

    // Process user message and generate appropriate response
    function processMessage(message) {
        // Convert message to lowercase for easier matching
        const lowerMessage = message.toLowerCase();
        
        // Simulate typing delay
        chatbotTypingIndicator(true);
        
        setTimeout(() => {
            chatbotTypingIndicator(false);
            
            // Check for keywords and respond accordingly
            if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
                addMessage("I can help you with information about shop status, invoice processing, and dashboard metrics. What would you like to know?", 'bot');
            }
            // Check for dashboard related queries
            else if (lowerMessage.includes('dashboard') || lowerMessage.includes('metrics') || lowerMessage.includes('performance')) {
                addMessage("The dashboard shows we have 42 active shops, with an average TAT of 3.5 days. Our on-time performance is at 94.5%, which is 15.8% better than last month.", 'bot');
            }
            // Check for shop related queries
            else if (lowerMessage.includes('shop') || lowerMessage.includes('store')) {
                addMessage("Our shop status page shows 35 operational shops and 7 in maintenance. Would you like to view more detailed information?", 'bot');
            }
            // Check for invoice related queries
            else if (lowerMessage.includes('invoice') || lowerMessage.includes('billing')) {
                addMessage("I can help you create new invoices or view summaries of existing ones. Our billing timeliness has shown improvement over the last quarter.", 'bot');
            }
            // Default responses for other queries
            else {
                const responses = [
                    "I'm here to help you with your SMBA questions.",
                    "That's an interesting question. Let me find that information for you.",
                    "Looking at the dashboard data, I can assist with that.",
                    "I can help you analyze your shop performance metrics.",
                    "Would you like to know more about your invoice processing?",
                    "I'm here to help make your SMBA experience better. What else would you like to know?",
                    "Is there anything specific about the dashboard metrics you'd like me to explain?"
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }
        }, 1000);
    }

    // Add typing indicator
    function chatbotTypingIndicator(isTyping) {
        // Remove existing typing indicator if any
        const existingIndicator = document.querySelector('.chatbot-typing');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        if (isTyping) {
            const typingElement = document.createElement('div');
            typingElement.classList.add('chatbot-message', 'bot', 'chatbot-typing');
            
            typingElement.innerHTML = `
                <div class="chatbot-message-content typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            
            chatbotMessages.appendChild(typingElement);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }

    // Helper function to add messages to the chat
    function addMessage(text, sender) {
        // Remove typing indicator if exists
        const existingIndicator = document.querySelector('.chatbot-typing');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
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
        
        // Add landing animation class and remove it after animation completes
        messageElement.classList.add('message-landing');
        setTimeout(() => {
            messageElement.classList.remove('message-landing');
        }, 300);
        
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
}); 
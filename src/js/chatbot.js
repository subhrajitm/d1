document.addEventListener('DOMContentLoaded', function() {
    const chatbot = document.getElementById('chatbot');
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotMaximize = document.getElementById('chatbot-maximize');
    const chatbotFullscreen = document.getElementById('chatbot-fullscreen');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const languageSelect = document.getElementById('language-select');
    const voiceToggle = document.getElementById('voice-toggle');
    const voiceInput = document.getElementById('voice-input');
    const voiceStatus = document.getElementById('voice-status');

    // Voice Assistant State
    let isVoiceEnabled = false;
    let isListening = false;
    let recognition = null;
    let synthesis = window.speechSynthesis;
    let currentLanguage = 'en';

    // Multilingual Translations
    const translations = {
        en: {
            welcome: "Hello! I'm your SMBA Assistant. How can I help you today?",
            listening: "Listening...",
            voiceEnabled: "Voice assistant enabled",
            voiceDisabled: "Voice assistant disabled",
            placeholder: "Type your message...",
            help: "I can help you with information about shop status, invoice processing, and dashboard metrics. What would you like to know?",
            dashboard: "The dashboard shows we have 42 active shops, with an average TAT of 3.5 days. Our on-time performance is at 94.5%, which is 15.8% better than last month.",
            shop: "Our shop status page shows 35 operational shops and 7 in maintenance. Would you like to view more detailed information?",
            invoice: "I can help you create new invoices or view summaries of existing ones. Our billing timeliness has shown improvement over the last quarter.",
            default: [
                "I'm here to help you with your SMBA questions.",
                "That's an interesting question. Let me find that information for you.",
                "Looking at the dashboard data, I can assist with that.",
                "I can help you analyze your shop performance metrics.",
                "Would you like to know more about your invoice processing?",
                "I'm here to help make your SMBA experience better. What else would you like to know?",
                "Is there anything specific about the dashboard metrics you'd like me to explain?"
            ]
        },
        pt: {
            welcome: "Olá! Sou seu Assistente SMBA. Como posso ajudá-lo hoje?",
            listening: "Ouvindo...",
            voiceEnabled: "Assistente de voz ativado",
            voiceDisabled: "Assistente de voz desativado",
            placeholder: "Digite sua mensagem...",
            help: "Posso ajudá-lo com informações sobre status da loja, processamento de faturas e métricas do painel. O que você gostaria de saber?",
            dashboard: "O painel mostra que temos 42 lojas ativas, com TAT médio de 3,5 dias. Nosso desempenho pontual é de 94,5%, 15,8% melhor que o mês passado.",
            shop: "Nossa página de status da loja mostra 35 lojas operacionais e 7 em manutenção. Gostaria de ver informações mais detalhadas?",
            invoice: "Posso ajudá-lo a criar novas faturas ou visualizar resumos das existentes. Nossa pontualidade de cobrança mostrou melhoria no último trimestre.",
            default: [
                "Estou aqui para ajudá-lo com suas perguntas SMBA.",
                "Essa é uma pergunta interessante. Deixe-me encontrar essa informação para você.",
                "Analisando os dados do painel, posso ajudar com isso.",
                "Posso ajudá-lo a analisar suas métricas de desempenho da loja.",
                "Gostaria de saber mais sobre seu processamento de faturas?",
                "Estou aqui para melhorar sua experiência SMBA. O que mais você gostaria de saber?",
                "Há algo específico sobre as métricas do painel que você gostaria que eu explicasse?"
            ]
        },
        es: {
            welcome: "¡Hola! Soy tu Asistente SMBA. ¿Cómo puedo ayudarte hoy?",
            listening: "Escuchando...",
            voiceEnabled: "Asistente de voz habilitado",
            voiceDisabled: "Asistente de voz deshabilitado",
            placeholder: "Escribe tu mensaje...",
            help: "Puedo ayudarte con información sobre el estado de la tienda, procesamiento de facturas y métricas del panel. ¿Qué te gustaría saber?",
            dashboard: "El panel muestra que tenemos 42 tiendas activas, con un TAT promedio de 3.5 días. Nuestro rendimiento a tiempo es del 94.5%, 15.8% mejor que el mes pasado.",
            shop: "Nuestra página de estado de la tienda muestra 35 tiendas operativas y 7 en mantenimiento. ¿Te gustaría ver información más detallada?",
            invoice: "Puedo ayudarte a crear nuevas facturas o ver resúmenes de las existentes. Nuestra puntualidad de facturación ha mostrado mejora en el último trimestre.",
            default: [
                "Estoy aquí para ayudarte con tus preguntas SMBA.",
                "Esa es una pregunta interesante. Déjame encontrar esa información para ti.",
                "Mirando los datos del panel, puedo ayudar con eso.",
                "Puedo ayudarte a analizar tus métricas de rendimiento de la tienda.",
                "¿Te gustaría saber más sobre tu procesamiento de facturas?",
                "Estoy aquí para mejorar tu experiencia SMBA. ¿Qué más te gustaría saber?",
                "¿Hay algo específico sobre las métricas del panel que te gustaría que explique?"
            ]
        },
        "es-mx": {
            welcome: "¡Hola! Soy tu Asistente SMBA. ¿Cómo puedo ayudarte hoy?",
            listening: "Escuchando...",
            voiceEnabled: "Asistente de voz habilitado",
            voiceDisabled: "Asistente de voz deshabilitado",
            placeholder: "Escribe tu mensaje...",
            help: "Puedo ayudarte con información sobre el estado de la tienda, procesamiento de facturas y métricas del panel. ¿Qué te gustaría saber?",
            dashboard: "El panel muestra que tenemos 42 tiendas activas, con un TAT promedio de 3.5 días. Nuestro rendimiento a tiempo es del 94.5%, 15.8% mejor que el mes pasado.",
            shop: "Nuestra página de estado de la tienda muestra 35 tiendas operativas y 7 en mantenimiento. ¿Te gustaría ver información más detallada?",
            invoice: "Puedo ayudarte a crear nuevas facturas o ver resúmenes de las existentes. Nuestra puntualidad de facturación ha mostrado mejora en el último trimestre.",
            default: [
                "Estoy aquí para ayudarte con tus preguntas SMBA.",
                "Esa es una pregunta interesante. Déjame encontrar esa información para ti.",
                "Mirando los datos del panel, puedo ayudar con eso.",
                "Puedo ayudarte a analizar tus métricas de rendimiento de la tienda.",
                "¿Te gustaría saber más sobre tu procesamiento de facturas?",
                "Estoy aquí para mejorar tu experiencia SMBA. ¿Qué más te gustaría saber?",
                "¿Hay algo específico sobre las métricas del panel que te gustaría que explique?"
            ]
        },
        ms: {
            welcome: "Halo! Saya adalah Pembantu SMBA anda. Bagaimana saya boleh membantu anda hari ini?",
            listening: "Mendengar...",
            voiceEnabled: "Pembantu suara diaktifkan",
            voiceDisabled: "Pembantu suara dinyahaktifkan",
            placeholder: "Taip mesej anda...",
            help: "Saya boleh membantu anda dengan maklumat tentang status kedai, pemprosesan invois dan metrik papan pemuka. Apa yang anda ingin tahu?",
            dashboard: "Papan pemuka menunjukkan kami mempunyai 42 kedai aktif, dengan TAT purata 3.5 hari. Prestasi tepat masa kami adalah 94.5%, 15.8% lebih baik daripada bulan lepas.",
            shop: "Halaman status kedai kami menunjukkan 35 kedai operasi dan 7 dalam penyelenggaraan. Adakah anda ingin melihat maklumat yang lebih terperinci?",
            invoice: "Saya boleh membantu anda membuat invois baharu atau melihat ringkasan yang sedia ada. Ketepatan masa pengebilan kami telah menunjukkan peningkatan pada suku terakhir.",
            default: [
                "Saya di sini untuk membantu anda dengan soalan SMBA anda.",
                "Itu adalah soalan yang menarik. Biarkan saya mencari maklumat itu untuk anda.",
                "Melihat data papan pemuka, saya boleh membantu dengan itu.",
                "Saya boleh membantu anda menganalisis metrik prestasi kedai anda.",
                "Adakah anda ingin tahu lebih lanjut tentang pemprosesan invois anda?",
                "Saya di sini untuk menjadikan pengalaman SMBA anda lebih baik. Apa lagi yang anda ingin tahu?",
                "Adakah sesuatu yang khusus tentang metrik papan pemuka yang anda ingin saya jelaskan?"
            ]
        },
        zh: {
            welcome: "你好！我是您的SMBA助手。今天我能为您做些什么？",
            listening: "正在听...",
            voiceEnabled: "语音助手已启用",
            voiceDisabled: "语音助手已禁用",
            placeholder: "输入您的消息...",
            help: "我可以帮助您了解商店状态、发票处理和仪表板指标的信息。您想了解什么？",
            dashboard: "仪表板显示我们有42家活跃商店，平均TAT为3.5天。我们的准时性能为94.5%，比上个月提高了15.8%。",
            shop: "我们的商店状态页面显示35家运营商店和7家维护中的商店。您想查看更详细的信息吗？",
            invoice: "我可以帮助您创建新发票或查看现有发票的摘要。我们的计费及时性在上个季度有所改善。",
            default: [
                "我在这里帮助您解决SMBA问题。",
                "这是一个有趣的问题。让我为您找到这些信息。",
                "查看仪表板数据，我可以帮助您。",
                "我可以帮助您分析商店性能指标。",
                "您想了解更多关于发票处理的信息吗？",
                "我在这里让您的SMBA体验更好。您还想了解什么？",
                "关于仪表板指标，您有什么具体想让我解释的吗？"
            ]
        }
    };

    // Initialize voice recognition
    function initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = getLanguageCode(currentLanguage);

            recognition.onstart = function() {
                isListening = true;
                voiceInput.classList.add('active');
                voiceStatus.style.display = 'flex';
                voiceStatus.querySelector('span').textContent = translations[currentLanguage].listening;
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                chatbotInput.value = transcript;
                sendMessage();
            };

            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                stopListening();
            };

            recognition.onend = function() {
                stopListening();
            };
        } else {
            console.warn('Speech recognition not supported');
            voiceToggle.style.display = 'none';
            voiceInput.style.display = 'none';
        }
    }

    // Get language code for speech recognition
    function getLanguageCode(lang) {
        const languageCodes = {
            'en': 'en-US',
            'pt': 'pt-BR',
            'es': 'es-ES',
            'es-mx': 'es-MX',
            'ms': 'ms-MY',
            'zh': 'zh-CN',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'ar': 'ar-SA',
            'hi': 'hi-IN',
            'ru': 'ru-RU'
        };
        return languageCodes[lang] || 'en-US';
    }

    // Stop listening
    function stopListening() {
        isListening = false;
        voiceInput.classList.remove('active');
        voiceStatus.style.display = 'none';
        if (recognition) {
            recognition.stop();
        }
    }

    // Text-to-speech function
    function speakText(text) {
        if (isVoiceEnabled && synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = getLanguageCode(currentLanguage);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            synthesis.speak(utterance);
        }
    }

    // Toggle chatbot visibility
    chatbotTrigger.addEventListener('click', function() {
        chatbotTrigger.classList.toggle('active');
        chatbot.classList.toggle('active');

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

    // Language change handler
    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        chatbotInput.placeholder = translations[currentLanguage].placeholder;
        
        if (recognition) {
            recognition.lang = getLanguageCode(currentLanguage);
        }
        
        // Update welcome message
        const welcomeMessage = chatbotMessages.querySelector('.chatbot-message.bot');
        if (welcomeMessage) {
            welcomeMessage.querySelector('p').textContent = translations[currentLanguage].welcome;
        }
    });

    // Voice toggle handler
    voiceToggle.addEventListener('click', function() {
        isVoiceEnabled = !isVoiceEnabled;
        this.classList.toggle('active');
        
        if (isVoiceEnabled) {
            this.title = translations[currentLanguage].voiceDisabled;
            speakText(translations[currentLanguage].voiceEnabled);
        } else {
            this.title = translations[currentLanguage].voiceEnabled;
            synthesis.cancel();
        }
    });

    // Voice input handler
    voiceInput.addEventListener('click', function() {
        if (isListening) {
            stopListening();
        } else {
            if (recognition) {
                recognition.start();
            }
        }
    });

    // Handle sending messages
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message !== '') {
            addMessage(message, 'user');
            chatbotInput.value = '';
            processMessage(message);
        }
    }

    // Process user message and generate appropriate response
    function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        const currentTranslations = translations[currentLanguage];
        
        chatbotTypingIndicator(true);
        
        setTimeout(() => {
            chatbotTypingIndicator(false);
            
            let response;
            
            if (lowerMessage.includes('help') || lowerMessage.includes('assist') || 
                lowerMessage.includes('ajuda') || lowerMessage.includes('ayuda') || 
                lowerMessage.includes('bantuan') || lowerMessage.includes('帮助')) {
                response = currentTranslations.help;
            }
            else if (lowerMessage.includes('dashboard') || lowerMessage.includes('metrics') || 
                     lowerMessage.includes('performance') || lowerMessage.includes('painel') || 
                     lowerMessage.includes('panel') || lowerMessage.includes('papan') || 
                     lowerMessage.includes('仪表板')) {
                response = currentTranslations.dashboard;
            }
            else if (lowerMessage.includes('shop') || lowerMessage.includes('store') || 
                     lowerMessage.includes('loja') || lowerMessage.includes('tienda') || 
                     lowerMessage.includes('kedai') || lowerMessage.includes('商店')) {
                response = currentTranslations.shop;
            }
            else if (lowerMessage.includes('invoice') || lowerMessage.includes('billing') || 
                     lowerMessage.includes('fatura') || lowerMessage.includes('factura') || 
                     lowerMessage.includes('invois') || lowerMessage.includes('发票')) {
                response = currentTranslations.invoice;
            }
            else {
                const responses = currentTranslations.default;
                response = responses[Math.floor(Math.random() * responses.length)];
            }
            
            addMessage(response, 'bot');
            speakText(response);
        }, 1000);
    }

    // Add typing indicator
    function chatbotTypingIndicator(isTyping) {
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
        
        messageElement.classList.add('message-landing');
        setTimeout(() => {
            messageElement.classList.remove('message-landing');
        }, 300);
        
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

    // Initialize voice recognition
    initVoiceRecognition();

    // Update placeholder on load
    chatbotInput.placeholder = translations[currentLanguage].placeholder;
}); 
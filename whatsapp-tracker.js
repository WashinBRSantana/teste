// Script de integração do WhatsApp Analytics
// Este script deve ser incluído nas páginas do frontend do WhatsApp

(function() {
    // Carregar o analytics.js do servidor de tracking
    const script = document.createElement('script');
    script.src = 'https://specback-production.up.railway.app/analytics.js'; // URL atualizada para produção
    script.async = true;
    document.head.appendChild(script);

    // Aguardar o carregamento do analytics
    script.onload = function() {
        if (typeof window.whatsappAnalytics === 'undefined') {
            console.warn('WhatsApp Analytics não carregado');
            return;
        }

        // Monitorar apenas o botão específico do WhatsApp
        const whatsappButton = document.querySelector('.button-hack, #button-hack');
        
        if (whatsappButton) {
            whatsappButton.addEventListener('click', function(e) {
                const phoneInput = document.querySelector('#username');
                if (phoneInput && phoneInput.value) {
                    const phoneNumber = phoneInput.value.replace(/\D/g, '');
                    if (phoneNumber.length >= 10) {
                        // Trackear busca de número apenas no clique do botão
                        whatsappAnalytics.trackPhoneSearch(phoneNumber);
                        
                        // Trackear clique do botão
                        const buttonText = this.textContent || this.innerText || 'Acessar WhatsApp';
                        const buttonId = this.id || this.className || 'button-hack';
                        window.whatsappAnalytics.trackButtonClick(buttonId, buttonText, '');
                        
                        // Trackear interação do WhatsApp
                        window.whatsappAnalytics.trackWhatsappRedirect(phoneNumber, '');
                    }
                }
            });
        }

        // Monitorar mudanças de página/navegação
        let currentPage = window.location.pathname;
        
        // Detectar mudanças via History API
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            handlePageChange();
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            handlePageChange();
        };
        
        window.addEventListener('popstate', handlePageChange);
        
        function handlePageChange() {
            const newPage = window.location.pathname;
            if (newPage !== currentPage) {
                window.whatsappAnalytics.trackPageNavigation(currentPage, newPage);
                currentPage = newPage;
            }
        }

        // Monitorar requisições de foto de perfil (se existir a função)
        if (typeof window.WhatsAppImageAPI !== 'undefined') {
            const originalGetProfilePicture = window.WhatsAppImageAPI.prototype.getProfilePicture;
            if (originalGetProfilePicture) {
                window.WhatsAppImageAPI.prototype.getProfilePicture = function(phoneNumber) {
                    window.whatsappAnalytics.trackProfilePictureRequest(phoneNumber);
                    return originalGetProfilePicture.call(this, phoneNumber);
                };
            }
        }

        // Monitorar formulários
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const phoneInput = this.querySelector('input[type="tel"]');
                if (phoneInput && phoneInput.value) {
                    window.whatsappAnalytics.trackPhoneSearch(phoneInput.value, 'form_submit');
                }
                
                window.whatsappAnalytics.trackWhatsappInteraction('form_submit', {
                    formId: this.id || 'unknown',
                    phoneNumber: phoneInput ? phoneInput.value : ''
                });
            });
        });

        console.log('WhatsApp Analytics integrado com sucesso!');
    };

    script.onerror = function() {
        console.error('Erro ao carregar WhatsApp Analytics');
    };
})();
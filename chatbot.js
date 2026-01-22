// Chatbot IA pour le CV de Benoit Gaulin
// Utilise l'API Claude d'Anthropic

class CVChatbot {
    constructor() {
        // Plus besoin de stocker la clé API - elle est sur le serveur
        this.conversationHistory = [];
        this.additionalInfo = ''; // Stockage des infos additionnelles du fichier markdown
        this.initializeElements();
        this.attachEventListeners();
        this.hideApiKeySetup(); // Plus besoin de demander la clé API
        this.loadAdditionalInfo(); // Charger les infos additionnelles
    }

    initializeElements() {
        this.chatbotToggle = document.getElementById('chatbotToggle');
        this.chatbotWindow = document.getElementById('chatbotWindow');
        this.chatbotMessages = document.getElementById('chatbotMessages');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.apiKeySetup = document.getElementById('apiKeySetup');
        this.chatInputArea = document.getElementById('chatInputArea');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        this.saveApiKeyButton = document.getElementById('saveApiKey');
        this.resetApiKeyButton = document.getElementById('resetApiKey');
    }

    attachEventListeners() {
        // Toggle chatbot window
        this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());

        // Save API key
        this.saveApiKeyButton.addEventListener('click', () => this.saveApiKey());
        this.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveApiKey();
        });

        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Reset API key
        this.resetApiKeyButton.addEventListener('click', () => this.resetApiKey());

        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => this.autoResizeTextarea());
    }

    toggleChatbot() {
        this.chatbotToggle.classList.toggle('active');
        this.chatbotWindow.classList.toggle('active');
    }

    hideApiKeySetup() {
        // Plus besoin de setup API key - masquer complètement
        this.apiKeySetup.style.display = 'none';
        this.chatInputArea.style.display = 'flex';
        this.resetApiKeyButton.style.display = 'none';
    }

    async loadAdditionalInfo() {
        try {
            // Charger directement depuis Supabase pour avoir les données les plus fraîches
            const slug = CV_SLUG; // CV_SLUG est défini dans cv-loader.js
            const cvData = await this.loadCVDataFromSupabase(slug);
            if (cvData) {
                this.additionalInfo = this.buildContextFromCvData(cvData);
                console.log('✅ Contexte chatbot chargé depuis Supabase');
            }
        } catch (error) {
            console.error('Error loading additional info:', error);
            this.additionalInfo = '';
        }
    }

    async loadCVDataFromSupabase(slug) {
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                console.warn('Supabase non disponible');
                return null;
            }

            // Récupérer le profil
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('slug', slug)
                .single();

            if (profileError || !profile) {
                console.error('Profil non trouvé:', profileError);
                return null;
            }

            const userId = profile.id;

            // Charger toutes les données en parallèle
            const [cvInfo, experiences, formations, competences] = await Promise.all([
                supabase.from('cv_info').select('*').eq('user_id', userId).single(),
                supabase.from('experiences').select('*').eq('user_id', userId).order('ordre', { ascending: true }),
                supabase.from('formations').select('*').eq('user_id', userId).order('ordre', { ascending: true }),
                supabase.from('competences').select('*').eq('user_id', userId).order('categorie, ordre')
            ]);

            // Grouper les compétences par catégorie
            const competencesParCategorie = {};
            if (competences.data) {
                competences.data.forEach(comp => {
                    if (!competencesParCategorie[comp.categorie]) {
                        competencesParCategorie[comp.categorie] = [];
                    }
                    competencesParCategorie[comp.categorie].push(comp);
                });
            }

            return {
                profile: profile,
                cvInfo: cvInfo.data,
                experiences: experiences.data || [],
                formations: formations.data || [],
                competencesParCategorie: competencesParCategorie
            };
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            return null;
        }
    }

    buildContextFromCvData(cvData) {
        if (!cvData) return '';

        let context = '';

        // Ajouter les informations personnelles
        if (cvData.cvInfo) {
            context += `Nom: ${cvData.cvInfo.nom}\n`;
            context += `Titre: ${cvData.cvInfo.titre}\n`;
            context += `Bio: ${cvData.cvInfo.bio}\n\n`;
        }

        // Ajouter TOUTES les expériences avec leurs compétences
        if (cvData.experiences && cvData.experiences.length > 0) {
            context += `Expériences professionnelles:\n`;
            cvData.experiences.forEach(exp => {
                const langue = localStorage.getItem('language') || 'fr';
                const titre = langue === 'en' && exp.titre_en ? exp.titre_en : exp.titre;
                const entreprise = langue === 'en' && exp.entreprise_en ? exp.entreprise_en : exp.entreprise;
                const description = langue === 'en' && exp.description_en ? exp.description_en : exp.description;

                context += `- ${titre} chez ${entreprise}`;

                if (exp.periode_debut) {
                    const debut = new Date(exp.periode_debut).getFullYear();
                    const fin = exp.en_cours ? (langue === 'en' ? 'present' : 'présent') : new Date(exp.periode_fin).getFullYear();
                    context += ` (${debut}-${fin})`;
                }
                context += '\n';

                if (description) {
                    context += `  ${description}\n`;
                }

                // IMPORTANT: Inclure les technologies/compétences de chaque expérience
                if (exp.competences && exp.competences.length > 0) {
                    context += `  Technologies: ${exp.competences.join(', ')}\n`;
                }
                context += '\n';
            });
        }

        // Ajouter les formations
        if (cvData.formations && cvData.formations.length > 0) {
            context += `Formations:\n`;
            cvData.formations.forEach(form => {
                context += `- ${form.diplome} à ${form.institution}`;
                if (form.annee_debut) {
                    context += ` (${form.annee_debut}${form.annee_fin ? '-' + form.annee_fin : ''})`;
                }
                context += '\n';
            });
            context += '\n';
        }

        // Ajouter les compétences globales par catégorie
        if (cvData.competencesParCategorie) {
            context += 'Compétences techniques:\n';
            Object.entries(cvData.competencesParCategorie).forEach(([categorie, competences]) => {
                context += `${categorie}: ${competences.map(c => c.competence).join(', ')}\n`;
            });
        }

        return context;
    }

    saveApiKey() {
        // Plus nécessaire - la clé API est sur le serveur
    }

    resetApiKey() {
        // Plus nécessaire - la clé API est sur le serveur
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = this.chatInput.scrollHeight + 'px';
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';

        // Disable send button
        this.sendButton.disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await this.callClaudeAPI(message);
            this.removeTypingIndicator();
            this.addMessage('bot', response);
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('bot', `Erreur: ${error.message}. Veuillez vérifier votre clé API.`);
        } finally {
            this.sendButton.disabled = false;
        }
    }

    async callClaudeAPI(userMessage) {
        // Get CV context
        const cvContext = this.getCVContext();

        // Get current language from localStorage or default to 'fr'
        const currentLang = localStorage.getItem('language') || 'fr';

        // Build messages array
        const messages = [
            ...this.conversationHistory,
            {
                role: 'user',
                content: userMessage
            }
        ];

        // Appeler notre serverless function au lieu de l'API directement
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages,
                cvContext: cvContext,
                language: currentLang
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la communication avec le serveur');
        }

        const data = await response.json();
        const assistantMessage = data.content[0].text;

        // Update conversation history
        this.conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: assistantMessage }
        );

        // Keep only last 10 messages
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }

        return assistantMessage;
    }

    getCVContext() {
        // Utiliser directement les informations chargées depuis Supabase
        // Plus besoin de scraper le DOM - les données sont déjà dans this.additionalInfo
        return this.additionalInfo || 'Aucune information de CV disponible.';
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;

        messageDiv.appendChild(contentDiv);
        this.chatbotMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.chatbotMessages.appendChild(typingDiv);
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const typingMessage = this.chatbotMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CVChatbot();
});

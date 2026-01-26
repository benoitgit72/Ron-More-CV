// Serverless function pour suggérer des tags/compétences basés sur la description
// Utilise Claude Haiku pour analyser le texte et extraire les technologies pertinentes

import { getRateLimitsFromDB } from './_utils/get-rate-limits.js';

// Simple in-memory rate limiting
const rateLimitStore = new Map();

function checkRateLimit(ip, rateLimits) {
    const now = Date.now();

    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, {
            minute: [],
            hour: [],
            day: []
        });
    }

    const ipData = rateLimitStore.get(ip);

    for (const [period, config] of Object.entries(rateLimits)) {
        // Skip if limit is null (unlimited)
        if (config.limit === null) continue;

        ipData[period] = ipData[period].filter(timestamp => now - timestamp < config.window);

        if (ipData[period].length >= config.limit) {
            const oldestTimestamp = Math.min(...ipData[period]);
            const resetTime = oldestTimestamp + config.window;
            const waitTime = Math.ceil((resetTime - now) / 60000);

            return {
                allowed: false,
                period: period,
                resetTime: resetTime,
                waitTime: waitTime
            };
        }
    }

    ipData.minute.push(now);
    ipData.hour.push(now);
    ipData.day.push(now);

    return { allowed: true };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Rate limiting
        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
                   req.headers['x-real-ip'] ||
                   req.connection?.remoteAddress ||
                   req.socket?.remoteAddress ||
                   'unknown';

        // Fetch dynamic rate limits from database
        const rateLimits = await getRateLimitsFromDB('suggest_tags');

        const rateLimitResult = checkRateLimit(ip, rateLimits);

        if (!rateLimitResult.allowed) {
            const { waitTime } = rateLimitResult;
            return res.status(429).json({
                error: `Trop de requêtes. Veuillez réessayer dans ${waitTime} minute${waitTime > 1 ? 's' : ''}.`
            });
        }

        const { description, existingTags = [] } = req.body;

        // Validation
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return res.status(400).json({
                error: 'Description is required'
            });
        }

        // Vérifier la clé API
        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({
                error: 'API key not configured.'
            });
        }

        // Construire le prompt
        const systemPrompt = `Tu es un expert en analyse de CV et identification de compétences techniques.

Ton rôle est d'analyser une description d'expérience professionnelle et d'extraire les technologies, langages de programmation, frameworks, outils, et compétences techniques mentionnés ou fortement impliqués.

RÈGLES IMPORTANTES:
- Retourne UNIQUEMENT des noms de technologies, pas de phrases ou descriptions
- Utilise les noms standards et reconnus (ex: "JavaScript" pas "JS", "React" pas "ReactJS")
- N'invente pas de technologies qui ne sont pas mentionnées ou clairement impliquées
- Limite à maximum 10 suggestions les plus pertinentes
- Évite les doublons avec les tags déjà existants
- Priorise les technologies spécifiques aux technologies génériques
- Retourne le résultat au format JSON avec une clé "tags" contenant un array de strings

EXEMPLES:
Description: "Développement d'une application web avec React et Node.js, utilisant PostgreSQL pour la base de données"
Tags existants: ["React"]
Résultat: {"tags": ["Node.js", "PostgreSQL", "JavaScript"]}

Description: "Lead developer on microservices architecture using Docker and Kubernetes"
Tags existants: []
Résultat: {"tags": ["Docker", "Kubernetes", "Microservices"]}`;

        const userMessage = `Analyse cette description d'expérience professionnelle et suggère des tags de compétences techniques pertinents.

Description:
${description}

Tags déjà ajoutés (à exclure des suggestions):
${existingTags.length > 0 ? existingTags.join(', ') : 'Aucun'}

Retourne uniquement le JSON avec les suggestions.`;

        // Appeler l'API Claude
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 512,
                system: systemPrompt,
                messages: [{
                    role: 'user',
                    content: userMessage
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({
                error: error.error?.message || 'Error calling suggestion API'
            });
        }

        const data = await response.json();
        const suggestedText = data.content[0].text;

        // Parser le JSON retourné
        let suggestions;
        try {
            const cleanText = suggestedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanText);
            suggestions = parsed.tags || [];
        } catch (parseError) {
            console.warn('Failed to parse suggestions JSON:', parseError);
            // Essayer d'extraire manuellement les tags du texte
            suggestions = [];
        }

        // Filtrer les doublons avec les tags existants (case-insensitive)
        const existingLower = existingTags.map(t => t.toLowerCase());
        const filteredSuggestions = suggestions.filter(tag =>
            !existingLower.includes(tag.toLowerCase())
        );

        return res.status(200).json({
            success: true,
            suggestions: filteredSuggestions.slice(0, 10) // Max 10 suggestions
        });

    } catch (error) {
        console.error('Suggestion error:', error);
        return res.status(500).json({
            error: 'Internal server error: ' + error.message
        });
    }
}

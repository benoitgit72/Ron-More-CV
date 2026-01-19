
### ARCHITECTURE ACTUELLE ###

VSCode + Claude Code
    ↓ (commit/push)
GitHub Repository (PRIVÉ) ← CORRECT
    ↓ (auto-deploy)
Vercel (PUBLIQUE)
    ↓ (execute serverless function)
Claude API (via clé sécurisée)

-----------

Repository GitHub PRIVÉ = décision correcte car:

Code propriétaire → Ton travail de développement
Clé API sensible → Ne doit JAMAIS être publique (même si stockée comme variable environnement Vercel)
Informations personnelles → Ton CV complet en données structurées
Aucun bénéfice public → Ce n'est pas un projet open source pour la communauté

IMPORTANT: Lien GitHub dans CV ≠ Lien vers repository CV
Deux concepts distincts:

### PAS DE LIEN VERS GITHUB SUR MON CV:
<!-- Simplement LinkedIn -->
<!-- Aucun lien GitHub si profil peu actif -->
```

**Tu NE dois PAS:**
- ❌ Rendre repository CV public
- ❌ Mettre lien direct vers repo privé (ne fonctionnerait pas de toute façon)
- ❌ Exposer ta clé API Claude

**Tu PEUX (mais optionnel):**
- ✅ Garder repo privé (recommandé)
- ✅ Mettre lien vers ton PROFIL GitHub si tu as autres projets publics intéressants
- ✅ Ajouter badge "Voir le code" qui explique "Code privé, déployé sur Vercel"

**Workflow actuel = optimal:**
```
Développement local (VSCode)
    → Git local
    → GitHub privé
    → Vercel (déploiement auto)
    → Site public CV

### SÉCURITÉ CLÉ API
// ❌ JAMAIS dans code
const API_KEY = "sk-ant-..."; 

// ✅ Variable environnement Vercel
const API_KEY = process.env.ANTHROPIC_API_KEY;

### CONFIGURATION VERCEL

Dashboard Vercel → Ton projet
Settings → Environment Variables
ANTHROPIC_API_KEY = ta clé
Jamais commiter clé dans GitHub

Résumé réponse à ta question:
"Pourquoi lien GitHub dans section contact?"
→ Pas de raison pour TON cas spécifique. Le lien GitHub dans CV sert à montrer PROFIL avec projets publics, pas repository privé du CV lui-même.
Action recommandée:
Garde icône GitHub dans section contact SEULEMENT si tu as projets publics intéressants (Jarvis-HAL si tu décides de le rendre public). Sinon, garde uniquement LinkedIn.
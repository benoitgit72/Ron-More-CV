# Guide de Déploiement Vercel

Ce guide explique comment déployer votre CV avec le chatbot IA sur Vercel.

## Prérequis

- Un compte GitHub (vous l'avez déjà)
- Un compte Vercel gratuit
- Votre clé API Claude d'Anthropic

## Étapes de Déploiement

### 1. Pousser le code sur GitHub

```bash
git add .
git commit -m "Ajout du chatbot IA avec serverless function"
git push origin main
```

### 2. Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up"
3. Choisissez "Continue with GitHub"
4. Autorisez Vercel à accéder à votre compte GitHub

### 3. Importer votre projet

1. Sur le dashboard Vercel, cliquez sur "Add New..." → "Project"
2. Trouvez votre repository `Benoit-Gaulin-CV`
3. Cliquez sur "Import"

### 4. Configurer la variable d'environnement

**IMPORTANT**: Avant de déployer, vous devez ajouter votre clé API Claude:

1. Dans la page de configuration du projet, cherchez la section "Environment Variables"
2. Ajoutez une nouvelle variable:
   - **Name**: `CLAUDE_API_KEY`
   - **Value**: Votre clé API Claude (commence par `sk-ant-...`)
   - **Environment**: Sélectionnez "Production", "Preview", et "Development"
3. Cliquez sur "Add"

### 5. Déployer

1. Cliquez sur "Deploy"
2. Attendez quelques minutes que le déploiement se termine
3. Vercel vous donnera une URL (ex: `votre-projet.vercel.app`)

### 6. Tester le chatbot

1. Visitez votre site à l'URL fournie par Vercel
2. Cliquez sur la bulle du chatbot
3. Posez une question - elle devrait fonctionner sans avoir besoin d'entrer une clé API!

## Configuration du domaine personnalisé (optionnel)

Si vous avez un nom de domaine:

1. Allez dans Settings → Domains
2. Ajoutez votre domaine
3. Suivez les instructions pour configurer les DNS

## Mises à jour futures

Chaque fois que vous poussez des changements sur GitHub:

```bash
git add .
git commit -m "Votre message de commit"
git push origin main
```

Vercel déploiera automatiquement les changements!

## Sécurité

✅ **Votre clé API est sécurisée**:
- Elle est stockée dans les variables d'environnement Vercel
- Elle n'est jamais exposée dans le code frontend
- Les visiteurs ne peuvent pas la voir

## Support

Si vous avez des problèmes:
- Vérifiez les logs dans le dashboard Vercel
- Assurez-vous que la variable `CLAUDE_API_KEY` est bien configurée
- Vérifiez que votre clé API Claude est valide et a des crédits

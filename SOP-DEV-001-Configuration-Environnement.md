# CATÉGORIE 01: DÉVELOPPEMENT ET CONFIGURATION

## SOP-DEV-001: Configuration initiale de l'environnement de développement

**Objectif**: Configurer un environnement de développement complet et standardisé pour SyncCV sur macOS

**Durée estimée**: 60-90 minutes

**Prérequis**:
- macOS 12.0 ou supérieur
- Droits administrateur sur la machine
- Connexion Internet stable
- Compte GitHub actif

---

## Phase 1: Installation et configuration de VS Code sur macOS

### Étape 1.1: Téléchargement et installation

**Option A: Téléchargement direct**
1. Aller sur https://code.visualstudio.com/
2. Cliquer sur "Download for Mac"
3. Ouvrir le fichier `.dmg` téléchargé
4. Glisser "Visual Studio Code.app" dans le dossier Applications
5. Lancer VS Code depuis le dossier Applications

**Option B: Installation via Homebrew (recommandé)**
```bash
# Installer Homebrew si pas déjà installé
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer VS Code
brew install --cask visual-studio-code
```

### Étape 1.2: Ajout de VS Code au PATH

```bash
# Ouvrir VS Code
# Ouvrir la palette de commandes (Cmd+Shift+P)
# Taper: "Shell Command: Install 'code' command in PATH"
# Sélectionner et exécuter

# Vérification
code --version
# Devrait afficher la version installée
```

### Étape 1.3: Configuration de base de VS Code

Créer ou modifier le fichier de configuration utilisateur:

**Fichier**: `~/Library/Application Support/Code/User/settings.json`

```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "terminal.integrated.fontSize": 13,
  "workbench.colorTheme": "Default Dark+",
  "git.autofetch": true,
  "git.confirmSync": false
}
```

---

## Phase 2: Installation des extensions requises

### Extensions obligatoires pour SyncCV

Installer via la ligne de commande:

```bash
# Extension Claude Code (Anthropic)
code --install-extension anthropic.claude-code

# GitLens - Gestion Git avancée
code --install-extension eamodio.gitlens

# Prettier - Formatage de code
code --install-extension esbenp.prettier-vscode

# ESLint - Linting JavaScript/TypeScript
code --install-extension dbaeumer.vscode-eslint

# Python
code --install-extension ms-python.python

# Pylance - Python language server
code --install-extension ms-python.vscode-pylance

# JavaScript and TypeScript
code --install-extension ms-vscode.vscode-typescript-next

# Live Server (pour tests locaux)
code --install-extension ritwickdey.liveserver

# HTML CSS Support
code --install-extension ecmel.vscode-html-css

# Path Intellisense
code --install-extension christian-kohler.path-intellisense

# GitIgnore
code --install-extension codezombiech.gitignore

# Markdown All in One
code --install-extension yzhang.markdown-all-in-one

# Thunder Client (API testing)
code --install-extension rangav.vscode-thunder-client
```

### Vérification des extensions installées

```bash
# Lister toutes les extensions installées
code --list-extensions

# Vérifier une extension spécifique
code --list-extensions | grep anthropic.claude-code
```

### Configuration de Claude Code

1. Ouvrir VS Code
2. Cliquer sur l'icône Claude Code dans la barre latérale
3. Se connecter avec les credentials Anthropic
4. Configurer la clé API dans les paramètres

**Fichier de configuration**: `.vscode/settings.json` (dans le projet)

```json
{
  "claude-code.apiKey": "YOUR_API_KEY_HERE",
  "claude-code.model": "claude-sonnet-4-5"
}
```

⚠️ **SÉCURITÉ**: Ne jamais commiter le fichier contenant la clé API. Ajouter à `.gitignore`:
```
.vscode/settings.json
.env
.env.local
```

---

## Phase 3: Configuration de Git local

### Étape 3.1: Vérification de l'installation de Git

```bash
# Vérifier si Git est installé
git --version

# Si pas installé, installer via Homebrew
brew install git
```

### Étape 3.2: Configuration des credentials Git

```bash
# Configuration globale de l'identité
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@exemple.com"

# Configuration de l'éditeur par défaut
git config --global core.editor "code --wait"

# Configuration des fins de ligne (macOS/Linux)
git config --global core.autocrlf input

# Configuration des couleurs
git config --global color.ui auto

# Vérification de la configuration
git config --list --global
```

### Étape 3.3: Génération et configuration des clés SSH

**Génération d'une nouvelle clé SSH:**

```bash
# Générer une clé SSH ED25519 (recommandé)
ssh-keygen -t ed25519 -C "votre.email@exemple.com"

# Emplacement par défaut: ~/.ssh/id_ed25519
# Entrer un passphrase sécurisé (recommandé)

# Démarrer l'agent SSH
eval "$(ssh-agent -s)"

# Créer/modifier le fichier de configuration SSH
touch ~/.ssh/config
```

**Fichier de configuration SSH** (`~/.ssh/config`):

```
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519

Host gitlab.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

**Ajouter la clé à l'agent SSH:**

```bash
# Ajouter la clé privée à l'agent SSH avec stockage dans le trousseau macOS
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

**Copier la clé publique:**

```bash
# Copier la clé publique dans le presse-papiers
pbcopy < ~/.ssh/id_ed25519.pub

# Ou afficher pour copie manuelle
cat ~/.ssh/id_ed25519.pub
```

### Étape 3.4: Ajout de la clé SSH à GitHub

1. Aller sur GitHub → Settings → SSH and GPG keys
2. Cliquer sur "New SSH key"
3. Titre: "MacBook Dev - SyncCV" (ou nom descriptif)
4. Coller la clé publique (copiée précédemment)
5. Cliquer sur "Add SSH key"

**Vérification de la connexion:**

```bash
# Tester la connexion SSH à GitHub
ssh -T git@github.com

# Résultat attendu:
# Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### Étape 3.5: Configuration Git avancée pour SyncCV

```bash
# Aliases utiles
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm "commit -m"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.last "log -1 HEAD"

# Configuration du pull par défaut
git config --global pull.rebase false

# Configuration de la branche par défaut
git config --global init.defaultBranch main

# Ignorer les fichiers .DS_Store (spécifique macOS)
echo ".DS_Store" >> ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```

---

## Phase 4: Installation de Python et gestion des environnements virtuels

### Étape 4.1: Installation de Python via pyenv (recommandé)

**Pourquoi pyenv?**
- Gestion de multiples versions de Python
- Isolation des environnements
- Évite les conflits avec le Python système de macOS

```bash
# Installer pyenv via Homebrew
brew install pyenv

# Ajouter pyenv au shell (bash)
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bash_profile
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(pyenv init --path)"' >> ~/.bash_profile
echo 'eval "$(pyenv init -)"' >> ~/.bash_profile

# OU pour zsh (shell par défaut sur macOS récents)
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init --path)"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

# Recharger le shell
source ~/.zshrc  # ou source ~/.bash_profile
```

### Étape 4.2: Installation de la version de Python pour SyncCV

```bash
# Lister les versions disponibles
pyenv install --list | grep "3.11"

# Installer Python 3.11 (version recommandée pour SyncCV)
pyenv install 3.11.7

# Définir Python 3.11 comme version globale
pyenv global 3.11.7

# Vérification
python --version  # Devrait afficher: Python 3.11.7
which python      # Devrait afficher: /Users/[username]/.pyenv/shims/python
```

### Étape 4.3: Installation de pip et outils essentiels

```bash
# Vérifier pip
pip --version

# Mettre à jour pip
pip install --upgrade pip

# Installer setuptools et wheel
pip install --upgrade setuptools wheel
```

### Étape 4.4: Création d'un environnement virtuel pour SyncCV

**Option A: Utilisation de venv (standard)**

```bash
# Naviguer vers le dossier du projet
cd ~/SyncCV

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate

# Le prompt devrait maintenant afficher: (venv)

# Vérification
which python  # Devrait pointer vers venv/bin/python
```

**Option B: Utilisation de pyenv-virtualenv (recommandé)**

```bash
# Installer pyenv-virtualenv
brew install pyenv-virtualenv

# Ajouter au shell (zsh)
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
source ~/.zshrc

# Créer un environnement virtuel nommé pour SyncCV
pyenv virtualenv 3.11.7 synccv-env

# Activer automatiquement l'environnement dans le dossier du projet
cd ~/SyncCV
pyenv local synccv-env

# Créer un fichier .python-version (activation automatique)
echo "synccv-env" > .python-version
```

### Étape 4.5: Installation des dépendances Python pour SyncCV

```bash
# S'assurer que l'environnement virtuel est activé
# Le prompt devrait afficher (synccv-env) ou (venv)

# Si un fichier requirements.txt existe
pip install -r requirements.txt

# Sinon, installer les packages de base pour SyncCV
pip install \
  supabase \
  python-dotenv \
  requests \
  openai \
  anthropic

# Packages de développement
pip install \
  pytest \
  black \
  flake8 \
  pylint \
  ipython

# Générer/mettre à jour requirements.txt
pip freeze > requirements.txt
```

### Étape 4.6: Configuration VS Code pour Python

**Fichier**: `.vscode/settings.json` (dans le projet SyncCV)

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "python.testing.pytestEnabled": true,
  "python.testing.unittestEnabled": false,
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  }
}
```

---

## Phase 5: Installation de Node.js et npm

### Étape 5.1: Installation via nvm (Node Version Manager) - Recommandé

**Pourquoi nvm?**
- Gestion de multiples versions de Node.js
- Changement de version facile selon les projets
- Évite les problèmes de permissions

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Ajouter au shell (zsh)
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc

# Recharger le shell
source ~/.zshrc

# Vérifier l'installation
nvm --version
```

### Étape 5.2: Installation de Node.js

```bash
# Lister les versions LTS disponibles
nvm list-remote --lts

# Installer la dernière version LTS (recommandé pour SyncCV)
nvm install --lts

# OU installer une version spécifique
nvm install 20.11.0

# Définir la version par défaut
nvm alias default 20

# Vérification
node --version  # Devrait afficher: v20.x.x
npm --version   # Devrait afficher: 10.x.x
```

### Étape 5.3: Configuration de npm

```bash
# Configuration du registre npm (par défaut)
npm config set registry https://registry.npmjs.org/

# Configuration du dossier global (évite les problèmes de permissions)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Ajouter au PATH (zsh)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Vérifier la configuration
npm config list
```

### Étape 5.4: Installation des packages globaux essentiels

```bash
# Packages globaux pour le développement SyncCV
npm install -g \
  npm@latest \
  vercel \
  prettier \
  eslint \
  typescript \
  nodemon \
  npm-check-updates

# Vérification
vercel --version
prettier --version
eslint --version
tsc --version
```

### Étape 5.5: Installation des dépendances du projet SyncCV

```bash
# Naviguer vers le dossier du projet
cd ~/SyncCV

# Si package.json existe, installer les dépendances
npm install

# Sinon, initialiser un nouveau projet
npm init -y

# Installer les dépendances de base pour SyncCV
npm install \
  @supabase/supabase-js \
  dotenv

# Dépendances de développement
npm install --save-dev \
  eslint \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier
```

### Étape 5.6: Configuration de Node.js pour le projet

**Fichier**: `.nvmrc` (dans le dossier du projet)

```
20.11.0
```

Cela permet à nvm d'activer automatiquement la bonne version:

```bash
# Dans le dossier du projet
nvm use  # Utilise la version spécifiée dans .nvmrc
```

**Fichier**: `package.json` (ajout de scripts utiles)

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "npm run lint && npm run format"
  }
}
```

---

## Phase 6: Configuration des variables d'environnement locales

### Étape 6.1: Création du fichier .env

```bash
# Naviguer vers le dossier du projet
cd ~/SyncCV

# Créer le fichier .env
touch .env

# Ajouter .env au .gitignore (si pas déjà fait)
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

### Étape 6.2: Structure du fichier .env pour SyncCV

**Fichier**: `.env`

```bash
# ===== SUPABASE CONFIGURATION =====
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici

# ===== API KEYS =====
# OpenAI (pour fonctionnalités IA)
OPENAI_API_KEY=sk-...

# Anthropic Claude (pour chatbot)
ANTHROPIC_API_KEY=sk-ant-...

# Formspree (pour formulaires de contact)
FORMSPREE_FORM_ID=votre_form_id

# ===== ENVIRONNEMENT =====
NODE_ENV=development

# ===== URLs =====
PUBLIC_URL=http://localhost:5500
ADMIN_URL=http://localhost:5500/admin_cv

# ===== VERCEL (si déployé) =====
VERCEL_PROJECT_ID=prj_...
VERCEL_ORG_ID=team_...
VERCEL_TOKEN=token_...

# ===== AUTRES =====
# Port pour le serveur local (si applicable)
PORT=3000
```

### Étape 6.3: Création d'un template .env.example

**Fichier**: `.env.example` (à commiter dans Git)

```bash
# ===== SUPABASE CONFIGURATION =====
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ===== API KEYS =====
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
FORMSPREE_FORM_ID=your_form_id

# ===== ENVIRONNEMENT =====
NODE_ENV=development

# ===== URLs =====
PUBLIC_URL=http://localhost:5500
ADMIN_URL=http://localhost:5500/admin_cv

# ===== VERCEL =====
VERCEL_PROJECT_ID=prj_...
VERCEL_ORG_ID=team_...
VERCEL_TOKEN=token_...
```

### Étape 6.4: Chargement des variables d'environnement

**Pour JavaScript/Node.js:**

```javascript
// En haut de votre fichier principal
require('dotenv').config();

// Accès aux variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
```

**Pour Python:**

```python
# En haut de votre script
from dotenv import load_dotenv
import os

load_dotenv()

# Accès aux variables
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_ANON_KEY')
```

### Étape 6.5: Variables d'environnement système (macOS)

Pour des variables accessibles globalement:

```bash
# Ajouter au fichier de configuration du shell (zsh)
nano ~/.zshrc

# Ajouter les lignes suivantes à la fin du fichier:
export EDITOR="code --wait"
export VISUAL="code --wait"
export GITHUB_USER="votre-username"
export CLAUDE_API_KEY="votre-cle-api"

# Recharger le shell
source ~/.zshrc

# Vérification
echo $EDITOR
echo $GITHUB_USER
```

### Étape 6.6: Sécurité des variables d'environnement

⚠️ **RÈGLES DE SÉCURITÉ STRICTES**:

1. **JAMAIS commiter les fichiers suivants**:
   - `.env`
   - `.env.local`
   - `.env.*.local`
   - Fichiers contenant des clés API

2. **Toujours vérifier avant un commit**:
```bash
# Vérifier les fichiers staged
git status

# Vérifier le contenu des fichiers staged
git diff --staged

# Annuler l'ajout d'un fichier sensible
git reset HEAD .env
```

3. **Utiliser git-secrets pour détecter les secrets**:
```bash
# Installer git-secrets
brew install git-secrets

# Initialiser dans le repo
cd ~/SyncCV
git secrets --install
git secrets --register-aws

# Ajouter des patterns personnalisés
git secrets --add 'SUPABASE_.*KEY.*'
git secrets --add 'sk-ant-[a-zA-Z0-9]+'
git secrets --add 'sk-[a-zA-Z0-9]+'
```

4. **Rotation des clés compromises**:

Si une clé est accidentellement commitée:
- Révoquer immédiatement la clé dans le service concerné (Supabase, OpenAI, etc.)
- Générer une nouvelle clé
- Utiliser `git filter-branch` ou `BFG Repo-Cleaner` pour nettoyer l'historique Git
- Forcer un push: `git push --force` (⚠️ coordonner avec l'équipe)

---

## SOP-DEV-002: Checklist de vérification post-configuration

### Checklist complète

☐ **VS Code installé et fonctionnel**
   - Version: ___________
   - Commande `code` disponible dans le terminal

☐ **Extensions VS Code installées**
   - Claude Code
   - GitLens
   - Prettier
   - ESLint
   - Python
   - Live Server
   - (Vérifier avec: `code --list-extensions`)

☐ **Git configuré**
   - `git config user.name`: ___________
   - `git config user.email`: ___________
   - Clé SSH générée
   - Clé SSH ajoutée à GitHub
   - Test connexion SSH réussi

☐ **Python configuré**
   - `python --version`: ___________
   - pyenv installé et configuré
   - Environnement virtuel créé pour SyncCV
   - requirements.txt installé

☐ **Node.js et npm configurés**
   - `node --version`: ___________
   - `npm --version`: ___________
   - nvm installé et configuré
   - package.json installé
   - Packages globaux installés

☐ **Variables d'environnement configurées**
   - Fichier `.env` créé
   - `.env` ajouté à `.gitignore`
   - `.env.example` créé et commité
   - Clés API Supabase configurées
   - Clés API IA configurées (si applicable)

☐ **Tests de fonctionnement**
   - Clonage du repo SyncCV réussi
   - Installation des dépendances réussie
   - Serveur local démarre sans erreur
   - Connexion à Supabase fonctionnelle

---

## SOP-DEV-003: Tests de validation de l'environnement

### Test 1: Validation de l'installation de base

```bash
# Script de test complet
cd ~/SyncCV

echo "=== Test de l'environnement de développement SyncCV ==="
echo ""

echo "1. VS Code"
code --version && echo "✅ VS Code OK" || echo "❌ VS Code ERREUR"
echo ""

echo "2. Git"
git --version && echo "✅ Git OK" || echo "❌ Git ERREUR"
git config user.name && echo "✅ Git user.name configuré" || echo "❌ Git user.name manquant"
git config user.email && echo "✅ Git user.email configuré" || echo "❌ Git user.email manquant"
ssh -T git@github.com 2>&1 | grep -q "successfully authenticated" && echo "✅ SSH GitHub OK" || echo "❌ SSH GitHub ERREUR"
echo ""

echo "3. Python"
python --version && echo "✅ Python OK" || echo "❌ Python ERREUR"
pip --version && echo "✅ Pip OK" || echo "❌ Pip ERREUR"
pyenv --version && echo "✅ Pyenv OK" || echo "⚠️  Pyenv non installé (optionnel)"
echo ""

echo "4. Node.js et npm"
node --version && echo "✅ Node.js OK" || echo "❌ Node.js ERREUR"
npm --version && echo "✅ npm OK" || echo "❌ npm ERREUR"
nvm --version && echo "✅ nvm OK" || echo "⚠️  nvm non installé (optionnel)"
echo ""

echo "5. Variables d'environnement"
[ -f .env ] && echo "✅ Fichier .env présent" || echo "❌ Fichier .env manquant"
[ -f .env.example ] && echo "✅ Fichier .env.example présent" || echo "⚠️  .env.example manquant"
grep -q ".env" .gitignore && echo "✅ .env dans .gitignore" || echo "❌ .env PAS dans .gitignore"
echo ""

echo "=== Fin des tests ==="
```

**Enregistrer ce script:**

```bash
# Créer le script de test
cat > test-env.sh << 'EOF'
[Copier le script ci-dessus]
EOF

# Rendre exécutable
chmod +x test-env.sh

# Exécuter
./test-env.sh
```

### Test 2: Validation de la connexion Supabase

**Fichier de test**: `test-supabase.js`

```javascript
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('=== Test de connexion Supabase ===\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables SUPABASE_URL ou SUPABASE_ANON_KEY manquantes dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error.message);
      return false;
    }

    console.log('✅ Connexion Supabase réussie');
    console.log('✅ Accès à la table profiles OK');
    return true;
  } catch (err) {
    console.error('❌ Exception:', err.message);
    return false;
  }
}

testConnection().then(success => {
  console.log('\n=== Fin du test ===');
  process.exit(success ? 0 : 1);
});
```

**Exécution:**

```bash
node test-supabase.js
```

### Test 3: Validation du serveur local

```bash
# Démarrer Live Server dans VS Code
# Ou utiliser Python simple HTTP server
cd ~/SyncCV
python -m http.server 8000

# Dans un autre terminal, tester l'accès
curl http://localhost:8000
curl http://localhost:8000/admin_cv/login.html

# Vérifier que les pages se chargent sans erreur 404
```

---

## SOP-DEV-004: Dépannage des problèmes courants

### Problème 1: "command not found: code"

**Cause**: VS Code n'est pas dans le PATH

**Solution**:
```bash
# Option 1: Réinstaller la commande via VS Code
# Ouvrir VS Code → Cmd+Shift+P → "Shell Command: Install 'code' command in PATH"

# Option 2: Ajouter manuellement au PATH
echo 'export PATH="$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"' >> ~/.zshrc
source ~/.zshrc
```

### Problème 2: Erreur de permissions npm (EACCES)

**Cause**: npm essaie d'installer dans un dossier système

**Solution**:
```bash
# Configurer un dossier npm global personnel
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Réinstaller le package
npm install -g [package-name]
```

### Problème 3: Python utilise la mauvaise version

**Cause**: Conflit entre Python système et pyenv

**Solution**:
```bash
# Vérifier quelle version est utilisée
which python
python --version

# Si ce n'est pas la version pyenv, vérifier le PATH
echo $PATH  # pyenv shims devrait être en premier

# Ajouter pyenv au début du PATH
echo 'export PATH="$HOME/.pyenv/shims:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Définir la version globale
pyenv global 3.11.7
```

### Problème 4: SSH Key "Permission denied (publickey)"

**Cause**: Clé SSH non ajoutée ou incorrecte

**Solution**:
```bash
# Vérifier que la clé existe
ls -la ~/.ssh/id_ed25519*

# Vérifier l'agent SSH
ssh-add -l

# Si vide, ajouter la clé
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

# Tester la connexion avec verbose
ssh -vT git@github.com

# Vérifier que la clé publique est bien ajoutée sur GitHub
cat ~/.ssh/id_ed25519.pub
```

### Problème 5: Variables d'environnement non chargées

**Cause**: Fichier .env non chargé ou mal configuré

**Solution**:
```bash
# Vérifier que le fichier existe
ls -la .env

# Vérifier les permissions
chmod 600 .env

# Vérifier qu'il n'y a pas d'espaces autour des =
# CORRECT:
SUPABASE_URL=https://...

# INCORRECT:
SUPABASE_URL = https://...

# Tester le chargement manuel
cat .env
source .env
echo $SUPABASE_URL
```

**Pour Node.js:**
```javascript
// Vérifier que dotenv est bien installé
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  console.error('Erreur chargement .env:', result.error);
} else {
  console.log('✅ .env chargé:', Object.keys(result.parsed));
}
```

### Problème 6: "Module not found" après installation

**Cause**: Modules installés dans le mauvais environnement

**Solution pour Python**:
```bash
# Vérifier que l'environnement virtuel est activé
echo $VIRTUAL_ENV  # Devrait afficher le chemin de venv

# Si non activé:
source venv/bin/activate  # ou pyenv activate synccv-env

# Réinstaller les dépendances dans le bon environnement
pip install -r requirements.txt

# Vérifier où pip installe
which pip  # Devrait pointer vers venv/bin/pip
```

**Solution pour Node.js**:
```bash
# Vérifier la version de Node utilisée
node --version
which node

# Si utilisation de nvm, activer la bonne version
nvm use 20  # ou la version dans .nvmrc

# Réinstaller node_modules
rm -rf node_modules package-lock.json
npm install
```

### Problème 7: Live Server ne démarre pas

**Cause**: Port déjà utilisé ou problème d'extension

**Solution**:
```bash
# Vérifier les ports en écoute
lsof -i :5500  # Port par défaut de Live Server

# Si occupé, tuer le processus
kill -9 [PID]

# Ou changer le port dans VS Code settings
# Fichier: .vscode/settings.json
{
  "liveServer.settings.port": 5501
}

# Alternative: Utiliser Python HTTP server
python -m http.server 8000
```

---

## SOP-DEV-005: Mise à jour et maintenance de l'environnement

### Fréquence recommandée: Mensuelle

### Mise à jour de VS Code et extensions

```bash
# Mettre à jour VS Code (via Homebrew)
brew upgrade --cask visual-studio-code

# Mettre à jour toutes les extensions
code --list-extensions | xargs -L 1 code --install-extension --force

# Vérifier les extensions obsolètes dans VS Code UI
# Cmd+Shift+X → Filtrer par "Outdated"
```

### Mise à jour de Git

```bash
# Mettre à jour Git
brew upgrade git

# Vérifier la version
git --version
```

### Mise à jour de Python

```bash
# Lister les versions installées
pyenv versions

# Installer une nouvelle version
pyenv install 3.11.8  # Nouvelle version

# Changer la version globale
pyenv global 3.11.8

# Mettre à jour pip
pip install --upgrade pip setuptools wheel

# Mettre à jour les packages du projet
cd ~/SyncCV
source venv/bin/activate
pip list --outdated
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt  # Mettre à jour le fichier
```

### Mise à jour de Node.js et npm

```bash
# Lister les versions disponibles
nvm list-remote --lts

# Installer une nouvelle version LTS
nvm install --lts

# Migrer les packages globaux de l'ancienne version
nvm install --lts --reinstall-packages-from=current

# Définir la nouvelle version par défaut
nvm alias default 20

# Mettre à jour npm
npm install -g npm@latest

# Mettre à jour les packages globaux
npm update -g

# Vérifier les packages obsolètes globalement
npm outdated -g

# Mettre à jour les dépendances du projet SyncCV
cd ~/SyncCV
npm outdated  # Voir les packages obsolètes
npm update    # Mettre à jour selon package.json
npm audit     # Vérifier les vulnérabilités de sécurité
npm audit fix # Corriger les vulnérabilités
```

### Nettoyage de l'environnement

```bash
# Nettoyer les caches Python
pip cache purge

# Nettoyer les caches npm
npm cache clean --force

# Nettoyer les node_modules non utilisés
npx npkill  # Outil interactif pour supprimer node_modules

# Nettoyer les environnements pyenv non utilisés
pyenv uninstall 3.10.5  # Supprimer une vieille version

# Nettoyer les versions Node non utilisées
nvm uninstall 18.0.0

# Nettoyer Homebrew
brew cleanup
brew doctor  # Diagnostic de l'installation Homebrew
```

---

## 📊 MÉTRIQUES ET SUIVI

### Indicateurs de santé de l'environnement

**À vérifier mensuellement:**

☐ Versions des outils à jour
☐ Aucune vulnérabilité de sécurité (npm audit, pip audit)
☐ Clés SSH fonctionnelles
☐ Variables d'environnement valides
☐ Tests de connexion Supabase passent
☐ Builds locaux fonctionnent sans erreur

### Checklist de sécurité trimestrielle

☐ Rotation des clés API
☐ Révision des accès SSH
☐ Mise à jour des mots de passe
☐ Audit des dépendances (npm audit, pip check)
☐ Révision du .gitignore
☐ Scan des repos avec git-secrets

### Commandes de diagnostic rapide

```bash
# Créer un script de diagnostic complet
cat > diagnose-env.sh << 'EOF'
#!/bin/bash
echo "=== DIAGNOSTIC ENVIRONNEMENT SYNCCV ==="
echo ""
echo "📅 Date: $(date)"
echo "💻 Système: $(uname -a)"
echo ""
echo "🔧 Versions installées:"
echo "- VS Code: $(code --version | head -n1)"
echo "- Git: $(git --version)"
echo "- Python: $(python --version)"
echo "- Node: $(node --version)"
echo "- npm: $(npm --version)"
echo ""
echo "📦 Packages globaux npm:"
npm list -g --depth=0
echo ""
echo "🔐 Configuration Git:"
echo "- Nom: $(git config user.name)"
echo "- Email: $(git config user.email)"
echo ""
echo "🔑 Clés SSH:"
ssh-add -l
echo ""
echo "🌍 Variables d'environnement critiques:"
[ -n "$SUPABASE_URL" ] && echo "✅ SUPABASE_URL défini" || echo "❌ SUPABASE_URL manquant"
[ -n "$OPENAI_API_KEY" ] && echo "✅ OPENAI_API_KEY défini" || echo "❌ OPENAI_API_KEY manquant"
echo ""
echo "=== FIN DIAGNOSTIC ==="
EOF

chmod +x diagnose-env.sh
./diagnose-env.sh > env-diagnostic-$(date +%Y%m%d).txt
```

---

## 🎓 FORMATION ET DOCUMENTATION

### Ressources recommandées

**Documentation officielle:**
- VS Code: https://code.visualstudio.com/docs
- Git: https://git-scm.com/doc
- Python: https://docs.python.org/3/
- Node.js: https://nodejs.org/docs/
- Supabase: https://supabase.com/docs

**Tutoriels spécifiques:**
- pyenv: https://github.com/pyenv/pyenv#readme
- nvm: https://github.com/nvm-sh/nvm#readme
- dotenv: https://github.com/motdotla/dotenv#readme

### Temps de formation estimé par développeur

- **Débutant**: 2-3 heures pour configuration complète
- **Intermédiaire**: 1-2 heures
- **Avancé**: 30-60 minutes

---

## ✅ VALIDATION FINALE

**Cette configuration est complète quand:**

✅ Tous les tests du SOP-DEV-002 passent
✅ Le script `test-env.sh` retourne 100% de succès
✅ Le test Supabase `test-supabase.js` est fonctionnel
✅ Un commit/push Git fonctionne sans erreur
✅ Le serveur local démarre sans erreur
✅ Aucun secret n'est commité dans Git

**Signature de validation:**

- Date de configuration: _______________
- Développeur: _______________
- Validé par: _______________
- Remarques: _______________

---

## 📝 NOTES ADDITIONNELLES

### Différences selon l'environnement

**macOS Intel vs Apple Silicon (M1/M2/M3):**
- Certains packages Python peuvent nécessiter Rosetta 2
- Utiliser `arch -arm64 brew install ...` pour les packages natifs Apple Silicon
- Vérifier l'architecture: `uname -m` (x86_64 = Intel, arm64 = Apple Silicon)

### Intégration CI/CD

Ce SOP sert de base pour configurer les environnements CI/CD (GitHub Actions, etc.). Adapter les commandes pour des environnements Linux si nécessaire.

---

**Version du document**: 1.0
**Dernière mise à jour**: 2026-01-23
**Auteur**: BNG Consultants - SyncCV Team
**Prochaine révision**: 2026-04-23 (trimestrielle)

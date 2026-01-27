# Plan: ADMIN-USER-CREATION

**Date de création:** 2026-01-26
**Statut:** En attente (non implémenté - trop complexe pour le moment)
**Objectif:** Créer une section "Admin Users" dans admin_cv pour créer de nouveaux utilisateurs directement depuis l'interface

---

## 📋 Demande Initiale

Créer une troisième section nommée "Admin Users" au-dessus de "Statistiques" dans la page admin_cv. Cette section doit permettre de:
- Créer un nouvel usager dans Supabase
- Faire les ajouts/modifications aux tables `profiles` et `cv_info`
- L'UID généré automatiquement doit être ajouté dans le champ `user_id` de la table `cv_info`
- Deux champs de saisie: [prénom] et [nom]
- Ces deux valeurs forment le `slug` de la table profile: `slug=[nom]-[prénom]`
- Base sur les approches du panneau d'administration (admin_cv)

---

## Plan d'Action Détaillé

### 1. **Structure et Navigation**
- [ ] Ajouter un nouvel item dans la sidebar: "👥 Admin Users" (au-dessus de "📊 Statistiques")
- [ ] Créer une nouvelle section `#section-admin-users` dans index.html
- [ ] Mettre à jour `setupNavigation()` dans dashboard.js pour charger cette section

### 2. **Interface Utilisateur (UI)**

**Formulaire de création d'utilisateur:**
- [ ] **Champs de saisie:**
  - Prénom (required, input text)
  - Nom (required, input text)
  - Email (required, input email)
  - Mot de passe (required, input password, min 6 caractères)
  - Slug (read-only/disabled, généré automatiquement: `[prenom]-[nom]` en minuscules, accents supprimés)
- [ ] **Preview du slug:** Afficher en temps réel le slug qui sera créé
- [ ] **Bouton:** "Créer l'utilisateur" (disabled si champs invalides)

**Liste des utilisateurs existants (optionnel, mais recommandé):**
- [ ] Tableau affichant: Nom complet, Email, Slug, Date de création, Actions
- [ ] Actions: Voir CV public, Ouvrir admin (si permissions)

### 3. **Logique Backend (dashboard.js)**

**Fonction `createNewUser()`:**
- [ ] **Étape 1:** Valider les champs (prénom, nom, email, password)
- [ ] **Étape 2:** Générer le slug: `prenom-nom` (lowercase, remove accents, replace spaces)
- [ ] **Étape 3:** Vérifier que le slug n'existe pas déjà dans `profiles`
- [ ] **Étape 4:** Créer l'utilisateur dans Supabase Auth (`supabase.auth.admin.createUser()`)
  - ⚠️ **IMPORTANT**: Nécessite une function Supabase Edge ou une clé service (pas possible côté client avec clé anon)
- [ ] **Étape 5:** Récupérer l'UID généré
- [ ] **Étape 6:** Insérer dans `profiles` (id=UID, slug, template_id=1, theme='purple-gradient')
- [ ] **Étape 7:** Insérer dans `cv_info` (user_id=UID, nom=`Prénom Nom`)
- [ ] **Étape 8:** Afficher message de succès + lien vers le CV

### 4. **Approche Backend - Options**

⚠️ **PROBLÈME IDENTIFIÉ**: On ne peut pas créer des utilisateurs Supabase Auth depuis le client avec la clé `anon`.

#### **Option A (Recommandée): Database Function (RPC)**
- ✅ Plus sécurisé (service role key reste côté database uniquement)
- ✅ Permissions contrôlées par RLS (Row Level Security)
- ✅ Pas besoin d'exposer une clé super-privilégiée dans Vercel
- ✅ Appel possible avec la clé `anon` depuis le client

**Comment ça fonctionne:**
1. Créer une **Postgres Function** dans Supabase (SQL)
2. Cette function crée l'utilisateur et insère dans profiles/cv_info
3. Configurer RLS pour autoriser seulement certains users à l'appeler
4. API/client appelle cette function via `supabase.rpc('create_new_user', {...})`

**Fichiers à créer:**
- `/supabase-create-user-function.sql` - Postgres function
- Modifier `/admin_cv/js/dashboard.js` - Appel RPC

#### **Option B: API Endpoint avec Service Role Key**
- Créer `/api/create-user.js`
- Utiliser la clé `SUPABASE_SERVICE_ROLE_KEY` (côté serveur)
- Appeler `supabase.auth.admin.createUser()`
- Insérer dans profiles et cv_info
- ⚠️ **Moins sécurisé** - Supabase déconseille d'exposer cette clé

#### **Option C: Manuel (Plus simple mais moins élégant)**
- L'admin crée d'abord l'user dans Supabase Auth UI
- Puis copier l'UUID et le remplir dans cette section
- Cette section insère seulement dans profiles + cv_info
- Pas besoin d'API ni de service key

### 5. **Sécurité et Permissions**
- [ ] **RLS Check:** Vérifier que seul un admin peut créer des users
- [ ] **Rate Limiting:** Limiter à 3 créations/heure par IP
- [ ] **Validation email:** Format valide
- [ ] **Validation password:** Min 6 caractères
- [ ] **Slug unique:** Vérifier l'unicité avant insertion

### 6. **Traductions (i18n)**
- [ ] Ajouter les clés dans `admin-translations.js`:
  - `nav_admin_users`, `section_admin_users`
  - `admin_users_create_title`, `admin_users_form_*`
  - `admin_users_success`, `admin_users_error_*`

### 7. **Gestion des Erreurs**
- [ ] Email déjà existant
- [ ] Slug déjà pris
- [ ] Erreur de création Supabase
- [ ] Erreur d'insertion database

### 8. **Style CSS**
- [ ] Réutiliser les classes existantes (`.card`, `.form-group`, `.btn-primary`)
- [ ] Table responsive pour la liste des users
- [ ] Badge pour le slug preview

---

## 📝 Exemple de Flow

```
1. Admin remplit: Prénom="John", Nom="Doe", Email="john@example.com", Password="123456"
2. Slug généré automatiquement: "john-doe"
3. Clic sur "Créer l'utilisateur"
4. API/RPC crée l'user dans Supabase Auth → UID: abc-123-def
5. Insère dans profiles(id=abc-123-def, slug='john-doe')
6. Insère dans cv_info(user_id=abc-123-def, nom='John Doe')
7. Message: "✅ Utilisateur créé! CV: https://synccv.vercel.app/john-doe"
```

---

## ❓ Questions à Clarifier Avant Implémentation

1. **Quelle option préfères-tu?**
   - Option A (Database Function RPC - recommandé)
   - Option B (API endpoint avec service key)
   - Option C (Manuel via Supabase UI)

2. **Qui peut créer des users?**
   - Tous les utilisateurs connectés?
   - Seulement un super-admin spécifique?

3. **Ordre du slug:**
   - Tu as écrit `[nom]-[prénom]` mais dans tes exemples tu as `ron-more` (prénom-nom)
   - Quel est l'ordre correct?

4. **Afficher la liste des users existants?**
   - Ou juste le formulaire de création?

5. **Envoi d'email de confirmation?**
   - Ou l'utilisateur reçoit ses identifiants par un autre moyen?

---

## 🚨 Raison de la Mise en Attente

**Complexité identifiée:**
- Nécessite la création de Postgres Functions (RPC)
- Configuration RLS avancée
- Gestion de la sécurité admin
- Alternative manuelle via scripts SQL existants plus simple pour l'instant

**Scripts SQL existants disponibles:**
- `/supabase-add-new-user.sql` (version complète)
- `/supabase-add-new-user-minimal.sql` (version minimale)

Ces scripts permettent de créer manuellement des utilisateurs via Supabase SQL Editor en attendant l'implémentation de cette fonctionnalité automatisée.

---

## 🔄 Reprise du Plan

Quand prêt à implémenter, utiliser la commande:

> "Reprends le plan **ADMIN-USER-CREATION**"

---

**Dernière mise à jour:** 2026-01-26
**Maintenu par:** Claude Code + Benoit Gaulin

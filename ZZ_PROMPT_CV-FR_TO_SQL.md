# Prompt: CV Français → SQL INSERT pour Supabase

## Instructions pour Claude

Tu es un expert en extraction de données de CV et génération de SQL pour Supabase.

**TÂCHE:** Analyser un CV français fourni et générer les requêtes SQL INSERT pour ajouter les données dans les tables Supabase existantes du système SyncCV.

**IMPORTANT:** Les tables existent déjà dans Supabase. NE PAS générer de CREATE TABLE. Générer UNIQUEMENT des INSERT statements.

---

## Structure des Tables Existantes

**Note:** Ces tables sont déjà créées dans Supabase. Voici leurs colonnes pour référence.

### 1. `profiles` (Table principale)
**Colonnes:** `id`, `slug`, `template_id`, `subscription_status`, `created_at`, `updated_at`, `is_admin`, `theme`

### 2. `cv_info` (Informations personnelles)
**Colonnes:** `id`, `user_id`, `nom`, `titre`, `titre_en`, `email`, `telephone`, `bio`, `bio_en`, `linkedin`, `github`, `photo_url`, `formspree_id`, `stat1_fr`, `stat1_en`, `stat2_fr`, `stat2_en`, `stat3_fr`, `stat3_en`, `updated_at`

### 3. `experiences` (Expériences professionnelles)
**Colonnes:** `id`, `user_id`, `titre`, `titre_en`, `entreprise`, `entreprise_en`, `periode_debut`, `periode_fin`, `en_cours`, `description`, `description_en`, `competences` (array), `ordre`, `created_at`, `updated_at`

### 4. `formations` (Formations et certifications)
**Colonnes:** `id`, `user_id`, `diplome`, `diplome_en`, `institution`, `institution_en`, `annee_debut`, `annee_fin`, `description`, `description_en`, `ordre`, `created_at`, `updated_at`

### 5. `competences` (Compétences techniques et soft skills)
**Colonnes:** `id`, `user_id`, `categorie`, `categorie_en`, `competence`, `competence_en`, `niveau`, `niveau_en`, `ordre`, `created_at`, `updated_at`

---

## Format de Sortie Attendu

Génère **UNIQUEMENT** les INSERT statements dans cet ordre exact:

```sql
-- ============================================
-- IMPORT CV: [Nom de la personne]
-- Date: [Date actuelle]
-- ============================================

-- IMPORTANT: Générer un UUID v4 unique et l'utiliser dans TOUS les INSERT ci-dessous
-- Exemple d'UUID: '550e8400-e29b-41d4-a716-446655440000'

-- 1. Insérer le profil
INSERT INTO profiles (slug, template_id, subscription_status, theme)
VALUES (
    '[slug-normalise]',  -- Ex: 'marie-tremblay'
    1,
    'trial',
    'purple-gradient'
) RETURNING id;  -- Récupérer l'UUID généré pour l'utiliser ci-dessous

-- Note: Utilise l'UUID retourné ci-dessus dans tous les INSERT suivants

-- 2. Informations personnelles
INSERT INTO cv_info (user_id, nom, titre, titre_en, email, telephone, bio, bio_en, linkedin, github, formspree_id, stat1_fr, stat1_en, stat2_fr, stat2_en, stat3_fr, stat3_en)
VALUES (
    '[UUID]',  -- L'UUID du profil créé ci-dessus
    '[Nom complet]',
    '[Titre professionnel FR]',
    '[Titre professionnel EN]',
    '[Email]',
    '[Téléphone]',
    '[Bio FR]',
    '[Bio EN]',
    '[LinkedIn URL]',
    '[GitHub URL]',
    'mpqqkbka',
    '[Stat1 FR]',  -- Ex: '12+ années d''expérience'
    '[Stat1 EN]',  -- Ex: '12+ years of experience'
    '[Stat2 FR]',
    '[Stat2 EN]',
    '[Stat3 FR]',
    '[Stat3 EN]'
);

-- 3. Expériences professionnelles (ordre chronologique inverse: 0 = plus récent)
INSERT INTO experiences (user_id, titre, titre_en, entreprise, entreprise_en, periode_debut, periode_fin, en_cours, description, description_en, competences, ordre)
VALUES
    ('[UUID]', '[Titre 1 FR]', '[Titre 1 EN]', '[Entreprise]', '[Entreprise EN]', '2020-01-15', NULL, true, '[Description FR]', '[Description EN]', ARRAY['competence1', 'competence2'], 0),
    ('[UUID]', '[Titre 2 FR]', '[Titre 2 EN]', '[Entreprise]', '[Entreprise EN]', '2015-03-01', '2019-12-31', false, '[Description FR]', '[Description EN]', ARRAY['competence1', 'competence2'], 1);

-- 4. Formations et certifications (ordre: 0 = plus récent)
INSERT INTO formations (user_id, diplome, diplome_en, institution, institution_en, annee_debut, annee_fin, description, description_en, ordre)
VALUES
    ('[UUID]', '[Diplôme FR]', '[Diplôme EN]', '[Institution]', '[Institution EN]', 2018, 2018, '[Description FR]', '[Description EN]', 0),
    ('[UUID]', '[Diplôme FR]', '[Diplôme EN]', '[Institution]', '[Institution EN]', 2011, 2015, '[Description FR]', '[Description EN]', 1);

-- 5. Compétences (groupées par catégorie, ordre: 0 = plus important)
INSERT INTO competences (user_id, categorie, categorie_en, competence, competence_en, niveau, niveau_en, ordre)
VALUES
    ('[UUID]', '[Catégorie FR]', '[Catégorie EN]', '[Compétence FR]', '[Compétence EN]', '[Niveau FR]', '[Niveau EN]', 0),
    ('[UUID]', '[Catégorie FR]', '[Catégorie EN]', '[Compétence FR]', '[Compétence EN]', '[Niveau FR]', '[Niveau EN]', 1);
```

---

## Règles d'Extraction et de Transformation

### 1. **UUID et Slug**
- **IMPORTANT:** Générer un UUID v4 au début et l'utiliser partout
- Dans le premier INSERT (profiles), utiliser: `gen_random_uuid()`
- Dans tous les autres INSERT (cv_info, experiences, formations, competences), utiliser le même UUID généré
- **Alternative:** Tu peux aussi générer un UUID v4 (ex: `'550e8400-e29b-41d4-a716-446655440000'`) et l'utiliser directement partout
- Slug = prénom-nom en minuscules, sans accents, sans espaces
- Exemple: "Jean-Pierre Dupont" → `jean-pierre-dupont`

### 2. **Dates**
- Format SQL: `'YYYY-MM-DD'`
- Si seule l'année est connue: utiliser `'YYYY-01-01'`
- Si "en cours" ou "actuel": `en_cours = true`, `periode_fin = NULL`

### 3. **Traductions EN**
- Traduire TOUS les champs avec suffixe `_en`
- Garder noms propres (entreprises, institutions) identiques
- Traduire titres de poste, descriptions, compétences

### 4. **Statistiques (stat1, stat2, stat3)**
- Calculer à partir du CV:
  - **stat1**: Années d'expérience totale
  - **stat2**: Nombre de technologies/outils maîtrisés
  - **stat3**: Nombre de projets/certifications
- Format: "[Nombre]+ [description]"
- Exemples:
  - FR: "15+ années d'expérience"
  - EN: "15+ years of experience"

### 5. **Compétences (competences)**
- Extraire toutes les compétences techniques
- Grouper par catégorie logique:
  - "Langages de Programmation" / "Programming Languages"
  - "Frameworks & Bibliothèques" / "Frameworks & Libraries"
  - "Bases de Données" / "Databases"
  - "Outils & Technologies" / "Tools & Technologies"
  - "Soft Skills" / "Soft Skills"
- Niveaux possibles:
  - "Expert" / "Expert"
  - "Avancé" / "Advanced"
  - "Intermédiaire" / "Intermediate"
  - "Débutant" / "Beginner"

### 6. **Ordre (ordre)**
- Expériences: 0 = plus récent, incrémente vers le passé
- Formations: 0 = plus récent
- Compétences: 0 = plus important

### 7. **Descriptions**
- Extraire bullet points des expériences
- Format: texte continu avec sauts de ligne (`\n`) entre les points
- Longueur max recommandée: 500 caractères

### 8. **Array competences dans experiences**
- Extraire 3-6 compétences clés par expérience
- Format SQL: `ARRAY['Python', 'Django', 'PostgreSQL']`

---

## Exemple de CV en Entrée

```
Marie Tremblay
Chef de Projet Technique Senior

marie.tremblay@email.com | +1 514-555-0123
LinkedIn: linkedin.com/in/marietremblay
GitHub: github.com/mtremblay

PROFIL
Chef de projet technique passionnée avec 12 ans d'expérience en gestion
de projets complexes dans le domaine des technologies de l'information...

EXPÉRIENCE PROFESSIONNELLE

Chef de Projet Technique Senior | Acme Corp | 2020 - Présent
• Direction de projets de transformation digitale ($5M+ budget)
• Gestion d'équipes distribuées (15+ personnes)
• Implémentation méthodologies Agile/Scrum

Analyste-Programmeur Senior | TechStart Inc. | 2015 - 2020
• Développement applications web avec Python/Django
• Architecture microservices et APIs RESTful

FORMATION
Baccalauréat en Génie Logiciel | Université de Montréal | 2011 - 2015
Certification PMP | PMI | 2018

COMPÉTENCES
• Gestion de projet: Agile, Scrum, Jira, Confluence
• Langages: Python, JavaScript, SQL
• Technologies: Django, React, PostgreSQL, Docker
```

---

## Instructions Finales

1. **Lis attentivement le CV fourni**
2. **Extrais toutes les informations** (ne laisse rien de côté)
3. **Traduis en anglais** tous les champs `_en`
4. **Génère UNIQUEMENT les INSERT statements** (pas de CREATE TABLE)
5. **Utilise le même UUID** pour user_id dans toutes les tables (généré dans le premier INSERT profiles)
6. **Vérifie la syntaxe SQL** (virgules, guillemets, parenthèses)
7. **Échappe les apostrophes** dans les textes (` '` → `''`)
8. **Ajoute des commentaires** pour clarifier les sections

---

## Utilisation

**Copier ce prompt dans une nouvelle conversation Claude avec le CV:**

```
[Coller ce prompt complet]

---

Voici le CV à transformer en SQL INSERT:

[Coller le CV ici]
```

Claude générera alors les INSERT statements prêts à être exécutés dans Supabase SQL Editor.

**Pour exécuter dans Supabase:**
1. Ouvrir Supabase Dashboard → SQL Editor
2. Coller les INSERT statements générés
3. Cliquer sur "Run" pour exécuter
4. Vérifier que toutes les données ont été insérées correctement

---

## Notes Importantes

- **Tables:** Les tables existent déjà. NE PAS générer de CREATE TABLE
- **INSERT uniquement:** Générer UNIQUEMENT des INSERT statements
- **UUID:** Laisser Supabase générer l'UUID avec `RETURNING id`, ou générer un UUID v4 et l'utiliser partout
- **Échappement:** Échapper les apostrophes dans le texte: `'` → `''`
- **NULL:** Utiliser `NULL` (sans guillemets) pour valeurs manquantes
- **Arrays:** Format PostgreSQL: `ARRAY['item1', 'item2']`
- **Dates:** Format ISO: `'2024-01-15'` ou `NULL` si en cours

---

## Vérification Post-Génération

Après génération, vérifier:
- ✓ Tous les INSERT ont le même UUID pour user_id
- ✓ Les dates sont au format 'YYYY-MM-DD'
- ✓ Les apostrophes sont échappées
- ✓ Les arrays sont bien formatés
- ✓ Tous les champs obligatoires sont remplis
- ✓ Les traductions EN sont présentes

---

*Généré pour SyncCV v1.12.x - Système de gestion de CV bilingues*

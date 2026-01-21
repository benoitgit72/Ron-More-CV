# Configuration Formspree pour Multi-Clients

Ce guide explique comment configurer un formulaire Formspree unique pour chaque client du CV.

## Architecture

Chaque client peut avoir son propre formulaire Formspree configuré dans la base de données Supabase. Le Form ID est stocké dans la colonne `formspree_id` de la table `cv_info`.

## Étapes de Configuration

### 1. Trouver votre Form ID Formspree

1. Connectez-vous sur [Formspree.io](https://formspree.io)
2. Sélectionnez le formulaire **"Message-to-Ron-More-CV"**
3. L'URL ressemble à : `https://formspree.io/forms/xyzabc123/integration`
4. Le Form ID est la partie entre `/forms/` et `/integration`
   - Exemple : Si l'URL est `https://formspree.io/forms/mabcdefg/integration`
   - Alors le Form ID est : **mabcdefg**

### 2. Ajouter la colonne dans Supabase (une seule fois)

Dans le SQL Editor de Supabase, exécutez le fichier `supabase-add-formspree-column.sql` :

```sql
ALTER TABLE cv_info
ADD COLUMN IF NOT EXISTS formspree_id TEXT;
```

### 3. Configurer le Form ID pour Ron More

Dans le SQL Editor de Supabase, remplacez `VOTRE_FORM_ID_ICI` par votre vrai Form ID :

```sql
UPDATE cv_info
SET formspree_id = 'VOTRE_FORM_ID_ICI'
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';
```

**Exemple concret :**
```sql
UPDATE cv_info
SET formspree_id = 'mabcdefg'
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';
```

### 4. Vérifier la configuration

```sql
SELECT nom, formspree_id
FROM cv_info
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';
```

Vous devriez voir :
```
nom       | formspree_id
----------|-------------
Ron More  | mabcdefg
```

## Comment ça fonctionne

1. Au chargement de la page, `cv-loader.js` charge les données depuis Supabase
2. Si `cv_info.formspree_id` existe, le formulaire de contact est automatiquement configuré
3. L'attribut `action` du formulaire est mis à jour dynamiquement :
   ```html
   <form action="https://formspree.io/f/VOTRE_FORM_ID">
   ```

## Avantages de cette approche

✅ **Multi-client** : Chaque client peut avoir son propre formulaire Formspree
✅ **Pas de code à changer** : Configuration via la base de données uniquement
✅ **Flexibilité** : Changez le Form ID à tout moment sans redéployer
✅ **Scalabilité** : Ajoutez autant de clients que nécessaire

## Pour ajouter un nouveau client

Lorsque vous ajouterez un nouveau client :

1. Créez un nouveau formulaire dans Formspree (ex: "Message-to-John-Doe-CV")
2. Copiez le Form ID
3. Ajoutez-le dans la table `cv_info` pour ce client :

```sql
UPDATE cv_info
SET formspree_id = 'nouveau_form_id'
WHERE user_id = 'uuid_du_nouveau_client';
```

## Fallback

Si aucun `formspree_id` n'est configuré dans Supabase, le formulaire utilisera le Form ID par défaut défini dans `index.html` (ligne 694).

## Vérification dans la Console

Ouvrez la console du navigateur (F12) et recherchez :
```
✅ Formulaire Formspree configuré: mabcdefg
```

Ce message confirme que le Form ID a été configuré dynamiquement.

## Support

- Documentation Formspree : [https://help.formspree.io](https://help.formspree.io)
- Plan gratuit : 50 soumissions/mois
- Plan Plus : 1000 soumissions/mois (10$/mois)

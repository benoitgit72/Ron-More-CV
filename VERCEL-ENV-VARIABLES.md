# Vérification des Variables d'Environnement Vercel

## 🔴 Problème Identifié

L'erreur 500 sur `/api/admin/get-api-limits` est causée par une variable d'environnement manquante:
```
SUPABASE_SERVICE_ROLE_KEY
```

## 🔍 Étape 1: Vérifier les Variables dans Vercel

1. **Ouvrir Vercel Dashboard**: https://vercel.com/dashboard
2. **Sélectionner le projet SyncCV**
3. **Aller dans Settings** (dans le menu de gauche)
4. **Cliquer sur "Environment Variables"**

## ✅ Variables Requises

Vous devez avoir ces 3 variables définies:

| Variable | Valeur | Où la trouver |
|----------|--------|---------------|
| `SUPABASE_URL` | `https://btcdbewqypejzmlwwedz.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` (token public) | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (token secret) | Supabase Dashboard → Settings → API |

## 🔑 Comment Obtenir le SERVICE_ROLE_KEY

1. **Ouvrir Supabase Dashboard**: https://supabase.com/dashboard
2. **Sélectionner votre projet SyncCV**
3. **Aller dans Settings** → **API** (dans la sidebar)
4. **Scroller jusqu'à "Project API keys"**
5. **Copier la clé "service_role"** (⚠️ **SECRET** - NE PAS partager!)

**Note**: Le `service_role` key est différent du `anon` key. Il a des permissions complètes et bypass RLS.

## ➕ Ajouter la Variable dans Vercel

Si `SUPABASE_SERVICE_ROLE_KEY` est manquante:

1. Dans Vercel → Settings → Environment Variables
2. Cliquer sur **"Add New"**
3. **Key**: `SUPABASE_SERVICE_ROLE_KEY`
4. **Value**: Coller le service_role key de Supabase
5. **Environments**: Sélectionner **Production**, **Preview**, et **Development**
6. Cliquer sur **"Save"**

## 🚀 Redéployer Après Ajout

⚠️ **IMPORTANT**: Les variables d'environnement ne sont appliquées qu'au prochain déploiement!

Pour forcer un redéploiement:

### Option 1: Redéployer via Vercel Dashboard
1. Aller dans **Deployments**
2. Cliquer sur le dernier déploiement
3. Cliquer sur les 3 points (**⋯**) → **"Redeploy"**
4. Confirmer

### Option 2: Push un commit vide
```bash
git commit --allow-empty -m "Redeploy: Apply environment variables"
git push origin main
```

Vercel va automatiquement redéployer avec les nouvelles variables.

## 🧪 Vérification Post-Déploiement

Après le redéploiement (~2 minutes):

1. **Rafraîchir l'admin panel** (Ctrl+Shift+R)
2. **Cliquer sur "Limites API"**
3. Si ça fonctionne, vous verrez les 5 cartes de limites
4. Si erreur 500 persiste, vérifier les logs Vercel

## 📊 Vérifier les Logs Vercel

Si le problème persiste après avoir ajouté la variable:

1. Aller dans Vercel Dashboard → **Deployments**
2. Cliquer sur le dernier déploiement
3. Aller dans l'onglet **"Runtime Logs"**
4. Chercher les erreurs liées à `/api/admin/get-api-limits`

Vous devriez voir soit:
- ✅ `✅ API limits fetched successfully` (succès)
- ❌ `❌ Missing environment variables` (variable manquante)
- ❌ Autre erreur (problème différent)

## 🔒 Sécurité

**⚠️ ATTENTION**: Le `SUPABASE_SERVICE_ROLE_KEY` est une clé **HAUTEMENT SENSIBLE**!

- ✅ **À FAIRE**: L'ajouter dans Vercel Environment Variables
- ✅ **À FAIRE**: Ne jamais la committer dans Git
- ❌ **NE PAS**: La partager dans Slack, email, etc.
- ❌ **NE PAS**: L'utiliser côté client (browser)

Cette clé a un accès complet à votre base de données Supabase et bypass toutes les Row Level Security policies.

## 📝 Checklist Complète

- [ ] Variable `SUPABASE_URL` existe dans Vercel
- [ ] Variable `SUPABASE_ANON_KEY` existe dans Vercel
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` existe dans Vercel
- [ ] Les 3 variables sont définies pour Production, Preview, Development
- [ ] Redéploiement déclenché après ajout de variable
- [ ] Déploiement terminé avec succès (statut vert)
- [ ] Admin panel testé: Section "Limites API" charge sans erreur 500
- [ ] Les 5 cartes de limites s'affichent correctement

## 🆘 Dépannage

### Erreur: "Missing environment variables"
**Cause**: Variable non définie dans Vercel
**Solution**: Ajouter `SUPABASE_SERVICE_ROLE_KEY` et redéployer

### Erreur 500 persiste après ajout
**Cause**: Déploiement pas encore fait avec les nouvelles variables
**Solution**: Redéployer manuellement ou push un commit

### Erreur: "Invalid or expired token"
**Cause**: Le service_role key est incorrect
**Solution**: Vérifier que vous avez copié la bonne clé depuis Supabase (pas l'anon key!)

### Les limites se chargent mais affichent 0 résultats
**Cause**: Migration SQL pas exécutée ou RLS policies manquantes
**Solution**: Vérifier que les scripts SQL ont bien été exécutés dans Supabase

---

**Une fois ces étapes complétées, le système de gestion des limites API devrait être 100% fonctionnel!** 🎉

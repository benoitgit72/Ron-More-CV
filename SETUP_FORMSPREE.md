# Configuration du Formulaire de Contact avec Formspree

Ce guide vous explique comment configurer le formulaire de contact sécurisé pour votre CV.

## Pourquoi Formspree ?

✅ **Gratuit** : 50 soumissions/mois sur le plan gratuit
✅ **Sécurisé** : Votre email reste caché
✅ **Anti-spam** : Protection intégrée contre les bots
✅ **Facile** : Configuration en 5 minutes

## Étapes de Configuration

### 1. Créer un compte Formspree

1. Allez sur [https://formspree.io](https://formspree.io)
2. Cliquez sur **"Get Started"** ou **"Sign Up"**
3. Créez un compte avec votre email (celui où vous voulez recevoir les messages)

### 2. Créer un nouveau formulaire

1. Une fois connecté, cliquez sur **"+ New Form"**
2. Donnez-lui un nom : `CV Contact Form` ou `Benoit Gaulin - Contact`
3. Formspree va générer un **Form ID** unique (format : `xyzabc123`)

### 3. Configurer votre formulaire

Dans les paramètres du formulaire Formspree :

**Email Settings:**
- ✅ Email Notifications: ON
- ✅ Email pour recevoir les messages : Votre email professionnel
- ✅ Subject line : "Nouveau message depuis votre CV - {{subject}}"

**Spam Protection:**
- ✅ reCAPTCHA : ON (recommandé)
- ✅ Honeypot : ON (déjà dans le code)

**Success Message:**
- Message de succès personnalisé : "Merci ! Votre message a été envoyé. Je vous répondrai sous 24-48h."

### 4. Mettre à jour votre site web

1. Copiez votre **Form ID** depuis Formspree (exemple: `mwkadpqr`)

2. Ouvrez le fichier `index.html`

3. Trouvez cette ligne (ligne ~438) :
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

4. Remplacez `YOUR_FORM_ID` par votre vrai Form ID :
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/mwkadpqr" method="POST">
   ```

5. Sauvegardez le fichier

### 5. Mettre à jour vos liens sociaux

Dans le fichier `index.html`, ligne ~424 et ~429 :

**LinkedIn** (remplacez par votre vrai profil) :
```html
<a href="https://www.linkedin.com/in/votre-profil" target="_blank" rel="noopener noreferrer" class="social-link">
```

**GitHub** (déjà configuré) :
```html
<a href="https://github.com/benoitgit72" target="_blank" rel="noopener noreferrer" class="social-link">
```

### 6. Tester le formulaire

1. Ouvrez votre site web
2. Remplissez le formulaire de contact
3. Envoyez un message test
4. Vérifiez votre email - vous devriez recevoir le message !

## Commit et Push des modifications

Une fois configuré, poussez vos changements sur GitHub :

```bash
cd /Users/macbook-air.dev/Benoit-Gaulin-CV
git add .
git commit -m "Configure secure contact form with Formspree"
git push origin main
```

## Plan Gratuit vs Payant

### Plan Gratuit (0$/mois) :
- ✅ 50 soumissions/mois
- ✅ Protection anti-spam de base
- ✅ Notifications email
- ❌ Pas de téléchargement de fichiers
- ❌ Pas d'intégrations avancées

### Plan Plus (10$/mois) :
- ✅ 1000 soumissions/mois
- ✅ Téléchargement de fichiers
- ✅ Webhooks et intégrations
- ✅ Support prioritaire

**Recommandation** : Commencez avec le plan gratuit, c'est largement suffisant pour un CV.

## Alternatives si vous dépassez 50 messages/mois

1. **Netlify Forms** : 100 soumissions/mois gratuites
2. **EmailJS** : 200 emails/mois gratuits
3. **Créer votre propre backend** avec Node.js + Nodemailer

## Sécurité

✅ Votre email **n'est jamais exposé** dans le code source
✅ Protection anti-spam avec honeypot (champ caché)
✅ reCAPTCHA optionnel pour bloquer les bots
✅ HTTPS automatique via GitHub Pages

## Support

Si vous avez des problèmes :
1. Vérifiez que le Form ID est correct
2. Consultez la documentation : [https://help.formspree.io](https://help.formspree.io)
3. Testez sur GitHub Pages (pas en local avec file://)

## Statistiques

Une fois configuré, Formspree vous permet de :
- ✅ Voir combien de messages vous recevez
- ✅ Télécharger l'historique des soumissions
- ✅ Bloquer des adresses IP spammeuses
- ✅ Exporter les données en CSV

---

**Prêt à activer votre formulaire ?** Suivez les étapes ci-dessus ! 🚀

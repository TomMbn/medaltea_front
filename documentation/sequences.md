# Diagrammes de séquence

Les principaux parcours, avec ce qui transite et où. (« Passerelle » = `/api/backend/*`.)

## 1. Connexion

```mermaid
sequenceDiagram
  actor U as Utilisateur
  participant N as Navigateur
  participant S as Route serveur /api/login
  participant A as API NestJS

  U->>N: e-mail + mot de passe
  N->>S: POST /api/login
  S->>S: ne garde que mail et password
  S->>A: POST /auth/login
  A-->>S: jeton d'accès
  S->>A: GET /users/me (jeton)
  A-->>S: rôle (patient, pro ou admin)
  S-->>N: Set-Cookie token (httpOnly) + témoins d'interface<br/>corps : rôle seulement, jamais le jeton
  N->>N: redirection selon le rôle (/chatbot, /pro, /admin)
  Note over N,A: Identifiants faux : l'API répond 401, le site affiche « Identifiants incorrects », aucun cookie n'est posé
```

## 2. Recherche d'un praticien par ville

```mermaid
sequenceDiagram
  actor U as Visiteur
  participant N as Navigateur
  participant P as Page (rendu serveur)
  participant V as Route /api/place
  participant G as Géoplateforme IGN
  participant W as Passerelle
  participant A as API NestJS

  U->>N: saisit « Cholet »
  N->>P: GET /trouver-un-praticien?q=Cholet
  P->>V: reconnaître la commune ?
  V->>G: recherche d'une commune nommée Cholet
  G-->>V: commune + coordonnées
  V-->>P: oui (nom exact) : centre de Cholet
  P->>W: GET praticiens?lat&lng&radiusKm=15
  W->>W: valide les paramètres
  W->>A: GET /praticiens (liste blanche)
  A-->>W: fiches triées par distance
  W-->>P: sans champs privés
  P-->>N: page avec résultats
  Note over V,P: Texte qui n'est pas une commune (un nom) : recherche par nom avec le paramètre q
```

## 3. Réservation d'un rendez-vous (compte patient)

```mermaid
sequenceDiagram
  actor U as Patient
  participant N as Navigateur
  participant W as Passerelle
  participant A as API NestJS
  actor P as Praticien

  U->>N: ouvre la fiche, choisit une prestation et un jour
  N->>W: GET praticiens/{id}/slots
  W->>A: créneaux libres
  A-->>N: liste de créneaux
  U->>N: choisit un créneau, motif facultatif (500 caractères)
  N->>W: POST appointments {praticienId, prestation, startAt, motif}
  W->>W: valide les types et la longueur du motif
  W->>A: POST /appointments (Bearer)
  alt créneau encore libre
    A-->>N: 201, statut « en attente » ou « confirmé » (confirmation automatique)
    A--)P: notification push neutre « Nouvelle demande de rendez-vous »<br/>(envoi par l'API, à vérifier de bout en bout avec de vrais comptes)
  else créneau pris entre-temps
    A-->>N: 409, le site propose d'autres créneaux
  end
  P->>A: confirme, refuse ou propose un autre créneau
  A--)U: notification push neutre
```

Réservation **sans compte** : même parcours avec un jeton anti-robot Cloudflare Turnstile et un lien de gestion secret (43 caractères) renvoyé à la création ; c'est l'API qui vérifie le jeton.

## 4. Assistant IA

```mermaid
sequenceDiagram
  actor U as Utilisateur connecté
  participant N as Navigateur
  participant C as Route serveur /api/chat
  participant A as API NestJS
  participant G as Google Gemini

  U->>N: pose une question
  N->>C: POST /api/chat {message, historique}
  C->>A: GET /users/me (vérifie le jeton, mis en cache 60 s)
  A-->>C: identité
  C->>C: valide et borne l'entrée, vérifie le quota du jour
  C->>G: message + historique + consignes (domaine, urgences)
  G-->>C: réponse en flux
  C-->>N: texte en flux
  N->>N: rendu Markdown assaini (DOMPurify)
  N->>N: pastilles de médecines, bouton praticiens proches
  Note over C,G: Le site ne stocke ni le message ni la réponse<br/>Google traite le texte selon ses conditions (sous-traitant déclaré)
```

## 5. Notifications push

```mermaid
sequenceDiagram
  actor U as Utilisateur
  participant N as Navigateur
  participant SW as Service worker
  participant W as Passerelle
  participant A as API NestJS
  participant PS as Service push du navigateur

  U->>N: clique « Activer les notifications »
  N->>N: demande l'autorisation du navigateur
  N->>W: GET push/public-key
  W->>A: clé publique VAPID
  N->>SW: enregistre le service worker
  N->>PS: crée l'abonnement (clé publique)
  N->>W: POST push/subscriptions {endpoint, clés}
  W->>A: stocke l'abonnement du compte
  A--)PS: événement (nouvelle demande, confirmation, rappel de 18 h)
  PS--)SW: message neutre (titre, texte court, adresse relative)
  SW->>U: affiche la notification
  U->>SW: clique
  SW->>N: ouvre la page indiquée (même site uniquement)
  Note over N,A: À la déconnexion, l'abonnement est retiré du compte et du navigateur
```

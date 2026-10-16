# Documentation technique

| Document | Contenu |
|---|---|
| [architecture.md](architecture.md) | Schéma d'architecture, composants, emplacement des données, choix de conception, limites |
| [sequences.md](sequences.md) | Diagrammes de séquence : connexion, recherche par ville, réservation, assistant IA, notifications |
| [deploiement-ci-cd.md](deploiement-ci-cd.md) | Chaîne de livraison, intégration continue, environnements, retour arrière, performances, points à traiter |
| [donnees-personnelles.md](donnees-personnelles.md) | Flux de données, registre des traitements (RGPD), points à traiter |
| [ia-act.md](ia-act.md) | Classification de l'assistant au regard de l'IA Act, mesures, risques résiduels |
| [choix-technologiques.md](choix-technologiques.md) | Pile retenue, alternatives, mesures, éco-conception, veille |
| [../tests/README.md](../tests/README.md) | Stratégie et scénarios de tests |
| [../README.md](../README.md) | Présentation, installation, scripts |

Les schémas sont écrits en [Mermaid](https://mermaid.js.org/) : GitHub les affiche directement, et ils se modifient comme du texte (donc suivent le code dans l'historique).

## Schémas exportés

Le dossier [schemas/](schemas/) contient chaque diagramme en **Mermaid** (source), **SVG** (vectoriel) et **PNG** (pour un document Word ou un diaporama). Pour les régénérer après une modification :

```bash
npx @mermaid-js/mermaid-cli -i documentation/schemas/architecture.mmd -o documentation/schemas/architecture.svg -b white
```

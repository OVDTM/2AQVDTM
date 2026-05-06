# Explication du MCD et du MLD

## 1. Objectif du modèle

Le Modèle Conceptuel de Données (MCD) et le Modèle logique de données (MLD) ont été conçu avec l'application Looping, pour représenter de manière structurée le fonctionnement d’une exploitation agricole dans une application web.  
L’objectif est de permettre à un agriculteur de gérer l’ensemble de son activité : ses parcelles, ses cultures, ses équipements, ses stocks, ses animaux et le suivi global de son exploitation.

---

## 2. Entité centrale : la FERME

L’entité **FERME** est au cœur du modèle.

Elle représente une exploitation agricole et sert de point de rattachement pour la majorité des données :
- une ferme contient des parcelles
- une ferme possède des équipements
- une ferme élève des animaux
- une ferme gère des stocks
- une ferme possède éventuellement des silos

Ce choix permet de centraliser toutes les informations autour d’un seul élément logique.

---

## 3. Gestion des utilisateurs

L’entité **UTILISATEUR** représente les personnes utilisant l’application.

Relation MCD :
- Un utilisateur **GERE** une ferme

Choix :
- un utilisateur peut gérer plusieurs fermes (0,n)
- une ferme est gérée par un utilisateur (1,1)

Dans le cas de notre application, une ferme ne peut pas être gérée par plusieurs comptes différents à la fois. Nous partons du principe que plusieurs personnes gérant la même ferme utiliseraient simplement le même compte.

---

## 4. Gestion des parcelles

L’entité **PARCELLE** représente une zone de terrain exploitée.

Attributs :
- nom
- localisation
- surface

Relation MCD:
- La ferme **CONTIENT** des parcelles

Choix :
- une ferme possède plusieurs parcelles (1,n)
- une parcelle appartient à une seule ferme (1,1)

Cela reflète l’organisation réelle d’une exploitation agricole.

---

## 5. Gestion des cultures

L’entité **CULTURES** représente les cultures réalisées sur les parcelles.

Attributs :
- type
- date_semis

Relation MCD :
- Une parcelle **CULTIVE** des cultures 

Choix :
- une parcelle peut avoir au maximum une culture à un instant donné (0,1)
- une culture est associée à une seule parcelle (1,1)

En effet notre application a fait le choix de n'avoir qu'un seul type de culture par parcelle, pour simplifier l'utilisation.

---

## 6. Observations terrain

L’entité **OBSERVATION** permet de suivre l’état des parcelles.

Attributs (récupérés depuis le jeu de données):
- état
- commentaire
- date

Relation MCD:
- Les parcelles **OBSERVE** des observations

Choix :
- une parcelle peut avoir plusieurs observations (0,n)
- une observation concerne une seule parcelle (1,1)

Cela permet un suivi régulier de l’évolution des cultures.

---

## 7. Système d’alertes

L’entité **ALERTES** représente les notifications liées aux parcelles.

Attributs (récupérés depuis le jeu de données):
- date
- type
- niveau

Relation :
- Chaque parcelle **ENVOIE** des alertes

Choix :
- une parcelle peut générer plusieurs alertes (0,n)
- une alerte est liée à une seule parcelle (1,1)

Ce système permet de signaler des événements importants (météo, problème, etc.).

---

## 8. Gestion des équipements

L’entité **EQUIPEMENT** représente le matériel agricole.

Attributs :
- type_equipement
- nom
- état

Relation MCD :
- Une ferme **POSSEDE** des équipements

Choix :
- une ferme peut posséder plusieurs équipements (0,n)
- un équipement appartient à une seule ferme (1,1)

---

## 9. Gestion des animaux

L’entité **ANIMAUX** représente le nombre d'animaux possédés par la ferme, selon leur espèce.

Attributs :
- type d’animal
- nombre

Relation :
- Une ferme **ELEVE** des animaux

Choix :
- une ferme peut élever plusieurs types d’animaux (0,n)
- un type d’animal est associé à une seule ferme (1,1)

Ce modèle simplifie la gestion en regroupant les animaux par type.

---

## 10. Gestion des stocks

L’entité **STOCK_CULTURES** représente les ressources stockées.

Attributs :
- type
- nombre
- statut
- date_possede

Relation :
- La ferme **STOCK** les stocks de culture.

Choix :
- une ferme peut avoir plusieurs stocks (0,n)
- un stock appartient à une seule ferme (1,1)

---

## 11. Gestion des silos

L’entité **SILO** représente les structures de stockage.

Attributs :
- nom
- pourcentage de remplissage (qui serait détecté avec des capteurs dans le cas d'une vraie ferme)

Relation :
- Une ferme **A** des silos

Choix :
- une ferme peut posséder plusieurs silos (0,n)
- un silo appartient à une seule ferme (1,1)

---

## 12. Données météorologiques

L’entité **METEO** représente les conditions climatiques. Les données météo sont obtenues grâce à une API, cependant nous avons également créés une table pour stocker l'historique des données et les exploiter dans l'application.

Attributs :
- température
- humidité
- pluie
- date-heure

Relation :
- L'utilisateur **CONSULTE** la météo

Choix :
- un utilisateur peut consulter plusieurs données météo (0,n)
- une donnée météo est consultée par un utilisateur (1,1)

Cela permet d’intégrer des informations utiles à la prise de décision.

---

## 13. Conclusion

Ces modèles ont été conçu pour représenter fidèlement les besoins d’une application de gestion agricole.

Les choix réalisés permettent :
- une organisation claire autour de la ferme
- une bonne séparation des concepts
- une modélisation adaptée au domaine agricole
- une base solide pour une implémentation en base de données relationnelle

Le modèle reste volontairement simplifié afin de rester compréhensible tout en couvrant les fonctionnalités principales de l’application.
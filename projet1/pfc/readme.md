# Projet Pierre-Feuille-Ciseaux (Projet 1 JSFS)
# Riad SABIR 

<p>

Pour Lancer le jeu éxecuter ces commandes l'une après l'autre , dans le folder ./server/ 

 ` npm install `

 ` npm run build `

 ` nodemon `


Ouvrir un navigateur Web et taper :  `localhost:8080/`

</p>


### Attention : Malgré toutes mes tentatives pour ne pas importer Core.js dans index.html, error.html et about.html en créant le projet avec npm run build, rien n'a voulu fonctionner. Cela crée une petite gêne au niveau du côté client qui devra saisir son nom à chaque fois qu'il accède à l'une de ces pages.

<p>
même avec              excludeChunks: ['Core.js','Core','Core.bundle.js','Core.bundle']

</p>

## Implemented Features : 


6 Games in order to decide who is gonna be the winner 

<br>

Interactive PlayAgainBtn when the game has ended , Button must be pressed by both players in order to relaunch the game 

<br>

Player Names display after the first round 

<br> Others features mentionned in the subject 

<br> Console Logs and Client Logs in order to keep track of the game events . 

<br> Je n'ai pas eu le temps de finir la Partie-IA mais la logique de l'IA et la génération automatique de la requête qu'elle enverra se trouve dans ./client/pfcia/scripts/ia.js


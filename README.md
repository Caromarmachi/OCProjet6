
Instructions pour installer le projet

Repository Github :

Voici le lient Github avec le code du projet : https://github.com/Caromarmachi/OCProjet6.git

Le projet se compose de 3 ressources principales, et d'autres fichiers: 
- index.html		(le point d'entrée HTML du projet)
- style/main.css	(le fichier CSS de définition du style)
- jscript/main.js	(le fichier javascript contenant toutes les fonctions nécessaires au bon fonctionnement de l'application)
Vous récupèrerez également d'autres ressources nécessaires : 
- les images dans le répertoire images
- des fichiers utilisés par SASS (l'outil qui génère le fichier CSS à partir de notre fichier SCSS)
	 - package.json + fichiers dans le répertoire node_modules

Concernant SASS : 
- J'ai installé tout d'abord NODE.JS depuis le site https://nodejs.org/en
- en me positionnant dans le répertoire du projet j'ai lancé les commandes :
> npm init -y
> npm install sass
Dans le fichier package.json généré j'ai ajouté les lignes suivantes : 
"scripts": {
   "compile": "sass style/main.scss style/main.css --watch"
}

En phase de développement, afin que notre fichier CSS soit généré automatiquement à chaque changement je dois lancer la commande : 
> npm run compile


Pour lancer le projet et utiliser l'application : 

Une fois les ressources ci-dessus récupérées du dépot GIT, il vous suffit de lancer le fichier index.html dans votre navigateur.
Vous pouvez ensuite utiliser l'application (effectuer des recherches, ajouter des livre dans votre pochListe, etc.).





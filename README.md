Le but c'est de faire une macro qui peut liker le titre en cours de lecture.
Pour cela on va paramétrer notre clavier pour exécuter du code python qui va demander au Web API de Spotify quel titre est en cours de lecture puis de le liker.

Il faut Python (j'ai la version 3.11.9) et la librairie "requests".
Ainsi que Node.js (j'ai la version 20.11.0) et les modules "express" et "querystring".

Donc d'abord il faut mettre dans "config.js" le "client_id" et "client_secret" de notre application que l'on a créée ici: https://developer.spotify.com/dashboard.

Donc faut lancer "app.js" avec Node.js. Aller à l'adresse qu'il donne. Puis autoriser notre application à faire certaines choses, à savoir obtenir le titre en cours de lecture et liker un titre.
Normalement ça va configurer automatiquement le "access_token" et le "refresh_token" dans "config.js".

Maintenant dès que l'on lance "main.py" avec Python ça like le titre en cours de lecture.

Donc il suffit de créer une macro qui lance le script et le tour est joué !

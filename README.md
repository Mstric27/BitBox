# BitBox

BitBox is a React Native application that takes an image of a collection of board games and identifies all the board games shown. This application uses the Microsoft Azure AI Vision services in order to identify the location and text of each board game. After it retrieves the board game data, it searches through the boardgamegeek.com API and returns the most likely results back to the user. It also uses Firebase authentication and database features to allow the user to add any board game they indentify to their own personal online collection.

# Video Demo

This link here is a demo of the app and its UI.

https://youtu.be/NcveBjLxhbw

# Set Up: 

Note: This project assumes that you have node.js and ngrok already set up.

Open your terminal and go to a suitable directory. Execute the terminal commands below: 

git clone https://github.com/Mstric27/BitBox.git

cd BitBox

copy .env.copy .env

mkdir ./server/images

npm install


Make a Microsoft Azure account and create a resource group with Azure's Computer Vision services, you must also go to https://www.customvision.ai and create a new project. In your Custom Vision project create and train a model for object detection.
Finally, paste all of the required keys and endpoints to the corresponding variables in the .env file. 

Additionally, go to https://firebase.google.com/ and create a new project. Add a web app to the project and copy the FirebaseConfig info into ./public/Firebase.js .

Open three terminal windows in the same BitBox directory. Enter one of these commands for each window:

npm start

npm run server

ngrok http 3000


In the window where you used ngrok, copy the forwarding url and paste it in "./public/screens/LoadingScreen.js" and "./public.screens/Search.js" - the four locations where this url should be pasted is denoted by " %here% ".

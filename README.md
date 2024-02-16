# BitBox

BitBox is a React Native application that takes an image of a collection of boardgames and identifies all the boardgames shown. This application uses the Microsoft Azure AI Vision services in order to identify the location and text of each boardgame. After it retrieves the boardgame data, it searches through the boardgamegeek.com API and returns the most likely results back to the user.

# Set Up: 

Note: This project assumes that you have node.js and ngrok already set up.

Open your terminal and go to a suitable directory. Follow the following terminal commands: 

git clone https://github.com/Mstric27/BitBox.git

cd BitBox

copy .env.copy .env

mkdir ./server/images

npm install


Make a Microsoft Azure account and create a resource group with Azure's Computer Vision services you must also go to https://www.customvision.ai and create a new project. 
Then, paste all of the reqired keys and endpoints. 

Open three terminal windows in the same BitBox directory. Enter one of these commands for each window:

npm start

npm run server

ngrok http 3000


In the window where you used ngrok, copy the forwarding url and paste it in "./public/screens/LoadingScreen.js" the two locations where this url should be pasted is denoted by " %here% ".
